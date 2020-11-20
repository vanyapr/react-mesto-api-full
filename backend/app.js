const dotenv = require('dotenv'); // Модуль дл работы с файлами .env
dotenv.config(); // Сконфигурировали модуль
const { errors, celebrate, Joi } = require('celebrate'); // Обработчик ошибок celebrate
const { PORT = 3000 } = process.env; // Переменные окружения
const express = require('express'); // Экспресс
const bodyParser = require('body-parser'); // Body-parser для преобразования тела запроса
const mongoose = require('mongoose'); // Подключили mongoose
const cors = require('cors'); // Подключили mongoose
const cookieParser = require('cookie-parser'); // Модуль для разбора кукисов
const { requestLogger, errorLogger } = require('./middlewares/logger'); // Логгер запросов и ошибок
const auth = require('./middlewares/auth'); // Мидлвэр авторизации

// Роутеры
const usersRouter = require('./routes/users'); // Роут пользователей
const cardsRouter = require('./routes/cards'); // Роут карточек
const notfound = require('./routes/notfound'); // Роут ответа 404 ошибки

// Контроллеры
const createUser = require('./controllers/createUser');
const login = require('./controllers/login');

// Объявили экспресс
const app = express();

// Исправили проблему с cors
app.use(cors());

// Запустили сервер на нужном порту
app.listen(PORT, () => {
  console.log(`App started. Listening at port ${PORT}`);
});

// Подключили body-parser для JSON запросов
app.use(bodyParser.json());
// Парсинг кукисов тоже подключили
app.use(cookieParser());

// Подключились к Mongodb
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// Объявили логгер реквестов (до обработчиков реквестов)
app.use(requestLogger);

// Краш тэст сервера
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// Объявляем роуты
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(5).max(40),
    password: Joi.string().required().min(5),
  }),
}), login); // Авторизация

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(5).max(40),
    password: Joi.string().required().min(5),
  }),
}), createUser); // Создание пользователя

app.use('/', auth, usersRouter); // Роутер юзеров
app.use('/', auth, cardsRouter); // Роутер карточек
app.use('*', auth, notfound); // Роутер страницы 404, без авторизации мы даже её не покажем

// Объявили логгер ошибок (после обработчиков реквестов и до обработчика ошибок)
app.use(errorLogger);

// Обработчик ошибок Celebrate (должен быть после роутеров, чтобы отловить ошибки)
app.use(errors());

// Обработчик ошибок в конце файла после других мидллвэров (чтобы ловить все ошибки)
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  // Если у ошибки статус 500 - отправляем стандартное сообщение об ошибке
  res.status(statusCode).send({ message: statusCode === 500 ? 'Ошибка на сервере' : message });
  next();
});
