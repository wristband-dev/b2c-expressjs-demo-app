'use strict';

const express = require('express');

const authRoutes = require('./auth-routes');
const apiRoutes = require('./api/index');
const accessTokenHandler = require('../middleware/access-token-handler');
const csrfTokenCookieHandler = require('../middleware/csrf-token-handler');

const router = express.Router();

// All APIs that are called from an unauthenticated state.
router.use('/auth', authRoutes);

/* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
// The middlewares here ensures an authenticated user's JWTs/session data/CSRF token exists.
// The access token handler will automatically attempt to refresh expired access tokens.
router.use('/v1', [accessTokenHandler, csrfTokenCookieHandler], apiRoutes);

module.exports = router;
