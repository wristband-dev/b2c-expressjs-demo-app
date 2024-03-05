'use strict';

exports.IS_LOCALHOST = process.env.DOMAIN_FORMAT === 'LOCALHOST';
exports.INVOTASTIC_HOST = this.IS_LOCALHOST ? 'localhost:6001' : 'app.invotastic.com:6001';

exports.APPLICATION_LOGIN_URL = `https://${process.env.APPLICATION_DOMAIN}/login`;
exports.AUTH_CALLBACK_URL = `http://${this.INVOTASTIC_HOST}/api/auth/callback`;
exports.BASIC_AUTH_AXIOS_CONFIG = {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  auth: { username: process.env.CLIENT_ID, password: process.env.CLIENT_SECRET },
};
exports.CSRF_TOKEN_COOKIE_NAME = 'XSRF-TOKEN';
exports.FORBIDDEN_ACCESS_RESPONSE = { code: 'Access denied.', message: 'Forbidden access.' };
exports.INVALID_PHONE_NUMBER = 'Invalid phone number provided.';
exports.INVALID_REQUEST = 'Invalid request.';
exports.LOGIN_STATE_COOKIE_PREFIX = 'login:';
exports.LOGIN_STATE_COOKIE_SECRET = '27c149dd-9a93-40ce-967d-00bab57914d4';
exports.NOT_FOUND = 'Not found.';
exports.SESSION_COOKIE_NAME = 'sid';
exports.SESSION_COOKIE_SECRET = 'f55e058a-906a-4d98-b6be-40e60903f780';
exports.TRUST_SELF_SIGNED_CERT = true;

exports.InvoiceStatus = Object.freeze({ SENT: 'SENT', CANCELLED: 'CANCELLED', PAID: 'PAID' });
