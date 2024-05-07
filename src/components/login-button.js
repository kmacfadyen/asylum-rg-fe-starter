// src/components/login-button.js

import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useHistory } from 'react-router-dom';
import './login-button.css';

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const history = useHistory();

  const handleLogin = async () => {
    await loginWithRedirect();
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      history.push('/profile');
    }
  }, [isAuthenticated, history]);

  return (
    <button
      className="btn btn-primary btn-block login-btn"
      onClick={handleLogin}
    >
      Log In
    </button>
  );
};

export default LoginButton;
