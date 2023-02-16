const mongoose = require('mongoose');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const Movie = require('../models/movie');
const { STATUS_CODE_OK, STATUS_CODE_CREATED } = require('../utils/constants');

// Возвращение всех сохраненных текущим  пользователем фильмов
module.exports.getMovies = (request, response, next) => {
  Movie.find({})
    .populate('owner')
    .then((movies) => response.status(STATUS_CODE_OK).send(movies))
    .catch(next);
};

// Создание фильма
module.exports.createMovie = (request, response, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = request.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: request.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => Movie.populate(movie, { path: 'owner' }))
    .then((movie) => response.status(STATUS_CODE_CREATED).send(movie))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(`Переданы некорректные данные при создании фильма: ${error.message}`));
      } else {
        next(error);
      }
    });
};

// Удаление сохраненного фильма по id
module.exports.deleteMovie = (request, response, next) => {
  Movie.findById(request.params.movieId)
    .orFail(new NotFoundError('Фильм с указанным id не найден'))
    .then((movie) => {
      if (request.user._id !== movie.owner._id.toString()) {
        throw new ForbiddenError('Удалять фильмы других пользователей нельзя');
      }

      Movie.findByIdAndRemove(request.params.movieId)
        .then(() => response.status(STATUS_CODE_OK).send({ message: 'Фильм удалён' }))
        .catch(next);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`Переданы некорректные данные: ${error.message}`));
      } else {
        next(error);
      }
    });
};
