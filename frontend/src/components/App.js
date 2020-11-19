import React from 'react'; // Реакт
import { Route, Switch, withRouter } from 'react-router-dom'; // Компоненты для роутинга и редиректа
import ProtectedRoute from './ProtectedRoute'; // HOC компонент для защиты роута
import Header from './Header'; // Шапка
import Footer from './Footer'; // Подвал
import Main from './Main'; // Основной контент
import Login from './Login'; // Страница авторизации
import Register from './Register'; // Страница регистрации
import PopupWithForm from './PopupWithForm'; // Попап с формой
import ImagePopup from './ImagePopup'; // Попап просмотра картинки
import EditProfilePopup from './EditProfilePopup'; // Попап редактирования профиля
import EditAvatarPopup from './EditAvatarPopup'; // Попап редактирования аватара
import AddPlacePopup from './AddPlacePopup'; // Попап добавления места
import InfoTooltip from './InfoTooltip'; // Попап добавления места
import api from '../utils/api'; // Подключение к апи для получения данных
import { CurrentUserContext } from '../contexts/currentUserContext'; // Контекст текущего юзера
import auth from '../utils/auth';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditAvatarPopupOpen: false,
      isEditProfilePopupOpen: false,
      isAddPlacePopupOpen: false,
      isTooltipPopupOpen: false,
      confirmDeletePopupOpen: false,
      selectedCard: '',
      currentUser: '',
      cards: [],
      // FIXME: Переменная для нужд разработки, авторизован ли юзер
      isUserLogined: false,
    };
  }

  handleLogin = (token, email) => {
    // Сменили состояние юзера на "авторизован"
    this.setState({
      isUserLogined: true,
      userEmailAddress: email,
    }, () => {
      // Сохранили токен в локальное хранилище браузера
      this.saveTokenToLocalStorage(token);
    });
  }

  saveTokenToLocalStorage = (token) => {
    localStorage.setItem('jwt', token);
  }

  handleLogout = () => {
    // Удалили токен
    localStorage.removeItem('jwt');

    // Сменили состояние юзера на "не авторизован"
    this.setState({
      isUserLogined: false,
    }, () => {
      this.props.history.push('/sign-in');
    });
  }

  openErrorTooltip = () => {
    this.setState({
      isTooltipPopupOpen: true,
      tooltipStatus: 'error',
      tooltipText: 'Что-то пошло не так! Попробуйте ещё раз.',
    });
  }

  openSuccessTooltip = () => {
    this.setState({
      isTooltipPopupOpen: true,
      tooltipStatus: 'success',
      tooltipText: 'Вы успешно зарегистрировались!',
    });
  }

  handleEditAvatarClick = () => {
    this.setState({ isEditAvatarPopupOpen: true });
  }

  handleEditProfileClick = () => {
    this.setState({ isEditProfilePopupOpen: true });
  }

  handleAddPlaceClick = () => {
    this.setState({ isAddPlacePopupOpen: true });
  }

  handleCardClick = (card) => {
    this.setState({ selectedCard: card });
  }

  closeAllPopups = () => {
    this.setState({
      isEditAvatarPopupOpen: false,
      isEditProfilePopupOpen: false,
      isAddPlacePopupOpen: false,
      confirmDeletePopupOpen: false,
      isTooltipPopupOpen: false,
      selectedCard: '',
    });
  }

  handleUpdateUser = (newUserData) => {
    api.saveUserInfo(newUserData).then((responseData) => {
      this.setState({ currentUser: responseData });
      this.closeAllPopups();
    }).catch((error) => console.log(error));
  }

  handleUpdateAvatar = (newAvatarData) => {
    // Обновить аватар
    api.changeAvatar(newAvatarData).then((responseData) => {
      // Обновить контекст
      this.setState({ currentUser: responseData });
      this.closeAllPopups();
    }).catch((error) => console.log(error));
  }

  handleCardLike = (card) => {
    // Проверяем, лайкнута ли карточка
    const isLiked = card.likes.some((like) => like._id === this.state.currentUser._id);
    // Если карта "лайкнута", передаем в апи "не нужен лайк" чтобы снять лайк при клике
    // Метод вернёт карточку места с обновленным числом лайков (объект, элемент массива)
    api.changeCardLike(card._id, !isLiked).then((updatedCard) => {
      // Обновить число лайков на карточках (внести изменение в стейт списка карточек)
      const newCardsState = this.state.cards.map((item) => {
        // Находим в массиве карточку с нужным   ._id
        if (item._id === updatedCard._id) {
          return updatedCard; // Возвращаем вместо неё новую карточку, полученную в ответе апи
        }
        return item;
      });

      this.setState({ cards: newCardsState }); // Обновили состояние карточек
    }).then().catch((error) => console.log(error));
  }

  handleCardDelete = (card) => {
    // Нам надо удалять карточку только после подтверждения
    // 0) Создать переменную с карточкой, которую мы будем удалять
    this.cardToDelete = card;
    // 1) Открыть попап подтверждения удаления передав в него пропсом
    this.setState({ confirmDeletePopupOpen: true });
    // 2) Если юзер подтвердил удаление, удалить карточку
    // 2) Если юзер не подтвердил удаление, ничего не делать
  }

  cardDelete = (event) => {
    event.preventDefault();
    // Передаём переменную в компоненте при помощи переменной класса
    const card = this.cardToDelete;
    api.deleteCard(card._id).then((response) => {
      // Если был получен ответ от сервера, и он не null
      if (response) {
        // После удаления в апи надо удалить карточку из списка карточек
        // В массиве оставляем только карточки, у которых id не совпадают с удаляемой карточкой
        const reducedCards = this.state.cards.filter((item) => item._id !== card._id);
        this.setState({ cards: reducedCards });
        this.cardToDelete.current = {};
      }
    }).catch((error) => {
      console.log(error);
    });
    // Закрыть все попапы
    this.closeAllPopups();
  }

  handleAddPlaceSubmit = (newCardObject) => {
    api.addCard(newCardObject).then((responseData) => {
      this.setState({ cards: [responseData, ...this.state.cards] });
      this.closeAllPopups();
    }).catch((error) => console.log(error));
  }

  checkUserToken = () => {
    if (localStorage.getItem('jwt')) {
      const token = localStorage.getItem('jwt');
      // Проверить валидность токена
      auth.checkToken(token).then((json) => {
        if (json) {
          // Если токен валиден, авторизовать юзера
          this.setState({
            isUserLogined: true,
            userEmailAddress: json.data.email,
          }, () => {
            this.props.history.push('/');
          });
        } else {
          this.setState({
            isUserLogined: false,
          }, () => {
            // Если токен просрочен или некорректен, удалили его
            localStorage.removeItem('jwt');
          });
        }
      });
    } else {
      // Если юзер невалиден, переадресовать юзера на экран авторизации. Лишним не будет.
      this.setState({
        isUserLogined: false,
      });
      this.props.history.push('/sign-in');
    }
  }

  componentDidMount() {
    this.checkUserToken();

    // Использовал Promise.all по совету код-ревьюера, теперь стейт юзера и карточек обновляется
    // в одном выражении вместо двух, упростил читаемость кода
    Promise.all([api.getUserInfo(), api.getCardsList()]).then(([userInfo, cardsData]) => {
      console.log(userInfo);
      this.setState({
        currentUser: userInfo,
        cards: cardsData,
      });
    }).catch((error) => console.log(error));
  }

  render() {
    return (
      <CurrentUserContext.Provider value={this.state.currentUser}>
        <Header userEmail={this.state.userEmailAddress} onSignOut={this.handleLogout}/>

        <Switch>
          <Route path='/sign-up'>
            <Register error={this.openErrorTooltip} success={this.openSuccessTooltip} handleLogin={this.handleLogin} />
          </Route>

          <Route path='/sign-in'>
            <Login error={this.openErrorTooltip} onLogin={this.handleLogin} />
          </Route>

          <Route exact path='/'>
            <ProtectedRoute
              path='/'
              component={Main}
              isLogined={this.state.isUserLogined}
              onEditProfile={this.handleEditProfileClick}
              onAddPlace={this.handleAddPlaceClick}
              onEditAvatar={this.handleEditAvatarClick}
              onCardClick={this.handleCardClick}
              cards={this.state.cards}
              onCardLike={this.handleCardLike}
              onCardDelete={this.handleCardDelete}
            />
            <ProtectedRoute path='/' component={Footer} isLogined={this.state.isUserLogined} />
            <EditProfilePopup isOpen={this.state.isEditProfilePopupOpen} onClose={this.closeAllPopups} onUpdateUser={this.handleUpdateUser} />
            <AddPlacePopup isOpen={this.state.isAddPlacePopupOpen} onClose={this.closeAllPopups} onAddPlace={this.handleAddPlaceSubmit} />
            <PopupWithForm title="Вы уверены?" buttonText="Да" name="confirm" isOpen={this.state.confirmDeletePopupOpen} onSubmit={this.cardDelete} onClose={this.closeAllPopups} />
            <EditAvatarPopup onClose={this.closeAllPopups} isOpen={this.state.isEditAvatarPopupOpen} onUpdateAvatar={this.handleUpdateAvatar} />
            <ImagePopup onClose={this.closeAllPopups} card={this.state.selectedCard}/>
          </Route>
        </Switch>

        <InfoTooltip tooltipStatus={this.state.tooltipStatus} tooltipText={this.state.tooltipText} isOpen={this.state.isTooltipPopupOpen} onClose={this.closeAllPopups} />
      </CurrentUserContext.Provider>
    );
  }
}

export default withRouter(App);
