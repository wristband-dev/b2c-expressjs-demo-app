'use strict';

const lowDb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { nanoid } = require('nanoid');

const INVOICES_SCHEMA = 'invoices';
const PAYMENT_CARDS_SCHEMA = 'paymentCards';
const DATABASE_FILE = 'db.json';
const DEFAULT_DATA = { [INVOICES_SCHEMA]: [], [PAYMENT_CARDS_SCHEMA]: [] };

const db = lowDb(new FileSync(DATABASE_FILE));
db.defaults(DEFAULT_DATA).write();

// //////////////////////////////
//  INVOICES
// //////////////////////////////

exports.getInvoice = function (id) {
  return db.get(INVOICES_SCHEMA).find({ id }).value();
};

exports.getInvoicesByUser = function (userId) {
  return db.get(INVOICES_SCHEMA).filter({ userId }).value();
};

exports.createInvoice = function (newInvoice) {
  const invoiceWithId = { id: nanoid(), ...newInvoice };
  db.get(INVOICES_SCHEMA).push(invoiceWithId).write();
  return invoiceWithId;
};

exports.updateInvoice = function (updatedInvoice) {
  db.get(INVOICES_SCHEMA).find({ id: updatedInvoice.id }).assign(updatedInvoice).write();
};

// //////////////////////////////
//  PAYMENT CARDS
// //////////////////////////////

exports.getPaymentCardById = function (id) {
  return db.get(PAYMENT_CARDS_SCHEMA).find({ id }).value();
};

exports.getPaymentCardsForUser = function (userId) {
  return db
    .get(PAYMENT_CARDS_SCHEMA)
    .filter({ userId: userId || undefined })
    .value();
};

exports.createPaymentCard = function (newCard) {
  const paymentCardWithId = { id: nanoid(), ...newCard };
  db.get(PAYMENT_CARDS_SCHEMA).push(paymentCardWithId).write();
  return paymentCardWithId;
};

exports.updatePaymentCard = function (updatedCard) {
  db.get(PAYMENT_CARDS_SCHEMA).find({ id: updatedCard.id }).assign(updatedCard).write();
};
