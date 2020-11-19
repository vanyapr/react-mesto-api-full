const User = require('../models/user');

// Найти всех пользователей в базе
const getAllUsers = (req, res) => {
  User.find({}).then((data) => {
    res.send(data);
  }).catch((error) => {
    res.status(500).send({ message: error.message });
  });
};

// Найти пользователя в базе
const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId).then((data) => {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({ message: 'Пользователь не найден' });
    }
  }).catch((error) => {
    if (error.kind === 'ObjectId') {
      res.status(400).send({ message: 'Такого пользователя нет' });
    } else {
      res.status(500).send({ message: error.message });
    }
  });
};

// Создать пользователя в базе
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar }).then((data) => {
    res.send(data);
  }).catch((error) => {
    if (error.name === 'ValidationError') {
      res.status(400).send({ message: 'Ошибка валидации - исправьте тело запроса' });
    } else {
      res.status(500).send({ message: error.message });
    }
  });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate({ _id: req.user._id }, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: true, // если пользователь не найден, он будет создан
  }).then((data) => {
    res.send(data);
  }).catch((error) => {
    if (error.name === 'ValidationError') {
      res.status(400).send({ message: 'Ошибка валидации - исправьте тело запроса' });
    } else {
      res.status(500).send({ message: error.message });
    }
  });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findOneAndUpdate({ _id: req.user._id }, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: true, // если пользователь не найден, он будет создан
  }).then((data) => {
    res.send(data);
  }).catch((error) => {
    if (error.name === 'ValidationError') {
      res.status(400).send({ message: 'Ошибка валидации - исправьте тело запроса' });
    } else {
      res.status(500).send({ message: error.message });
    }
  });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
};
