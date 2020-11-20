const bcrypt = require('bcryptjs');
const WrongDataError = require('../errors/wrongData');
const User = require('../models/user');

// Создать пользователя в базе
const createUser = (req, res, next) => {
  const { email, password } = req.body;
  let { name, about, avatar } = req.body;

  // Если мы отправляем пустые значения в JSON объекте (name: ''), юзер не создаётся
  // Поэтому мы жестко зададим эти значения как undefined,
  // чтобы значение default в mongoose сработало для случаев с пустыми полями
  if (name === '') {
    name = undefined;
  }

  if (about === '') {
    about = undefined;
  }

  if (avatar === '') {
    avatar = undefined;
  }

  bcrypt.hash(password, 10)
    .then((passwordHash) => User.create({ name, about, avatar, email, password: passwordHash }))
    .then((data) => {
      res.status(201).send(data);
    }).catch((error) => {
      if (error.name === 'ValidationError') {
        next(new WrongDataError('Ошибка валидации - исправьте тело запроса'));
      } else if (error.name === 'MongoError') {
        // На боевых проектах так нельзя, но здесь я хочу отловить ошибку
        next(new WrongDataError('Ошибка валидации - email должен быть уникальным'));
      } else {
        next(error);
      }
    });
};

module.exports = createUser;
