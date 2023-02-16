const express = require('express');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validateCreateMovieBody, validateDeleteMovieParams } = require('../middlewares/validation');

const moviesRoutes = express.Router();

moviesRoutes.get('/', getMovies);
moviesRoutes.post('/', validateCreateMovieBody, createMovie);
moviesRoutes.delete('/:movieId', validateDeleteMovieParams, deleteMovie);

module.exports = moviesRoutes;
