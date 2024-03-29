const mongoose = require('mongoose');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const Movie = require('../models/movie');
const {
  STATUS_CODE_OK,
  STATUS_CODE_CREATED,
  MESSAGE_INVALID_DATA_SENT,
  MESSAGE_MOVIE_NOT_FOUND,
  MESSAGE_FORBIDDEN_TO_DELETE,
  MESSAGE_MOVIE_DELETED,
} = require('../utils/constants');

// Возвращение всех сохраненных текущим  пользователем фильмов
module.exports.getUserMovies = (request, response, next) => {
  Movie.find({ owner: request.user })
    .populate('owner')
    .then((movies) => response.status(STATUS_CODE_OK).send(movies))
    .catch(next);
};

// Создание фильма
module.exports.createMovie = (request, response, next) => {
  Movie.create({ ...request.body, owner: request.user._id })
    .then((movie) => Movie.populate(movie, { path: 'owner' }))
    .then((movie) => response.status(STATUS_CODE_CREATED).send(movie))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(`${MESSAGE_INVALID_DATA_SENT} ${error.message}`));
      } else {
        next(error);
      }
    });
};

// Удаление сохраненного фильма по id
module.exports.deleteMovie = (request, response, next) => {
  Movie.findById(request.params.movieId)
    .orFail(new NotFoundError(MESSAGE_MOVIE_NOT_FOUND))
    .then((movie) => {
      if (request.user._id !== movie.owner._id.toString()) {
        throw new ForbiddenError(MESSAGE_FORBIDDEN_TO_DELETE);
      }

      Movie.findByIdAndRemove(request.params.movieId)
        .then(() => response.status(STATUS_CODE_OK).send({ message: MESSAGE_MOVIE_DELETED }))
        .catch(next);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`${MESSAGE_INVALID_DATA_SENT} ${error.message}`));
      } else {
        next(error);
      }
    });
};
