'use strict';

const { APPLICATION_DOMAIN, CLIENT_ID, CLIENT_SECRET, DOMAIN_FORMAT } = process.env;

exports.IS_LOCALHOST = DOMAIN_FORMAT === 'LOCALHOST';
exports.INVOTASTIC_HOST = this.IS_LOCALHOST ? 'localhost:6001' : 'app.invotastic.com:6001';

exports.APPLICATION_LOGIN_URL = `http://${APPLICATION_DOMAIN}/login`;
exports.AUTH_CALLBACK_URL = `http://${this.INVOTASTIC_HOST}/api/auth/callback`;
exports.BASIC_AUTH_AXIOS_CONFIG = {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  auth: { username: CLIENT_ID, password: CLIENT_SECRET },
};
exports.CSRF_TOKEN_COOKIE_NAME = 'XSRF-TOKEN';
exports.FORBIDDEN_ACCESS_RESPONSE = { code: 'Access denied.', message: 'Forbidden access.' };
exports.INVALID_PHONE_NUMBER = 'Invalid phone number provided.';
exports.INVALID_REQUEST = 'Invalid request.';
exports.LOGIN_STATE_COOKIE_PREFIX = 'login:';
exports.NOT_FOUND = 'Not found.';
exports.SESSION_COOKIE_NAME = 'sid';

exports.InvoiceStatus = Object.freeze({ SENT: 'SENT', CANCELLED: 'CANCELLED', PAID: 'PAID' });
