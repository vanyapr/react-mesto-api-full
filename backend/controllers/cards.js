const Card = require('../models/card');
const WrongDataError = require('../errors/wrongData');
const UnauthorisedError = require('../errors/unauthorised');
const NotFoundError = require('../errors/notFound');

const getCards = (req, res, next) => {
  Card.find({}).populate('owner').populate('likes').then((data) => {
    res.send(data);
  }).catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id }).then((data) => {
    res.send(data);
  }).catch((error) => {
    if (error.name === 'ValidationError') {
      next(new WrongDataError('Ошибка валидации данных'));
    } else {
      next(error);
    }
  });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  // Необходимо проверять права на удаление карточки перед самим удалением
  // Сперва найти карточку
  Card.findById(cardId).then((card) => {
    if (card) {
      // Потом проверить, что айди владельца === айди текущего пользователя
      // if (card.owner === req.user._id) { //- не срабатывает, хз почему
      // При точном сравнении id не сравниваются корректно без приведения к строке
      if (card.owner.toString() === req.user._id.toString()) {
        // Если мы являемся владельцем, удалить карточку
        return Card.findByIdAndDelete(cardId).then((result) => {
          res.send(result);
        });
      }
      // Иначе вернуть ошибку
      return Promise.reject(new UnauthorisedError('У вас нет прав на удаление этой карточки'));
    }
    return Promise.reject(new NotFoundError('Карточка не найдена'));
  }).catch((error) => {
    if (error.kind === 'ObjectId') {
      next(new WrongDataError('Некорректный идентификатор карточки'));
    } else {
      next(error);
    }
  });
};

const putLikeToCard = (req, res, next) => {
  const { cardId } = req.params;

  // TODO: Если лайк уже стоит, надо бы отвечать, что лайк уже стоит
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  }).populate('likes').then((data) => {
    if (data) {
      res.send(data);
    }
    // Эта ошибка сработает если в метод передать корректный ObjectId отсутствующий в БД.
    // Например вы можете создать пользователя, скопировать его ObjectId и получить ошибку :)
    Promise.reject(new NotFoundError('Карточка не найдена'));
  }).catch((error) => {
    if (error.kind === 'ObjectId') {
      next(new WrongDataError('Некорректный идентификатор карточки'));
    } else {
      next(error);
    }
  });
};

// Стоит описать отдельные методы, на случай, если в будущем функционал будет меняться
const deleteLikeFromCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  }).populate('likes').then((data) => {
    if (data) {
      res.send(data);
    } else {
      // Эта ошибка сработает если в метод передать корректный ObjectId отсутствующий в БД.
      // Например вы можете создать пользователя, скопировать его ObjectId и получить ошибку :)
      Promise.reject(new NotFoundError('Карточка не найдена'));
    }
  }).catch((error) => {
    if (error.kind === 'ObjectId') {
      next(new WrongDataError('Некорректный идентификатор карточки'));
    } else {
      next(error);
    }
  });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLikeToCard,
  deleteLikeFromCard,
};
