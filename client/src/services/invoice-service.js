import { apiClient } from 'client';

export const fetchInvoices = async function () {
  const invoiceResponse = await apiClient.get(`/v1/invoices`);
  return invoiceResponse.data;
};

export const createInvoice = async function (invoice) {
  const invoiceResponse = await apiClient.post(`/v1/invoices`, invoice);
  return invoiceResponse.data;
};

export const cancelInvoice = async function (invoiceId) {
  const invoiceResponse = await apiClient.post(`/v1/invoices/${invoiceId}/cancel-invoice`, {});
  return invoiceResponse.data;
};
