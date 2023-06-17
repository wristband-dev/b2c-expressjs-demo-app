'use strict';

const db = require('../database/db');
const { InvoiceStatus } = require('../utils/constants');

exports.getInvoice = async function (invoiceId) {
  const invoice = await Promise.resolve(db.getInvoice(invoiceId));
  return invoice && invoice.status !== InvoiceStatus.CANCELLED ? invoice : null;
};

exports.getInvoicesForUser = async function (userId) {
  const invoices = await Promise.resolve(db.getInvoicesByUser(userId));
  return invoices.filter((invoice) => {
    return invoice.status !== InvoiceStatus.CANCELLED;
  });
};

exports.createInvoice = async function (invoiceData) {
  const invoice = await Promise.resolve(db.createInvoice(invoiceData));
  return invoice;
};

exports.updateInvoice = async function (invoiceData) {
  const invoice = await Promise.resolve(db.updateInvoice(invoiceData));
  return invoice;
};

exports.getPaymentCard = async function (cardId) {
  const paymentCard = await Promise.resolve(db.getPaymentCardById(cardId));
  return paymentCard;
};

exports.getPaymentCardsForUser = async function (userId) {
  const paymentCards = await Promise.resolve(db.getPaymentCardsForUser(userId));
  return paymentCards;
};

exports.createPaymentCard = async function (userId, cardData) {
  const paymentCard = await Promise.resolve(db.createPaymentCard({ userId, ...cardData }));
  return paymentCard;
};

exports.updatePaymentCard = async function (cardData) {
  const paymentCard = await Promise.resolve(db.updatePaymentCard(cardData));
  return paymentCard;
};
