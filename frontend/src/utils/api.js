import { token, cohort } from './utils.js';

class Api {
  // Конструктор принимает токен
  constructor(token, cohort) {
    this._token = token; // Токен
    this._cohort = cohort; // Когорта
  }

  // Почему бы не вынести обработчик ответа сервера в приватный метод апи?
  _processResponse(serverResponse) {
    // console.log(serverResponse); Для нужд дебагинга

    if (serverResponse.ok) {
      return serverResponse.json(); // Если сервер ответил без ошибок, вернули данные в JSON
    }

    return Promise.reject(`Ошибка: ${serverResponse.status}`); // Иначе вернули ошибку, которая попадёт в catch
  }

  getUserInfo() {
    return fetch(`https://mesto.nomoreparties.co/v1/${this._cohort}/users/me`, {
      method: 'GET',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json',
      },
    }).then(this._processResponse);
  }

  saveUserInfo(userObject) {
    return fetch(`https://mesto.nomoreparties.co/v1/${this._cohort}/users/me`, {
      method: 'PATCH',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userObject),
    }).then(this._processResponse);
  }

  getCardsList() {
    return fetch(`https://mesto.nomoreparties.co/v1/${this._cohort}/cards`, {
      method: 'GET',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json',
      },
    }).then(this._processResponse);
  }

  addCard(cardObject) {
    return fetch(`https://mesto.nomoreparties.co/v1/${this._cohort}/cards`, {
      method: 'POST',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cardObject),
    }).then(this._processResponse);
  }

  deleteCard(cardId) {
    return fetch(`https://mesto.nomoreparties.co/v1/${this._cohort}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json',
      },
    }).then(this._processResponse);
  }

  changeCardLike(cardId, needLike) {
    let requestMethod = '';

    if (needLike) {
      requestMethod = 'PUT'; // Если вторым параметром пришло true, ставим лайк
    } else {
      requestMethod = 'DELETE'; // Если вторым параметром пришло false, снимаем лайк
    }

    return fetch(`https://mesto.nomoreparties.co/v1/${this._cohort}/cards/likes/${cardId}`, {
      method: requestMethod,
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json',
      },
    }).then(this._processResponse);
  }

  changeAvatar(avatarData) {
    return fetch(`https://mesto.nomoreparties.co/v1/${this._cohort}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(avatarData),
    }).then(this._processResponse);
  }
}

const api = new Api(token, cohort);
export default api;

// Коментарий для проверки разрешения конфликта с гитхабом
