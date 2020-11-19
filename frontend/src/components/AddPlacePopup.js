import React, { useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

const AddPlacePopup = React.memo(({ isOpen, onClose, onAddPlace }) => {
  const [formValues, changeFormValues] = React.useState({
    name: '',
    link: '',
  });

  function handleSubmit(event) {
    event.preventDefault();
    onAddPlace(formValues);
    // Сбрасываем значения после сабмита
    changeFormValues({ name: '', link: '' });
  }

  // Для валидации нам нужно для каждого инпута вызвать валидацию и отрендерить ошибку в контейнер ошибки возле этого инпута
  function handleFormChange(event) {
    const { name, value } = event.target;
    changeFormValues({ ...formValues, [name]: value });
  }

  const [formValidity, setFormValidity] = React.useState({
    nameIsValid: false,
    linkIsValid: false,
  });

  useEffect(() => {
    const { name, link } = formValues;
    // 1) Проверить значение инпута
    const isNameFilled = name.length > 2;
    const isNameValid = isNameFilled;

    const isLinkFilled = link.length > 10;
    const isLinkValid = isLinkFilled;

    setFormValidity((oldState) => ({
      nameIsValid: isNameValid,
      linkIsValid: isLinkValid,
    }));
  }, [formValues, setFormValidity]);

  const { nameIsValid, linkIsValid } = formValidity;
  const isSubmitDisabled = !(nameIsValid && linkIsValid);

  return (
    <PopupWithForm title="Новое место" buttonText="Создать" name="place" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} isSubmitDisabled={isSubmitDisabled} children={
      <>
        <div className="form__input-container">
          <input onChange={handleFormChange} value={formValues.name} type="text" name="name" className="form__input" id="place-name" minLength="1" maxLength="30" placeholder="Название" aria-label="Название места" required/>
          {!nameIsValid && <span className="form__error form__error_active" id="place-name-error">Введите название места</span>}
        </div>
        <div className="form__input-container">
          <input onChange={handleFormChange} value={formValues.link} type="url" name="link" className="form__input" id="place-image" placeholder="Ссылка на картинку" aria-label="Ссылка на картинку" required/>
          {!linkIsValid && <span className="form__error form__error_active" id="place-image-error">Введите корректный url изображения</span>}
        </div>
      </>
    }/>
  );
});

export default AddPlacePopup;
