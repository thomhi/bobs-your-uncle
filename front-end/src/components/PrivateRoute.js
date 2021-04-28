import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default function PrivateRoute({component, isAuthenticated, userID, localStorageService, userService, ...routeProps}){
  if (isAuthenticated || localStorage.getItem('isAuthenticated') === 'true') {
    return (
      <Route
        exact
        {...routeProps}
        render={(props) =>
          React.createElement(component, { userID, localStorageService, userService, ...props })
        }
      />
    );
  } else {
    return (
      <Route
        exact
        {...routeProps}
        render={() => (
          <Redirect
            to={{ pathname: '/bobs-your-uncle/signIn' }}
          />
        )}
      />
    );
  }
}