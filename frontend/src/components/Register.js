import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Auth from '../utils/auth';

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    Auth.register(email, password).then((json) => {
      if (json) {
        this.props.success();
        this.props.history.push('/sign-in'); // Отправили пользователя на главную страницу как авторизованного
      } else {
        this.props.error();
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  }

  render() {
    return (
      <main className='authorisation'>
        <h1 className="authorisation__title">Регистрация</h1>
        <form onSubmit={this.handleSubmit} method='POST' className="authorisation__form" name="authorisation-form">
          <input onChange={this.handleChange} type="email" name="email" className="authorisation__form-input" id="Email" minLength="6" maxLength="40" aria-label="Email" placeholder="Email" required />
          <input onChange={this.handleChange} type="password" name="password" className="authorisation__form-input" id="Password" minLength="3" maxLength="40" aria-label="Пароль" placeholder="Пароль" required />
          <button type="submit" className="authorisation__form-submit">Зарегистрироваться</button>
        </form>
        <p className='authorisation__text'>Уже зарегистрированы? <Link className='authorisation__link' to="/sign-in" title="">Войти</Link></p>
      </main>
    );
  }
}

export default withRouter(Register);
