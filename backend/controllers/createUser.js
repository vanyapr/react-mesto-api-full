const WrongDataError = require('../errors/wrongData');
const bcrypt = require('bcryptjs');
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
      res.send(data);
    }).catch((error) => {
      if (error.name === 'ValidationError') {
        next(new WrongDataError('Ошибка валидации - исправьте тело запроса'));
      } else {
        next(error);
      }
    });
};

module.exports = createUser;
