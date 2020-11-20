const authUrl = 'http://localhost:3000';

class Api {
  // Конструктор принимает токен
  constructor(token) {
    this._token = token; // Токен
  }

  // Почему бы не вынести обработчик ответа сервера в приватный метод апи?
  _processResponse(serverResponse) {
    // console.log(serverResponse); Для нужд дебагинга

    if (serverResponse.ok) {
      return serverResponse.json(); // Если сервер ответил без ошибок, вернули данные в JSON
    }

    return Promise.reject(new Error(`Ошибка: ${serverResponse.status}`)); // Иначе вернули ошибку, которая попадёт в catch
  }

  getUserInfo() {
    return fetch(`${authUrl}/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this._token}`,
        'Content-Type': 'application/json',
      },
    }).then(this._processResponse);
  }

  saveUserInfo(userObject) {
    return fetch(`${authUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this._token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userObject),
    }).then(this._processResponse);
  }

  getCardsList() {
    return fetch(`${authUrl}/cards`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this._token}`,
        'Content-Type': 'application/json',
      },
    }).then(this._processResponse);
  }

  addCard(cardObject) {
    return fetch(`${authUrl}/cards`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this._token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cardObject),
    }).then(this._processResponse);
  }

  deleteCard(cardId) {
    return fetch(`${authUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this._token}`,
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

    return fetch(`${authUrl}/cards/${cardId}/likes`, {
      method: requestMethod,
      headers: {
        'Authorization': `Bearer ${this._token}`,
        'Content-Type': 'application/json',
      },
    }).then(this._processResponse);
  }

  changeAvatar(avatarData) {
    return fetch(`${authUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this._token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(avatarData),
    }).then(this._processResponse);
  }
}

export default Api;

// Коментарий для проверки разрешения конфликта с гитхабом
