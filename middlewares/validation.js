const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

module.exports.validateCreateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимальная длина поля - 2 символа',
        'string.max': 'Максимальная длина поля - 30 символов',
        'string.empty': 'Поле не может быть пустым',
        'any.required': 'Необходимо указать имя пользователя',
      }),
    email: Joi.string().email().required().messages({
      'string.email': 'Некорректный email',
      'any.required': 'Необходимо указать email',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Пароль не может быть пустым',
      'any.required': 'Необходимо ввести пароль',
    }),
  }),
});

module.exports.validateLoginBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      'string.email': 'Некорректный email',
      'any.required': 'Необходимо указать email',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Пароль не может быть пустым',
      'any.required': 'Необходимо ввести пароль',
    }),
  }),
});

module.exports.validateUpdateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимальная длина поля - 2 символа',
        'string.max': 'Максимальная длина поля - 30 символов',
        'string.empty': 'Поле не может быть пустым',
        'any.required': 'Необходимо указать имя пользователя',
      }),
    email: Joi.string().email().required().messages({
      'string.email': 'Некорректный email',
      'any.required': 'Необходимо указать email',
    }),
  }),
});

module.exports.validateCreateMovieBody = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().messages({
      'string.empty': 'Поле не может быть пустым',
      'any.required': 'Необходимо указать страну создания фильма',
    }),
    director: Joi.string().required().messages({
      'string.empty': 'Поле не может быть пустым',
      'any.required': 'Необходимо указать режиссера фильма',
    }),
    duration: Joi.number().required().messages({
      'number.base': 'Значение длительности фильма не является числом',
      'any.required': 'Необходимо указать длительность фильма',
    }),
    year: Joi.string().required().messages({
      'string.empty': 'Поле не может быть пустым',
      'any.required': 'Необходимо указать год выпуска фильма',
    }),
    description: Joi.string().required().messages({
      'string.empty': 'Поле не может быть пустым',
      'any.required': 'Необходимо указать описание фильма',
    }),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Не валидный url-адрес');
    }).messages({
      'string.empty': 'Поле не может быть пустым',
      'any.required': 'Необходимо указать ссылку на постер к фильму',
    }),
    trailerLink: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Не валидный url-адрес');
    }).messages({
      'string.empty': 'Поле не может быть пустым',
      'any.required': 'Необходимо указать ссылку на трейлер фильма',
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Не валидный url-адрес');
    }).messages({
      'string.empty': 'Поле не может быть пустым',
      'any.required': 'Необходимо указать ссылку на миниатюрное изображение постера к фильму',
    }),
    movieId: Joi.string().required().messages({
      'string.empty': 'Поле не может быть пустым',
      'any.required': 'Необходимо указать id фильма',
    }),
    nameRU: Joi.string().required().messages({
      'string.empty': 'Поле не может быть пустым',
      'any.required': 'Необходимо указать название фильма на русском языке',
    }),
    nameEN: Joi.string().required().messages({
      'string.empty': 'Поле не может быть пустым',
      'any.required': 'Необходимо указать название фильма на английском языке',
    }),
  }),
});

module.exports.validateDeleteMovieParams = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex()
      .messages(({
        'string.hex': 'Невалидный id фильма',
        'string.length': 'Невалидный id фильма',
      })),
  }),
});
