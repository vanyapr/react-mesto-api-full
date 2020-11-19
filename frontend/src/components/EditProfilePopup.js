import React from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/currentUserContext';

const validators = {
  name: {
    required: (value) => {
      return value === '';
    },
    minLength: (value) => {
      return value && value.length < 3;
    },
  },
  about: {
    required: (value) => {
      return value === '';
    },
    minLength: (value) => {
      return value && value.length < 2;
    },
  },
};

function EditProfilePopup({ onUpdateUser, isOpen, onClose }) {
  const [formValues, changeFormValues] = React.useState({ name: '', about: '' });

  // Переменная для состояеия ошибок
  const [errors, setErroros] = React.useState({
    name: {
      required: true,
      minLength: true,
    },
    about: {
      required: true,
      minLength: true,
    },
  });

  const currentUser = React.useContext(CurrentUserContext);

  function handleFormChange(event) {
    const { name, value } = event.target;
    changeFormValues({ ...formValues, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    onUpdateUser(formValues);
  }

  React.useEffect(() => {
    changeFormValues({ name: currentUser.name, about: currentUser.about });
  }, [currentUser]);

  React.useEffect(() => {
    const { name, about } = formValues;
    const userNameValidationResult = Object.keys(validators.name).map((errorKey) => {
      const errorResult = validators.name[errorKey](name);
      return {
        [errorKey]: errorResult,
      };
    }).reduce((acc, element) => {
      return { ...acc, ...element };
    }, {});

    const aboutValidationResult = Object.keys(validators.about).map((errorKey) => {
      const errorResult = validators.about[errorKey](about);
      return {
        [errorKey]: errorResult,
      };
    }).reduce((acc, element) => {
      return { ...acc, ...element };
    }, {});

    setErroros({ name: userNameValidationResult, about: aboutValidationResult });
  }, [formValues, setErroros]);

  const isNameInvalid = Object.values(errors.name).some(Boolean);
  const isAboutInvalid = Object.values(errors.about).some(Boolean);
  const isSubmitButtonDisabled = isAboutInvalid || isNameInvalid;

  return (
    <PopupWithForm title="Редактировать профиль" buttonText="Сохранить" name="profile" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} isSubmitDisabled={isSubmitButtonDisabled} children={
      <>
        <div className="form__input-container">
          <input onChange={handleFormChange} defaultValue={formValues.name} type="text" name="name" className="form__input" id="profile-name" minLength="2" maxLength="40" aria-label="Имя" required/>
          {errors.name.required && <span className="form__error form__error_active" id="profile-name-error">Заполните это поле</span>}
          {errors.name.minLength && <span className="form__error form__error_active" id="profile-name-error">Минимальная длина - 3 символа</span>}
        </div>
        <div className="form__input-container">
          <input onChange={handleFormChange} defaultValue={formValues.about} type="text" name="about" className="form__input" id="profile-description" minLength="2" maxLength="40" aria-label="Род деятельности" required/>
          {errors.about.required && <span className="form__error form__error_active" id="profile-description-error">Заполните это поле</span>}
          {errors.about.minLength && <span className="form__error form__error_active" id="profile-description-error">Минимальная длина - 2 символа</span>}
        </div>
      </>
    }/>
  );
}

export default EditProfilePopup;
