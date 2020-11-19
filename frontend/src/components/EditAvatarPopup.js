import React from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/currentUserContext';

const EditAvatarPopup = React.memo(({ onUpdateAvatar, isOpen, onClose }) => {
  const currentUser = React.useContext(CurrentUserContext);
  const avatarRef = React.useRef(currentUser.avatar);

  function handleAvatarChange(event) {
    avatarRef.current = event.target.value;
  }

  function handleSubmit(event) {
    event.preventDefault();
    onUpdateAvatar({ avatar: avatarRef.current });
  }

  React.useEffect(() => {
    avatarRef.current = currentUser.avatar;
  }, [currentUser]);

  return (
    <PopupWithForm title="Обновить аватар" buttonText="Сохранить" name="avatar" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} children={
      <>
        <div className="form__input-container">
          <input onChange={handleAvatarChange} type="url" name="avatar" className="form__input form__input_value_avatar" id="user-avatar" defaultValue={avatarRef.current} placeholder="Ссылка на аватар" aria-label="Ссылка на аватар" required/>
          <span className="form__error" id="user-avatar-error"></span>
        </div>
      </>
    }/>
  );
});

export default EditAvatarPopup;
