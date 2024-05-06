// src/components/login-button.js

// import React from 'react';
// import { useAuth0 } from '@auth0/auth0-react';

// const LoginButton = () => {
//   const { loginWithRedirect } = useAuth0();
//   return (
//     <button
//       className="btn btn-primary btn-block"
//       onClick={() => loginWithRedirect()}
//     >
//       Log In
//     </button>
//   );
// };

// export default LoginButton;

import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useHistory } from 'react-router-dom';

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
    <button className="btn btn-primary btn-block" onClick={handleLogin}>
      Log In
    </button>
  );
};

export default LoginButton;
