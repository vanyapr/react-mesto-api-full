const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Создать пользователя в базе
const createUser = (req, res) => {
  const { email, password } = req.body;
  let { name, about, avatar } = req.body;

  // Если мы отправляем пустые значения в JSON объекте (name: ''), юзер не создаётся
  // Поэтому мы жестко зададим эти значения как undefined,
  // чтобы значение default в mongoose сработало
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
        res.status(400).send(error);
        // res.status(400).send({ message: 'Ошибка валидации - исправьте тело запроса' });
      } else {
        res.status(500).send({ message: error.message });
      }
    });
};

module.exports = createUser;
