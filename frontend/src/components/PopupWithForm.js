import React from 'react';

const PopupWithForm = React.memo(({ name, isOpen, onClose, title, onSubmit, children, isSubmitDisabled, buttonText }) => {
  return (
    <div className={`popup popup_type_${name} ${isOpen && 'popup_opened'}`}>
      <div className="popup__container">
        <button className="popup__close" onClick={onClose}>Закрыть форму</button>
        <form className="form" name={name} onSubmit={onSubmit} noValidate>
          <h2 className="form__title">{title}</h2>
          {children}
          <button type="submit" className={`form__submit ${isSubmitDisabled && 'form__submit_inactive'}`}>{buttonText}</button>
        </form>
      </div>
    </div>
  );
});

export default PopupWithForm;
