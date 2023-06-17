import { apiClient } from 'client';

export const cancelChangeEmailRequest = async function (request) {
  await apiClient.post(`/v1/cancel-email-change`, request);
};

export const createChangeEmailRequest = async function (request) {
  await apiClient.post(`/v1/request-email-change`, request);
};

export const createNewUserInvite = async function (email) {
  await apiClient.post(`/v1/invite-new-user`, { email });
};

export const fetchChangeEmailRequests = async function () {
  const response = await apiClient.get(`/v1/change-email-requests`);
  return response.data;
};
