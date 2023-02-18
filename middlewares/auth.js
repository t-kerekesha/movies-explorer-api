const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { MESSAGE_AUTHORIZATION_REQUIRED, MESSAGE_INVALID_TOKEN } = require('../utils/constants');

const { JWT_SECRET_KEY, NODE_ENV } = process.env;

module.exports.auth = (request, response, next) => {
  const token = request.cookies.jwt;

  if (!token) {
    throw new UnauthorizedError(MESSAGE_AUTHORIZATION_REQUIRED);
  }

  let payload;

  try {
    // Верификация токена
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET_KEY : 'dev-secret-key',
    );
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new UnauthorizedError(MESSAGE_INVALID_TOKEN));
    } else {
      next(error);
    }
    return;
  }

  request.user = payload;

  next();
};
