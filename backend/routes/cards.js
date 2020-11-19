const cardsRouter = require('express').Router();
const { getCards, createCard, deleteCard, putLikeToCard, deleteLikeFromCard } = require('../controllers/cards');

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', createCard);
cardsRouter.delete('/cards/:cardId', deleteCard);
cardsRouter.put('/cards/:cardId/likes', putLikeToCard);
cardsRouter.delete('/cards/:cardId/likes', deleteLikeFromCard);

module.exports = cardsRouter;
