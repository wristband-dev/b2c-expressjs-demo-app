'use strict';

/* WRISTBAND_TOUCHPOINT - RESOURCE API */
// The Wristband Service contains all code for REST API calls to the Wristband platform.

const apiClient = require('../client/api-client');
const { BASIC_AUTH_AXIOS_CONFIG } = require('../utils/constants');
const { createFormData } = require('../utils/util');

const AUTH_CODE_GRANT_TYPE = 'authorization_code';
const REFRESH_TOKEN_GRANT_TYPE = 'refresh_token';

exports.cancelEmailChange = async function (changeEmailRequestId, requestConfig) {
  await apiClient.post('/change-email/cancel-email-change', { changeEmailRequestId }, requestConfig);
};

exports.exchangeAuthCodeForTokens = async function (code, redirectUri, codeVerifier) {
  const authData = createFormData({
    grant_type: AUTH_CODE_GRANT_TYPE,
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });
  const response = await apiClient.post('/oauth2/token', authData, BASIC_AUTH_AXIOS_CONFIG);
  return response.data;
};

exports.getChangeEmailRequestsForUser = async function (userId, requestConfig) {
  const statusQuery = encodeURIComponent(`status ne "CANCELED" and status ne "COMPLETED"`);
  const response = await apiClient.get(`/users/${userId}/change-email-requests?query=${statusQuery}`, requestConfig);
  return response.data;
};

exports.getOauth2Userinfo = async function (accessToken) {
  const requestConfig = { headers: { Authorization: `Bearer ${accessToken}` } };
  const response = await apiClient.get('/oauth2/userinfo', requestConfig);
  return response.data;
};

exports.getUser = async function (userId, requestConfig) {
  const response = await apiClient.get(`/users/${userId}`, requestConfig);
  return response.data;
};

exports.inviteNewUser = async function (applicationId, email, requestConfig) {
  await apiClient.post(`/new-user-invitation/invite-user`, { applicationId, email, language: 'en-US' }, requestConfig);
};

exports.refreshAccessToken = async function (refreshToken) {
  const authData = { grant_type: REFRESH_TOKEN_GRANT_TYPE, refresh_token: refreshToken };
  const response = await apiClient.post('/oauth2/token', createFormData(authData), BASIC_AUTH_AXIOS_CONFIG);
  return response.data;
};

exports.requestEmailChange = async function (userId, newEmail, requestConfig) {
  await apiClient.post('/change-email/request-email-change', { userId, newEmail }, requestConfig);
};

exports.revokeRefreshToken = async function (token) {
  await apiClient.post(`/oauth2/revoke`, createFormData({ token }), BASIC_AUTH_AXIOS_CONFIG);
};

exports.updateUser = async function (userId, userData, requestConfig) {
  const response = await apiClient.patch(`/users/${userId}`, userData, requestConfig);
  return response.data;
};
