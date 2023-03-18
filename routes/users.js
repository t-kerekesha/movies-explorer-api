const express = require('express');
const { getUser, updateUser } = require('../controllers/users');
const { validateUpdateUserBody } = require('../middlewares/validation');

const usersRoutes = express.Router();

usersRoutes.get('/me', getUser);
usersRoutes.patch('/me', validateUpdateUserBody, updateUser);

module.exports = usersRoutes;
