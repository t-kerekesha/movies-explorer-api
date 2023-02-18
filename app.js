require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const BadRequestError = require('./errors/BadRequestError');
const { errorHandler } = require('./middlewares/errorHandler');
const routes = require('./routes/index');
const { PORT, MONGO_URL } = require('./utils/config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { rateLimiter } = require('./middlewares/rateLimiter');
const { MESSAGE_SYNTAX_ERROR } = require('./utils/constants');

const app = express();

app.use(helmet());

app.use(cors({
  origin: ['http://localhost:3001', 'https://awesome.nomoredomains.work'],
  credentials: true,
  maxAge: 30,
}));

app.use(cookieParser());

app.use(express.json({
  verify: (request, response, buffer) => {
    try {
      JSON.parse(buffer);
    } catch (error) {
      throw new BadRequestError(MESSAGE_SYNTAX_ERROR);
    }
  },
}));

app.use(requestLogger); // логгер запросов

app.use(rateLimiter);

app.use('/', routes); // роуты

app.use(errorLogger); // логгер ошибок

app.use(errorHandler); // централизованный обработчик ошибок и ошибок celebrate

async function connect() {
  await mongoose.connect(MONGO_URL);
  console.log(`Server connect db ${MONGO_URL}`);

  await app.listen(PORT);
  console.log(`Server listen port ${PORT}`);
}

connect();
