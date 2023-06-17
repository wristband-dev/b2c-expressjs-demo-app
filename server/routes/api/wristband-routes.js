'use strict';

const express = require('express');
const { body, param } = require('express-validator');
const wristbandController = require('../../controllers/wristband-controller');

const router = express.Router();

// prettier-ignore
router.patch(
  '/users/:userId',
  [
    param('userId')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 26 }).withMessage('too-long(26)'),
    body('email')
      .optional({ checkNull: true, checkFalsy: true })
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 150 }).withMessage('too-long(150)')
      .isEmail().withMessage('bad-pattern'),
    body('emailVerified')
      .optional()
      .isBoolean().withMessage('not-boolean'),
    body('pendingNewEmail')
      .optional({ checkNull: true, checkFalsy: true, nullable: true })
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 150 }).withMessage('too-long(150)')
      .isEmail().withMessage('bad-pattern'),
    body('status')
      .optional({ checkNull: true, checkFalsy: true })
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 45 }).withMessage('too-long(45)'),
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
  ],
  wristbandController.updateUser
);

router.get('/change-email-requests', wristbandController.queryChangeEmailRequests);

// prettier-ignore
router.post(
  '/request-email-change',
  [
    body('newEmail')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 200 }).withMessage('too-long(200)')
      .isEmail().withMessage('bad-pattern'),
  ],
  wristbandController.requestEmailChange
);

// prettier-ignore
router.post(
  '/cancel-email-change',
  [
    body('requestId')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 26 }).withMessage('too-long(26)'),
  ],
  wristbandController.cancelEmailChange
);

// prettier-ignore
router.post(
  '/invite-new-user',
  [
    body('email')
      .exists().withMessage('null')
      .isString().withMessage('not-string')
      .trim()
      .not().isEmpty().withMessage('blank')
      .isLength({ max: 200 }).withMessage('too-long(200)')
      .isEmail().withMessage('bad-pattern')
  ],
  wristbandController.inviteNewUser
);

module.exports = router;
