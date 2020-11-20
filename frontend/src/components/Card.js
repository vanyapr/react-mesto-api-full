import React from 'react';
import { CurrentUserContext } from '../contexts/currentUserContext';

const Card = React.memo(({ card, onCardClick, onCardLike, onCardDelete }) => {
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = currentUser._id === card.owner._id;
  const isLiked = card.likes.some((like) => like._id === currentUser._id); // Проверяем, установлен ли лайк

  function handleClick() {
    onCardClick(card);
  }

  function handleLike() {
    onCardLike(card);
  }

  function handleDelete() {
    onCardDelete(card);
  }

  return (
    <li className="place">
      <img src={card.link} alt={card.name} onClick={handleClick} className="place__image"/>
      <h2 className="place__title">{card.name}</h2>

      <div className="place__like-container">
        <button className={`place__like ${isLiked && 'place__like_status_active'}`} title="Поставить месту лайк" onClick={handleLike}>Поставить месту лайк</button>
        <p className="place__likes-count" title={`Лайков - ${card.likes.length}`}>{card.likes.length}</p>
      </div>

      {isOwn && <button className="place__delete" title="Удалить место" onClick={handleDelete}>Удалить место</button> }
    </li>
  );
});

export default Card;
