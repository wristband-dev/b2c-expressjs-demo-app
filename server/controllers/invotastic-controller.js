'use strict';

const invotasticService = require('../services/invotastic-service');
const { reqValidation, INVALID_REQUEST } = require('../utils/validation');
const { FORBIDDEN_ACCESS_RESPONSE, InvoiceStatus } = require('../utils/constants');

exports.createInvoice = async (req, res) => {
  try {
    reqValidation(req);
  } catch (error) {
    return res.status(400).json(error.data);
  }

  const { invoiceDate, message, recipientEmail, totalDue } = req.body;
  const { userId } = req.session;

  const createdInvoice = await invotasticService.createInvoice({
    userId,
    recipientEmail,
    totalDue,
    message,
    invoiceDate,
    status: InvoiceStatus.SENT,
  });

  return res.status(201).json(createdInvoice);
};

exports.cancelInvoice = async (req, res) => {
  try {
    reqValidation(req);
  } catch (error) {
    return res.status(400).json(error.data);
  }

  const { invoiceId } = req.params;
  const { userId } = req.session;

  const existingInvoice = await invotasticService.getInvoice(invoiceId);

  if (!existingInvoice) {
    return res.status(404).send({ code: INVALID_REQUEST, message: 'Invoice could not be found' });
  }
  if (existingInvoice.userId !== userId) {
    return res.status(403).json(FORBIDDEN_ACCESS_RESPONSE);
  }

  const updatedInvoice = { ...existingInvoice, status: InvoiceStatus.CANCELLED };
  await invotasticService.updateInvoice(updatedInvoice);

  return res.status(200).json(updatedInvoice);
};

exports.getInvoicesByUser = async (req, res) => {
  try {
    reqValidation(req);
  } catch (error) {
    return res.status(400).json(error.data);
  }

  const { userId } = req.session;

  const invoices = await invotasticService.getInvoicesForUser(userId);

  return res.status(200).json(invoices);
};

exports.getPaymentCard = async (req, res) => {
  try {
    reqValidation(req);
  } catch (error) {
    return res.status(400).json(error.data);
  }

  const { cardId } = req.params;
  const { userId } = req.session;

  const paymentCard = await invotasticService.getPaymentCard(cardId);

  if (!paymentCard) {
    return res.status(404).send({ code: INVALID_REQUEST, message: 'Payment card could not be found' });
  }
  if (paymentCard.userId !== userId) {
    return res.status(403).json(FORBIDDEN_ACCESS_RESPONSE);
  }

  const { id, lastFourDigits, expirationDate } = paymentCard;
  return res.status(200).json({ id, lastFourDigits, expirationDate });
};

exports.updatePaymentCard = async (req, res) => {
  try {
    reqValidation(req);
  } catch (error) {
    return res.status(400).json(error.data);
  }

  const { cardNumber, expirationDate, securityCode, zipCode } = req.body;
  const { cardId } = req.params;
  const { userId } = req.session;

  const existingPaymentCard = await invotasticService.getPaymentCard(cardId);
  if (!existingPaymentCard) {
    return res.status(404).send({ code: INVALID_REQUEST, message: 'Payment card could not be found' });
  }
  if (existingPaymentCard.userId !== userId) {
    return res.status(403).json(FORBIDDEN_ACCESS_RESPONSE);
  }

  const lastFourDigits = cardNumber.slice(-4);
  await invotasticService.updatePaymentCard({
    ...existingPaymentCard,
    cardNumber,
    lastFourDigits,
    expirationDate,
    securityCode,
    zipCode,
  });

  return res.status(200).json({ id: cardId, lastFourDigits, expirationDate });
};
