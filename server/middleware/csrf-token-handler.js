'use strict';

const { isCsrfTokenValid, updateCsrfTokenAndCookie } = require('../utils/util');

// Middleware that validates that a CSRF token is present in the request header and is valid
// when compared against the secret stored in the user's session store.  After validation,
// a new CSRF token is generated and set into the CSRF response cookie.  This cookie has the same
// max age as the session cookie since the CSRF secret is stored in the user's session store.
const csrfTokenCookieHandler = async function (req, res, next) {
  if (!isCsrfTokenValid(req)) {
    return res.status(403).send();
  }

  updateCsrfTokenAndCookie(req, res);
  return next();
};

module.exports = csrfTokenCookieHandler;
