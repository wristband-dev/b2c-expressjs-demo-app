import { apiClient } from 'client';

export const fetchSessionPaymentCard = async function () {
  const paymentCardResponse = await apiClient.get(`/v1/payment-card-info`);
  return paymentCardResponse.data;
};

export const fetchSessionUser = async function () {
  const userResponse = await apiClient.get(`/v1/userinfo`);
  return userResponse.data;
};

export const getAuthState = async function () {
  const authResponse = await apiClient.get('/auth/auth-state');
  return authResponse.data.isAuthenticated;
};

export const getInitialSessionData = async function () {
  const sessionResponse = await apiClient.get(`/v1/session-data`);
  return sessionResponse.data;
};

export const initializeAccount = async function (accountData) {
  const accountResponse = await apiClient.post(`/v1/initialize-account`, accountData);
  return accountResponse.data;
};

export const updateSessionPaymentCard = async function (paymentCard) {
  const { id, ...updatedPaymentCard } = paymentCard;
  const paymentCardResponse = await apiClient.put(`/v1/payment-cards/${id}`, updatedPaymentCard);
  return paymentCardResponse.data;
};

export const updateSessionUser = async function (user) {
  const { id, ...updatedUser } = user;
  const userResponse = await apiClient.patch(`/v1/users/${id}`, updatedUser);
  return userResponse.data;
};
