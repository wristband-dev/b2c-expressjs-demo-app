'use strict';

const wristbandService = require('../services/wristband-service');
const { bearerToken, getValueForDeletableField, normalizePhoneNumber } = require('../utils/util');
const {
  reqValidation,
  newEmailExists,
  emailExists,
  hasConstraintsViolations,
  invalidPhoneNumber,
  newEmailUnchanged,
  INVALID_PHONE_NUMBER,
  INVALID_REQUEST,
} = require('../utils/validation');

exports.updateUser = async (req, res, next) => {
  try {
    reqValidation(req);
  } catch (error) {
    return res.status(400).json(error.data);
  }

  const { userId } = req.params;
  const { email, familyName, givenName, phoneNumber, status } = req.body;
  const userData = {
    email,
    status,
    givenName: getValueForDeletableField(givenName),
    familyName: getValueForDeletableField(familyName),
    phoneNumber: getValueForDeletableField(normalizePhoneNumber(phoneNumber)),
  };

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const user = await wristbandService.updateUser(userId, userData, bearerToken(req));
    return res.status(200).json(user);
  } catch (error) {
    if (hasConstraintsViolations(error.response) && invalidPhoneNumber(error.response.data)) {
      return res.status(400).json({ code: INVALID_PHONE_NUMBER, message: 'Invalid phone number provided.' });
    }
    if (error.response && error.response.status === 404) {
      return res.status(404).send();
    }

    return next(error);
  }
};

exports.queryChangeEmailRequests = async (req, res, next) => {
  const { userId } = req.session;

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const queryResults = await wristbandService.getChangeEmailRequestsForUser(userId, bearerToken(req));
    return res.status(200).json(queryResults);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).send();
    }

    return next(error);
  }
};

exports.requestEmailChange = async (req, res, next) => {
  try {
    reqValidation(req);
  } catch (error) {
    return res.status(400).json(error.data);
  }

  const { userId } = req.session;
  const { newEmail } = req.body;

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    await wristbandService.requestEmailChange(userId, newEmail, bearerToken(req));
    return res.status(204).send();
  } catch (error) {
    if (hasConstraintsViolations(error.response)) {
      if (newEmailUnchanged(error.response.data)) {
        return res.status(400).json({ code: INVALID_REQUEST, message: 'The email must be a new address.' });
      }
      if (newEmailExists(error.response.data)) {
        return res.status(400).json({ code: INVALID_REQUEST, message: 'The email address already exists.' });
      }
    }

    return next(error);
  }
};

exports.cancelEmailChange = async (req, res, next) => {
  try {
    reqValidation(req);
  } catch (error) {
    return res.status(400).json(error.data);
  }

  const { requestId } = req.body;
  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    await wristbandService.cancelEmailChange(requestId, bearerToken(req));
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

exports.inviteNewUser = async (req, res, next) => {
  try {
    reqValidation(req);
  } catch (error) {
    return res.status(400).json(error.data);
  }

  const { email } = req.body;
  const { applicationId } = req.session;

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    await wristbandService.inviteNewUser(applicationId, email, bearerToken(req));
    return res.status(204).send();
  } catch (error) {
    if (hasConstraintsViolations(error.response) && emailExists(error.response.data)) {
      return res.status(400).json({ code: INVALID_REQUEST, message: 'The email address already exists.' });
    }
    return next(error);
  }
};
