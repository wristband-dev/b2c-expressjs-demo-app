'use strict';

const wristbandService = require('../services/wristband-service');
const invotasticService = require('../services/invotastic-service');
const { bearerToken, normalizePhoneNumber } = require('../utils/util');
const {
  hasConstraintsViolations,
  invalidPhoneNumber,
  reqValidation,
  INVALID_PHONE_NUMBER,
  INVALID_REQUEST,
} = require('../utils/validation');

exports.sessionData = async (req, res, next) => {
  const { userId } = req.session;

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const [user, paymentCards] = await Promise.all([
      wristbandService.getUser(userId, bearerToken(req)),
      invotasticService.getPaymentCardsForUser(userId),
    ]);

    if (user.status !== 'ACTIVE') {
      return res.status(401).send();
    }

    return res.status(200).json({
      user,
      paymentCard:
        paymentCards.length > 0
          ? {
              id: paymentCards[0].id,
              lastFourDigits: paymentCards[0].lastFourDigits,
              expirationDate: paymentCards[0].expirationDate,
            }
          : null,
    });
  } catch (error) {
    return next(error);
  }
};

exports.userinfo = async (req, res, next) => {
  const { userId } = req.session;

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const user = await wristbandService.getUser(userId, bearerToken(req));
    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

exports.paymentCardInfo = async (req, res, next) => {
  const { userId } = req.session;

  try {
    const paymentCards = await invotasticService.getPaymentCardsForUser(userId);

    if (paymentCards.length === 0) {
      res.status(200).json(null);
    }

    const { id, lastFourDigits, expirationDate } = paymentCards[0];
    return res.status(200).json({ id, lastFourDigits, expirationDate });
  } catch (error) {
    return next(error);
  }
};

exports.initializeAccount = async (req, res, next) => {
  try {
    reqValidation(req);
  } catch (error) {
    return res.status(400).json(error.data);
  }

  const { userId } = req.session;
  const { cardholderName, cardNumber, expirationDate, givenName, familyName, phoneNumber, securityCode, zipCode } =
    req.body;
  const userData = { givenName, familyName, phoneNumber: normalizePhoneNumber(phoneNumber) };

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const [user, paymentCards] = await Promise.all([
      wristbandService.updateUser(userId, userData, bearerToken(req)),
      invotasticService.getPaymentCardsForUser(userId),
    ]);

    if (paymentCards.length > 0) {
      return res.status(400).json({ code: INVALID_REQUEST, message: 'A payment card already exists for your user.' });
    }

    const lastFourDigits = cardNumber.slice(-4);
    const paymentCard = await invotasticService.createPaymentCard(userId, {
      cardholderName,
      cardNumber,
      lastFourDigits,
      expirationDate,
      securityCode,
      zipCode,
    });

    return res.status(200).json({
      paymentCard: { id: paymentCard.id, lastFourDigits, expirationDate },
      user,
    });
  } catch (error) {
    if (hasConstraintsViolations(error.response) && invalidPhoneNumber(error.response.data)) {
      return res.status(400).json({ code: INVALID_PHONE_NUMBER, message: 'Invalid phone number provided.' });
    }
    return next(error);
  }
};
