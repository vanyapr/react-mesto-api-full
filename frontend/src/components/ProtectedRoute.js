import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// HOC компонент который оборачивает защищённые компоненты
const ProtectedRoute = ({ component: Component, ...props }) => {
  return (
    <Route>
      {
        () => (props.isLogined ? <Component {...props} /> : <Redirect to='/sign-in'/>)
      }
    </Route>
  );
};

export default ProtectedRoute;
