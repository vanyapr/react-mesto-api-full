import React, { useState } from 'react';
import { Link, Switch, Route } from 'react-router-dom';
import logoPath from '../images/logo.svg';

const Header = React.memo(({ onSignOut, userEmail }) => {
  const [navigationState, toggleNavigation] = useState({
    opened: false,
  });

  const switchNavigation = () => {
    toggleNavigation({
      opened: !navigationState.opened,
    });
  };

  const signOut = () => {
    // Закрываем навигацию
    toggleNavigation({
      opened: false,
    });

    // Разавторизуем пользователя
    onSignOut();
  };

  return (
    <header className={`header ${navigationState.opened ? 'header_state_navigation-opened' : ''}`}>
      <Link to="/" title="Место" className="logo">
        <img src={logoPath} alt="Место" className="logo__image"/>
      </Link>
      <Switch>
        <Route exact path='/sign-up'>
          <Link to='/sign-in' title='Авторизоваться' className='header__link'>Войти</Link>
        </Route>
        <Route exact path='/sign-in'>
          <Link to='/sign-up' title='Зарегистрироваться' className='header__link'>Регистрация</Link>
        </Route>
        <Route exact path='/'>
          <nav className='header__navigation'>
            <ul className='header__navigation-list'>
              <li className='header__navigation-item'>{userEmail}</li>
              <li className='header__navigation-item'>
                <button onClick={signOut} title='Выйти' className='header__link_type_logout'>Выйти</button>
              </li>
            </ul>
          </nav>
          <button onClick={switchNavigation} className={`header__navigation-switch header__navigation-switch_state_${navigationState.opened ? 'on' : 'off'}`}>Навигация</button>
        </Route>
      </Switch>
    </header>
  );
});

export default Header;
