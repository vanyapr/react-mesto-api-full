import React from 'react';
import Card from './Card';
import { CurrentUserContext } from '../contexts/currentUserContext'; // Контекст текущего юзера

class Main extends React.PureComponent {
  static contextType = CurrentUserContext;

  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <main className="main">
        {/* Профиль пользователя */}
        <section className="profile">
          <div className="profile__avatar-container" onClick={this.props.onEditAvatar}>
            <img src={this.context.avatar} alt="Жак-Ив Кусто" className="profile__avatar" />
          </div>

          <div className="profile__info">
            <h1 className="profile__title">{this.context.name}</h1>
            <p className="profile__description">{this.context.about}</p>
            <button className="profile__edit-button" title="Редактировать профиль" onClick={this.props.onEditProfile}>Редактировать профиль</button>
          </div>

          <button className="profile__add-button" title="Добавить место" onClick={this.props.onAddPlace}>Добавить место</button>
        </section>
        {/* Профиль пользователя */}

        {/* Список мест  */}
        <section className="places" aria-label="Места">
          {/*  Контейнер для рендера списка мест  */}
          <ul className="places__list">
            {this.props.cards.map((item, key) => (
              <Card card={item} key={key} onCardClick={this.props.onCardClick} onCardLike={this.props.onCardLike} onCardDelete={this.props.onCardDelete}/>
            ))}
          </ul>
          {/* // Контейнер для рендера списка мест   */}
        </section>
        {/* Список мест  */}
      </main>
    );
  }
}

export default Main;
