const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        // Проверяем url адрес на соответствие шаблону url
        // Строка для проверки:
        // 'https://www.Images.unsplash.com/photo-1603308541583-d4836bb68c0f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1268&q=80#взял_and-проверил'
        const urlRegexp = /^(https?:\/\/([a-z0-9\-]{2,}\.)+[a-z]{2,}(\/[a-zA-Z0-9\-\.\&\?\/\=\"\']*)?#?[a-zа-яё0-9_\-]*)$/i;
        return urlRegexp.test(link);
        // TODO: Асинхронный код
      },
      message: 'Введите корректный url адрес изображения!',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('card', cardSchema);
