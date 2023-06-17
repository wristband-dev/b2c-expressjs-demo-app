'use strict';

const express = require('express');
const { body, param } = require('express-validator');
const invotasticController = require('../../controllers/invotastic-controller');

const router = express.Router();

// prettier-ignore
router.post(
  '/invoices',
  [
    body('recipientEmail')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 100 }).withMessage('too-long(100)')
      .normalizeEmail()
      .isEmail().withMessage('invalid-email'),
    body('message')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 280 }).withMessage('too-long(280)'),
    body('totalDue')
      .exists().withMessage('null')
      .isFloat({ min: 0.00, locale: 'en-US' }).withMessage('invalid-float'),
    body('invoiceDate')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 30 }).withMessage('too-long(30)')
      .isISO8601({ strict: true }).withMessage('invalid-date'),
  ],
  invotasticController.createInvoice
);

// prettier-ignore
router.post(
  '/invoices/:invoiceId/cancel-invoice',
  [
    param('invoiceId')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 26 }).withMessage('too-long(26)'),
  ],
  invotasticController.cancelInvoice
);

router.get('/invoices', invotasticController.getInvoicesByUser);

// prettier-ignore
router.put(
  '/payment-cards/:cardId',
  [
    param('cardId')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 26 }).withMessage('too-long(26)'),
    body('cardNumber')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ min: 16, max: 16 }).withMessage('invalid-length(16)'),
    body('expirationDate')
      .optional({ checkNull: true, checkFalsy: true })
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ min: 5, max: 5 }).withMessage('invalid-length(5)'),
    body('securityCode')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ min: 3, max: 3 }).withMessage('invalid-length(3)'),
    body('zipCode')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ min: 5, max: 5 }).withMessage('invalid-length(5)'),
  ],
  invotasticController.updatePaymentCard
);

module.exports = router;
