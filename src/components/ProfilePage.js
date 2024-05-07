// src/components/ProfilePage.js

import React from 'react';
import LogoutButton from './logout-button';

import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';

const ProfilePage = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  //   if (isLoading) {
  //     return <div>Loading...</div>; // Optional loading indicator
  //   }

  //   if (!isAuthenticated) {
  //     return <div>Please log in to view this page.</div>; // Optional authentication check
  //   }

  const { name, picture, email } = user;

  return (
    <div>
      <div className="row align-items-center profile-header">
        <div className="col-md-2 mb-3">
          <img
            src={picture}
            alt="profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
        </div>
        <div className="col-md text-center text-md-left">
          <h2>{name}</h2>
          <p className="lead text-muted">{email}</p>
        </div>
      </div>
      <div className="row">
        <pre className="col-12 text-light bg-dark p-4">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      <div className="row justify-content-center mt-4">
        <div className="col-md-6">
          {/* <LogoutButton /> Render the LogoutButton component */}
        </div>
      </div>
    </div>
  );
};

// I had added a logout button for testing purposes in the file

export default ProfilePage;
