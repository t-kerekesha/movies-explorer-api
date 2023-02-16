const {
  PORT = 3005, // cлушаем 3000 порт
  MONGO_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb',
} = process.env;

module.exports = { PORT, MONGO_URL };
