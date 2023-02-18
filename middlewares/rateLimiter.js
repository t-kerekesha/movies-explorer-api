const rateLimit = require('express-rate-limit');

module.exports.rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // время, за которое считается количество запросов
  max: 100, // количество запросов с одного IP
});
