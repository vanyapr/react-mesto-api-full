const jwt = require('jsonwebtoken');
const UnauthorisedError = require('../errors/unauthorised');
const { JWT_SECRET = 'development_only_secret_key' } = process.env;

const auth = (req, res, next) => {
  const { authorisation } = req.cookies;

  // В теории дали неправильный код, но нас не наебёшь
  if (!authorisation || !authorisation.startsWith('Bearer ')) {
    // В целях дебагинга и наглядности мы распишем ошибки
    next(new UnauthorisedError('Необходима авторизация: нет токена'));
    return;
  }

  const token = authorisation.replace('Bearer ', '');
  let payload;

  try {
    // Метод jwt.verify() вернёт пэйлоад токена
    payload = jwt.verify(token, JWT_SECRET); // Вторым аргументом передали токен
  } catch (error) {
    // Если что-то пошло не так, вернётся ошибка, которую надо обработать в блоке catch
    // В целях дебагинга и наглядности мы распишем ошибки
    next(new UnauthorisedError('Необходима авторизация: токен недействителен или просрочен'));
    return;
  }

  // Записали _id пользователя в запрос
  req.user = payload;
  next();
};

module.exports = auth;
