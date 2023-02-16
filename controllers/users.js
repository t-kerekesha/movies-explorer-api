const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const User = require('../models/user');
const {
  STATUS_CODE_OK, SOLT_ROUNDS, STATUS_CODE_CREATED, MONGO_DUPLICATE_ERROR_CODE,
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
        next(new BadRequestError(`Переданы некорректные данные при создании пользователя: ${error.message}`));
      } else if (error.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else {
        next(error);
      }
    });
};

// Аутентификация пользователя
module.exports.login = (request, response, next) => {
  const { email, password } = request.body;

  User.findOne({ email }).select('+password')
    .orFail(new UnauthorizedError('Неправильные email или пароль'))
    .then((user) => {
      bcrypt.compare(password, user.password) // сравнивнение пароля и хеша из базы
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные email или пароль');
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
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => response.status(STATUS_CODE_OK).send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`Некорректный id: ${error.message}`));
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
    .orFail(new NotFoundError('Пользователь с указанным id не найден'))
    .then((user) => response.status(STATUS_CODE_OK).send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(`Переданы некорректные данные при обновлении профиля: ${error.message}`));
      } else if (error instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`Некорректный id: ${error.message}`));
      } else {
        next(error);
      }
    });
};

// Выход пользователя
module.exports.logout = (request, response) => {
  response.status(STATUS_CODE_OK)
    .clearCookie('jwt')
    .send({ message: 'Успешный выход из учетной записи' });
};
