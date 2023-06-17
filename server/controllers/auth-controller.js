'use strict';

const Iron = require('@hapi/iron');

const wristbandService = require('../services/wristband-service');
const { APPLICATION_LOGIN_URL, AUTH_CALLBACK_URL, INVOTASTIC_HOST } = require('../utils/constants');
const {
  clearSessionCookies,
  createCodeChallenge,
  createUniqueCryptoStr,
  getAndClearLoginStateCookie,
  initSessionData,
  setNoCacheHeaders,
  toQueryString,
  updateCsrfTokenAndCookie,
  updateLoginStateCookie,
} = require('../utils/util');

const { APPLICATION_DOMAIN, CLIENT_ID, LOGIN_STATE_COOKIE_SECRET } = process.env;

exports.authState = async (req, res) => {
  const { session } = req;

  setNoCacheHeaders(res);

  // Since this API is the entrypoint for the React app, it is responsible for sending
  // the initial CSRF token cookie back to the client.
  if (session && session.accessToken && session.refreshToken && session.csrfSecret) {
    updateCsrfTokenAndCookie(req, res);
    return res.status(200).json({ isAuthenticated: true });
  }

  return res.status(200).json({ isAuthenticated: false });
};

exports.login = async (req, res, next) => {
  const { return_url: returnUrl } = req.query;

  setNoCacheHeaders(res);

  const state = createUniqueCryptoStr();
  const codeVerifier = createUniqueCryptoStr();
  const loginStateData = { state, codeVerifier, returnUrl };

  try {
    // Store this auth request in a cookie for later when Wristband redirects to the callback endpoint.
    const sealedLoginStateData = await Iron.seal(loginStateData, LOGIN_STATE_COOKIE_SECRET, Iron.defaults);
    updateLoginStateCookie(req, res, state, sealedLoginStateData);

    const query = toQueryString({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: AUTH_CALLBACK_URL,
      state,
      scope: `openid offline_access`,
      code_challenge: createCodeChallenge(codeVerifier),
      code_challenge_method: 'S256',
      nonce: createUniqueCryptoStr(),
    });

    /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
    // Redirect out to the Wristband authorize endpoint to start the login process via OAuth2 Auth Code flow.
    return res.redirect(`http://${APPLICATION_DOMAIN}/api/v1/oauth2/authorize?${query}`);
  } catch (error) {
    return next(error);
  }
};

exports.authCallback = async (req, res, next) => {
  const { code, state, error: callbackError, error_description: errorDescription } = req.query;

  setNoCacheHeaders(res);

  // Always clear the login state cookie after grabbing it.
  const loginStateCookie = getAndClearLoginStateCookie(req, res, state);

  if (!loginStateCookie) {
    console.error(`Login state cookie not found. Redirecting to application-level login.`);
    return res.redirect(APPLICATION_LOGIN_URL);
  }

  try {
    const unsealedLoginStateData = await Iron.unseal(loginStateCookie, LOGIN_STATE_COOKIE_SECRET, Iron.defaults);
    const { codeVerifier, returnUrl, state: cookieState } = unsealedLoginStateData;

    // Safety check
    if (state !== cookieState) {
      console.warn(`Cookie state [${cookieState}] not equal to query state [${state}]`);
      return res.redirect(`http://${INVOTASTIC_HOST}/api/auth/login`);
    }

    if (callbackError) {
      if (callbackError.toLowerCase() === 'login_required') {
        return res.redirect(`http://${INVOTASTIC_HOST}/api/auth/login`);
      }

      throw new Error(`${callbackError}: ${errorDescription}`);
    }

    /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
    // Now exchange the auth code for a new access token.
    const tokenData = await wristbandService.exchangeAuthCodeForTokens(code, AUTH_CALLBACK_URL, codeVerifier);
    const { access_token: accessToken } = tokenData;

    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    // Get a minimal set of the user's data to store in their session data.
    const userinfo = await wristbandService.getOauth2Userinfo(accessToken);

    // Save the user's application session data into the session cookie.
    initSessionData(req, tokenData, userinfo);
    await req.session.save();

    // Send the user back to the Invotastic application.
    return res.redirect(returnUrl || `http://${INVOTASTIC_HOST}/home`);
  } catch (error) {
    return next(error);
  }
};

exports.logout = async (req, res) => {
  const { session } = req;

  setNoCacheHeaders(res);

  // Always clear the session and CSRF cookies.
  clearSessionCookies(res);

  if (session) {
    // Revoke the refresh token only if present.
    if (session.refreshToken) {
      try {
        /* WRISTBAND_TOUCHPOINT - RESOURCE API */
        await wristbandService.revokeRefreshToken(session.refreshToken);
      } catch (error) {
        console.error(`Revoking token during logout failed due to: ${error}`);
      }
    }

    // Always destroy session if present.
    session.destroy();
  }

  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  // Always perform logout redirect to the Wristband logout endpoint.
  return res.redirect(`http://${APPLICATION_DOMAIN}/api/v1/logout?client_id=${CLIENT_ID}`);
};
