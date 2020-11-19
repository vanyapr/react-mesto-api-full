const jwt = require('jsonwebtoken');
const { JWT_SECRET = 'development_only_secret_key' } = process.env;
const User = require('../models/user');

const login = (req, res) => {
  const { email, password } = req.body;

  // Обратиться к бд и получить данные пользователя
  User.findUserByCredintials(email, password).then((user) => {
    const payload = { _id: user._id };
    // Создать JWT токен со сроком жизни в неделю
    const token = jwt.sign(
      payload,
      JWT_SECRET,
      { // объект опций
        expiresIn: '7d', // Срок жизни токена, если не передать срок действия, токен не истечёт
      },
    );
    // В пейлоад записать _id пользователя
    res.cookie('authorisation', `Bearer ${token}`, {
      // Третьим параметром передали объект опций
      maxAge: 3600000 * 24 * 7,
      httpOnly: true, // Запретить доступ к куке из Javascript
      sameSite: true, // Отправлять куки этого домена только на тот же домен
    }).send(user);
  }).catch((error) => {
    res.status(401).send(error);
  });
};

module.exports = login;
