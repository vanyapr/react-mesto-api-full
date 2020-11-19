const mongoose = require('mongoose');
const validator = require('validator'); // Модуль для валидации данных (имейл)

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(avatar) {
        // Проверяем url адрес на соответствие шаблону url
        // Строка для проверки:
        // 'https://www.Images.unsplash.com/photo-1603308541583-d4836bb68c0f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1268&q=80#взял_and-проверил'
        const urlRegexp = /^(https?:\/\/([a-z0-9\-]{2,}\.)+[a-z]{2,}(\/[a-zA-Z0-9\-\.\&\?\/\=\"\']*)?#?[a-zа-яё0-9_\-]*)$/i;
        return urlRegexp.test(avatar);
        // TODO: Асинхронный код
      },
      message: 'Введите корректный url адрес изображения!',
    },
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 40,
    unique: true,
    validate: {
      validator(email) {
        // Проверяем имейл на соответствие шаблону имейла
        // Строка для проверки: a2-b.c23@a2-a.bb
        // const emailRegexp = /^[a-z0-9\-\.]+@[a-z0-9\-\.]+\.[a-z]+/;
        // return emailRegexp.test(email);
        return validator.isEmail(email);
      },
      message: 'Введите корректный адрес e-mail',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
});

module.exports = mongoose.model('user', userSchema);
