const express = require('express');
const { createUser, login, logout } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
const { auth } = require('../middlewares/auth');
const { validateLoginBody, validateCreateUserBody } = require('../middlewares/validation');
const { MESSAGE_INCORRECT_PATH } = require('../utils/constants');
const moviesRoutes = require('./movies');
const usersRoutes = require('./users');

const routes = express.Router();

routes.post('/signup', validateCreateUserBody, createUser);
routes.post('/signin', validateLoginBody, login);
routes.post('/signout', auth, logout);
routes.use('/users', auth, usersRoutes);
routes.use('/movies', auth, moviesRoutes);
routes.use('*', auth, (request, response, next) => next(new NotFoundError(MESSAGE_INCORRECT_PATH)));

module.exports = routes;
