const express = require('express');
const { createUser, login, logout } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
const { auth } = require('../middlewares/auth');
const { validateLoginBody, validateCreateUserBody } = require('../middlewares/validation');
const moviesRoutes = require('./movies');
const usersRoutes = require('./users');

const routes = express.Router();

routes.post('/signup', validateCreateUserBody, createUser);
routes.post('/signin', validateLoginBody, login);
routes.post('/signout', logout);
routes.use('/users', auth, usersRoutes);
routes.use('/movies', auth, moviesRoutes);
routes.use('*', auth, (request, response, next) => next(new NotFoundError('Неверный путь')));

module.exports = routes;
