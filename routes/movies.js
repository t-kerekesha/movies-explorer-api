const express = require('express');
const { getUserMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validateCreateMovieBody, validateDeleteMovieParams } = require('../middlewares/validation');

const moviesRoutes = express.Router();

moviesRoutes.get('/', getUserMovies);
moviesRoutes.post('/', validateCreateMovieBody, createMovie);
moviesRoutes.delete('/:movieId', validateDeleteMovieParams, deleteMovie);

module.exports = moviesRoutes;
