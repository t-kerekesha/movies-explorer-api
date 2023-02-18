const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const User = require('../models/user');
const {
  SOLT_ROUNDS,
  STATUS_CODE_OK,
  STATUS_CODE_CREATED,
  MONGO_DUPLICATE_ERROR_CODE,
  MESSAGE_INVALID_DATA_SENT,
  MESSAGE_USER_EXISTS,
  MESSAGE_INCORRECT_EMAIL_OR_PASSWORD,
  MESSAGE_USER_IS_NOT_FOUND,
  MESSAGE_INVALID_ID,
  MESSAGE_LOGOUT,
} = require('../utils/constants');
const { generateToken } = require('../utils/generateToken');

// Cоздание пользователя с переданными в теле email, password и name
module.exports.createUser = (request, response, next) => {
  const { name, email, password } = request.body;

  bcrypt.hash(password, SOLT_ROUNDS)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => response.status(STATUS_CODE_CREATED).send({
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(MESSAGE_INVALID_DATA_SENT + error.message));
      } else if (error.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new ConflictError(MESSAGE_USER_EXISTS));
      } else {
        next(error);
      }
    });
};

// Аутентификация пользователя
module.exports.login = (request, response, next) => {
  const { email, password } = request.body;

  User.findOne({ email }).select('+password')
    .orFail(new UnauthorizedError(MESSAGE_INCORRECT_EMAIL_OR_PASSWORD))
    .then((user) => {
      bcrypt.compare(password, user.password) // сравнивнение пароля и хеша из базы
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError(MESSAGE_INCORRECT_EMAIL_OR_PASSWORD);
          }

          const token = generateToken({ _id: user._id });
          response.status(STATUS_CODE_OK)
            .cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
            })
            .send({
              _id: user._id,
              name: user.name,
            });
        })
        .catch(next);
    })
    .catch(next);
};

// Возвращение информации о пользователе (email и имя)
module.exports.getUser = (request, response, next) => {
  User.findById(request.user._id)
    .orFail(new NotFoundError(MESSAGE_USER_IS_NOT_FOUND))
    .then((user) => response.status(STATUS_CODE_OK).send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        next(new BadRequestError(MESSAGE_INVALID_ID + error.message));
      } else {
        next(error);
      }
    });
};

// Обновление информации о пользователе (email и имя)
module.exports.updateUser = (request, response, next) => {
  const { name, email } = request.body;

  User.findByIdAndUpdate(
    request.user._id,
    { name, email },
    {
      new: true, // передать обновлённый объект на вход обработчику then
      runValidators: true, // валидировать новые данные перед записью в базу
    },
  )
    .orFail(new NotFoundError(MESSAGE_USER_IS_NOT_FOUND))
    .then((user) => response.status(STATUS_CODE_OK).send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(MESSAGE_INVALID_DATA_SENT + error.message));
      } else if (error instanceof mongoose.Error.CastError) {
        next(new BadRequestError(MESSAGE_INVALID_ID + error.message));
      } else if (error.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new ConflictError(MESSAGE_USER_EXISTS));
      } else {
        next(error);
      }
    });
};

// Выход пользователя
module.exports.logout = (request, response) => {
  response.status(STATUS_CODE_OK)
    .clearCookie('jwt')
    .send({ message: MESSAGE_LOGOUT });
};
