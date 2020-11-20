const { celebrate, Joi } = require('celebrate');
const usersRouter = require('express').Router();
const { getAllUsers, getUser, updateProfile, updateAvatar, getSelf } = require('../controllers/users');

usersRouter.get('/users', getAllUsers);
usersRouter.get('/users/me', getSelf);

usersRouter.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24),
  }),
}), getUser);

usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().max(30),
    about: Joi.string().max(30),
  }),
}), updateProfile);

usersRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string(),
  }),
}), updateAvatar);

module.exports = usersRouter;
