const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  VALIDATION_MESSAGE_MIN_LENGTH,
  VALIDATION_MESSAGE_MAX_LENGTH,
  VALIDATION_MESSAGE_EMPTY,
  VALIDATION_MESSAGE_NAME_REQUIRED,
  VALIDATION_MESSAGE_INVALID_EMAIL,
  VALIDATION_MESSAGE_EMAIL_REQUIRED,
  VALIDATION_MESSAGE_PASSWORD_REQUIRED,
  VALIDATION_MESSAGE_COUNTRY_REQUIRED,
  VALIDATION_MESSAGE_DIRECTOR_REQUIRED,
  VALIDATION_MESSAGE_DURATION_NOT_NUMBER,
  VALIDATION_MESSAGE_DURATION_REQUIRED,
  VALIDATION_MESSAGE_YEAR_REQUIRED,
  VALIDATION_MESSAGE_DESCRIPTION_REQUIRED,
  VALIDATION_MESSAGE_INVALID_URL,
  VALIDATION_MESSAGE_IMAGE_REQUIRED,
  VALIDATION_MESSAGE_TRAILER_REQUIRED,
  VALIDATION_MESSAGE_THUMBNAIL_REQUIRED,
  VALIDATION_MESSAGE_MOVIE_ID_NOT_NUMBER,
  VALIDATION_MESSAGE_MOVIE_ID_REQUIRED,
  VALIDATION_MESSAGE_NAME_RU_REQUIRED,
  VALIDATION_MESSAGE_NAME_EN_REQUIRED,
  VALIDATION_MESSAGE_INVALID_MOVIE_ID,
} = require('../utils/constants');

module.exports.validateCreateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': VALIDATION_MESSAGE_MIN_LENGTH,
        'string.max': VALIDATION_MESSAGE_MAX_LENGTH,
        'string.empty': VALIDATION_MESSAGE_EMPTY,
        'any.required': VALIDATION_MESSAGE_NAME_REQUIRED,
      }),
    email: Joi.string().email().required().messages({
      'string.email': VALIDATION_MESSAGE_INVALID_EMAIL,
      'string.empty': VALIDATION_MESSAGE_EMPTY,
      'any.required': VALIDATION_MESSAGE_EMAIL_REQUIRED,
    }),
    password: Joi.string().required().messages({
      'string.empty': VALIDATION_MESSAGE_EMPTY,
      'any.required': VALIDATION_MESSAGE_PASSWORD_REQUIRED,
    }),
  }),
});

module.exports.validateLoginBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      'string.email': VALIDATION_MESSAGE_INVALID_EMAIL,
      'string.empty': VALIDATION_MESSAGE_EMPTY,
      'any.required': VALIDATION_MESSAGE_EMAIL_REQUIRED,
    }),
    password: Joi.string().required().messages({
      'string.empty': VALIDATION_MESSAGE_EMPTY,
      'any.required': VALIDATION_MESSAGE_PASSWORD_REQUIRED,
    }),
  }),
});

module.exports.validateUpdateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': VALIDATION_MESSAGE_MIN_LENGTH,
        'string.max': VALIDATION_MESSAGE_MAX_LENGTH,
        'string.empty': VALIDATION_MESSAGE_EMPTY,
        'any.required': VALIDATION_MESSAGE_NAME_REQUIRED,
      }),
    email: Joi.string().email().required().messages({
      'string.email': VALIDATION_MESSAGE_INVALID_EMAIL,
      'string.empty': VALIDATION_MESSAGE_EMPTY,
      'any.required': VALIDATION_MESSAGE_EMAIL_REQUIRED,
    }),
  }),
});

module.exports.validateCreateMovieBody = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().messages({
      'string.empty': VALIDATION_MESSAGE_EMPTY,
      'any.required': VALIDATION_MESSAGE_COUNTRY_REQUIRED,
    }),
    director: Joi.string().required().messages({
      'string.empty': VALIDATION_MESSAGE_EMPTY,
      'any.required': VALIDATION_MESSAGE_DIRECTOR_REQUIRED,
    }),
    duration: Joi.number().required().messages({
      'number.base': VALIDATION_MESSAGE_DURATION_NOT_NUMBER,
      'any.required': VALIDATION_MESSAGE_DURATION_REQUIRED,
    }),
    year: Joi.string().required().messages({
      'string.empty': VALIDATION_MESSAGE_EMPTY,
      'any.required': VALIDATION_MESSAGE_YEAR_REQUIRED,
    }),
    description: Joi.string().required().messages({
      'string.empty': VALIDATION_MESSAGE_EMPTY,
      'any.required': VALIDATION_MESSAGE_DESCRIPTION_REQUIRED,
    }),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message(VALIDATION_MESSAGE_INVALID_URL);
    }).messages({
      'string.empty': VALIDATION_MESSAGE_EMPTY,
      'any.required': VALIDATION_MESSAGE_IMAGE_REQUIRED,
    }),
    trailerLink: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message(VALIDATION_MESSAGE_INVALID_URL);
    }).messages({
      'string.empty': VALIDATION_MESSAGE_EMPTY,
      'any.required': VALIDATION_MESSAGE_TRAILER_REQUIRED,
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message(VALIDATION_MESSAGE_INVALID_URL);
    }).messages({
      'string.empty': VALIDATION_MESSAGE_EMPTY,
      'any.required': VALIDATION_MESSAGE_THUMBNAIL_REQUIRED,
    }),
    movieId: Joi.number().required().messages({
      'number.base': VALIDATION_MESSAGE_MOVIE_ID_NOT_NUMBER,
      'any.required': VALIDATION_MESSAGE_MOVIE_ID_REQUIRED,
    }),
    nameRU: Joi.string().required().messages({
      'string.empty': VALIDATION_MESSAGE_EMPTY,
      'any.required': VALIDATION_MESSAGE_NAME_RU_REQUIRED,
    }),
    nameEN: Joi.string().required().messages({
      'string.empty': VALIDATION_MESSAGE_EMPTY,
      'any.required': VALIDATION_MESSAGE_NAME_EN_REQUIRED,
    }),
  }),
});

module.exports.validateDeleteMovieParams = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex()
      .messages(({
        'string.hex': VALIDATION_MESSAGE_INVALID_MOVIE_ID,
        'string.length': VALIDATION_MESSAGE_INVALID_MOVIE_ID,
      })),
  }),
});
