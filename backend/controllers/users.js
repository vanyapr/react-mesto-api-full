const WrongDataError = require('../errors/wrongData');
const NotFoundError = require('../errors/notFound');
const User = require('../models/user');

// Найти всех пользователей в базе
const getAllUsers = (req, res, next) => {
  User.find({}).then((data) => {
    res.send(data);
  }).catch(next);
};

// Найти пользователя в базе
const getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId).then((data) => {
    if (data) {
      res.send(data);
    }
    // Если пользователь не найден, вернём ошибку
    return Promise.reject(new NotFoundError('Пользователь не найден'));
  }).catch((error) => {
    if (error.kind === 'ObjectId') {
      next(new WrongDataError('Некорректный идентификатор пользователя'));
    } else {
      next(error);
    }
  });
};

// Обновить профиль пользователя
const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate({ _id: req.user._id }, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: true, // если пользователь не найден, он будет создан
  }).then((data) => {
    res.send(data);
  }).catch((error) => {
    if (error.name === 'ValidationError') {
      next(new WrongDataError('Ошибка валидации - исправьте тело запроса'));
    } else {
      next(error);
    }
  });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findOneAndUpdate({ _id: req.user._id }, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: true, // если пользователь не найден, он будет создан
  }).then((data) => {
    res.send(data);
  }).catch((error) => {
    if (error.name === 'ValidationError') {
      next(new WrongDataError('Ошибка валидации - исправьте тело запроса'));
    } else {
      next(error);
    }
  });
};

const getSelf = (req, res, next) => {
  User.findOne({ _id: req.user._id }).then((user) => {
    res.send(user);
  }).catch(next); // Авторизация юзера проверяется в мидлвэре авторизации
};

module.exports = {
  getAllUsers,
  getUser,
  updateProfile,
  updateAvatar,
  getSelf,
};
