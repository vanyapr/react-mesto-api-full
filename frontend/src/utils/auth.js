const authUrl = 'https://auth.nomoreparties.co';

// Метод регистрации на сервисе
const register = (email, password) => {
  return fetch(`${authUrl}/signup`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password, email }),
  }).then((responce) => {
    // Отлавливаем ошибку регистрации (ответ сервера)
    if (!responce.ok) {
      throw responce;
    }

    if (responce.status === 201) {
      return responce.json();
    } else if (responce.status === 400) {
      console.log('Некорректно заполнено одно из полей');
    }
  }).catch((error) => {
    error.text().then((errorMessage) => {
      console.log(errorMessage);
    });
  });
};

// Метод авторизации на сервисе
const login = (email, password) => {
  return fetch(`${authUrl}/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password, email }),
  }).then((responce) => {
    // Отлавливаем ошибку авторизации (ответ сервера)
    if (!responce.ok) {
      throw responce;
    }
    if (responce.status === 200) {
      return responce.json();
    } else if (responce.status === 400) {
      console.log('Не передано одно из полей');
    } else if (responce.status === 401) {
      console.log('Пользователь с таким email  не найден');
    }
  }).catch((error) => {
    error.text().then((errorMessage) => {
      console.log(errorMessage);
    });
  });
};

const checkToken = (token) => {
  return fetch(`${authUrl}/users/me`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  }).then((responce) => {
    if (responce.status === 200) {
      return responce.json();
    } else if (responce.status === 401) {
      console.log('Токен недействителен');
    }
  }).catch((error) => {
    console.log(error);
  });
};

export default {
  register,
  login,
  checkToken,
};
