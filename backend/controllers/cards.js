const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({}).populate('owner').then((data) => {
    res.send(data);
  }).catch((error) => {
    res.status(500).send({ message: error.message });
  });
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id }).then((data) => {
    res.send(data);
  }).catch((error) => {
    if (error.name === 'ValidationError') {
      res.status(400).send({ message: 'Ошибка валидации данных' });
    } else {
      res.status(500).send({ message: error.message });
    }
  });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId).then((data) => {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({ message: 'Такой карточки нет' });
    }
  }).catch((error) => {
    if (error.kind === 'ObjectId') {
      res.status(400).send({ message: 'Такой карточки нет' });
    } else {
      res.status(500).send({ message: error.message });
    }
  });
};

const putLikeToCard = (req, res) => {
  const { cardId } = req.params;

  // TODO: Если лайк уже стоит, надо бы отвечать, что лайк уже стоит
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  }).populate('likes').then((data) => {
    if (data) {
      res.send(data);
    } else {
      // Эта ошибка сработает если в метод передать корректный ObjectId отсутствующий в БД.
      // Например вы можете создать пользователя, скопировать его ObjectId и получить ошибку :)
      res.status(404).send({ message: 'Карточка не найдена' });
    }
  }).catch((error) => {
    if (error.kind === 'ObjectId') {
      res.status(400).send({ message: 'Такой карточки нет' });
    } else {
      res.status(500).send({ message: error.message });
    }
  });
};

// Стоит описать отдельные методы, на случай, если в будущем функционал будет меняться
const deleteLikeFromCard = (req, res) => {
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
      res.status(404).send({ message: 'Карточка не найдена' });
    }
  }).catch((error) => {
    if (error.kind === 'ObjectId') {
      res.status(400).send({ message: 'Такой карточки нет' });
    } else {
      res.status(500).send({ message: error.message });
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
