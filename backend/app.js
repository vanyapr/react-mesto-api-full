const dotenv = require('dotenv'); // Модуль дл работы с файлами .env
dotenv.config(); // Сконфигурировали модуль
const { PORT = 3000 } = process.env; // Переменные окружения
const express = require('express'); // Экспресс
const bodyParser = require('body-parser'); // Body-parser для преобразования тела запроса
const mongoose = require('mongoose'); // Подключили mongoose
const cookieParser = require('cookie-parser'); // Модуль для разбора кукисов
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

// Запустили сервер на нужном порту
app.listen(PORT, () => {
  console.log(`App started. Listening at port ${PORT}`);
});

// Подключили body-parser
app.use(bodyParser.json());
// Парсинг кукисов тоже подключили
app.use(cookieParser());

// Подключились к Mongodb
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// Объявляем роуты
app.post('/signin', login); // Авторизация
app.post('/signup', createUser); // Создание пользователя
app.use('/', auth, usersRouter); // Роутер юзеров
app.use('/', auth, cardsRouter); // Роутер карточек
app.use('*', auth, notfound); // Роутер страницы 404, без авторизации мы даже её не покажем
