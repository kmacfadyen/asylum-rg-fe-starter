// src/components/logout-button.js

import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './login-button.css';
import { useHistory } from 'react-router-dom';

const LogoutButton = () => {
  const { logout } = useAuth0();
  const history = useHistory();

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
    history.push('/'); // Redirect to the home page after logout
  };

  return (
    <button className="btn btn-danger" onClick={handleLogout}>
      Log Out
    </button>
  );
};

//   return (
//     <button
//       className="btn btn-danger btn-block"
//       onClick={() =>
//         logout({
//           returnTo: window.location.origin,
//         })
//       }
//     >
//       Log Out
//     </button>
//   );
// };

export default LogoutButton;
