'use strict';

const express = require('express');
const { body } = require('express-validator');
const sessionController = require('../../controllers/session-controller');

const router = express.Router();

router.get('/session-data', sessionController.sessionData);
router.get('/userinfo', sessionController.userinfo);
router.get('/payment-card-info', sessionController.paymentCardInfo);

// prettier-ignore
router.post(
  '/initialize-account',
  [
    body('givenName')
      .optional({ checkNull: true, checkFalsy: true })
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 200 }).withMessage('too-long(200)'),
    body('familyName')
      .optional({ checkNull: true, checkFalsy: true })
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 200 }).withMessage('too-long(200)'),
    body('phoneNumber')
      .optional({ checkNull: true, checkFalsy: true })
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 20 }).withMessage('too-long(20)'),
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
  sessionController.initializeAccount
);

module.exports = router;
