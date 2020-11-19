const dotenv = require('dotenv'); // Модуль дл работы с файлами .env
dotenv.config(); // Сконфигурировали модуль
const { PORT = 3000 } = process.env; // Переменные окружения
// FIXME: переменные окружения брать из .env файла
const express = require('express'); // Экспресс
const bodyParser = require('body-parser'); // Body-parser для преобразования тела запроса
const mongoose = require('mongoose'); // Подключили mongoose

// Роутеры
const usersRouter = require('./routes/users'); // Роут пользователей
const cardsRouter = require('./routes/cards'); // Роут карточек
const notfound = require('./routes/notfound'); // Роут ответа 404 ошибки

// Объявили экспресс
const app = express();

// Запустили сервер на нужном порту
app.listen(PORT, () => {
  console.log(`App started. Listening at port ${PORT}`);
});

// Подключили body-parser
app.use(bodyParser.json());

// В карточке есть поле owner для хранения её автора. Но в запросе клиент передаёт только
// имя карточки и ссылку на картинку. В следующей теме вы узнаете, как решить эту
// проблему, а пока реализуйте временное решение.
app.use((req, res, next) => {
  req.user = {
    _id: '5f9319bf093c0121b12fb47b',
  };

  next();
});

// Подключились к Mongodb
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// Объявляем роуты
app.use('/', usersRouter); // Роутер юзеров
app.use('/', cardsRouter); // Роутер карточек
app.use('*', notfound); // Роутер страницы 404
