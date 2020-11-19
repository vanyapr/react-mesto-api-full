const jwt = require('jsonwebtoken');
const { JWT_SECRET = 'development_only_secret_key' } = process.env;

const auth = (req, res, next) => {
  const { authorisation } = req.cookies;

  if (!authorisation && !authorisation.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация: нет токена' });
  }

  const token = authorisation.replace('Bearer ', '');
  let payload;

  try {
    // Метод jwt.verify() вернёт пэйлоад токена
    payload = jwt.verify(token, JWT_SECRET); // Вторым аргументом передали токен
  } catch (error) {
    // Если что-то пошло не так, вернётся ошибка, которую надо обработать в блоке catch
    return res.status(401).send({ message: 'Необходима авторизация: ошибка расшифровки токена' });
  }

  // Записали _id пользователя в запрос
  req.user = payload;
  next();
};

module.exports = auth;
