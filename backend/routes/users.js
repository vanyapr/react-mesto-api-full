const usersRouter = require('express').Router();
const { getAllUsers, getUser, updateProfile, updateAvatar, getSelf} = require('../controllers/users');

usersRouter.get('/users', getAllUsers);
usersRouter.get('/users/me', getSelf);
usersRouter.get('/users/:userId', getUser);
usersRouter.patch('/users/me', updateProfile);
usersRouter.patch('/users/me/avatar', updateAvatar);

module.exports = usersRouter;
