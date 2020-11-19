import React from 'react';

const ImagePopup = React.memo(({ card, onClose }) => {
  return (
    <div className={`popup popup_type_image ${card && 'popup_opened'}`}>
      <figure className="popup__image-container">
        <button className="popup__close" onClick={onClose}>Закрыть форму</button>
        {/* Поскольку мы не имеем изображения при инициализации, не рендерим эту картинку, если карточка не выбрана */}
        {card && <img className="popup__image" src={card.link} alt={card.name}/>}
        <figcaption className="popup__image-description">
          {card.name}
        </figcaption>
      </figure>
    </div>
  );
});

export default ImagePopup;
