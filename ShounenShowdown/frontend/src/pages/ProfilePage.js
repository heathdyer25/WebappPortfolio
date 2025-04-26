// HomePage.js (Page)
import React from 'react';

import Header from '../components/Header.js';
import Stats from '../components/Stats.js';

import { useAuth } from "../contexts/AuthContext.js";
import BackArrow from '../components/BackArrow.js';

const ProfilePage = () => {

  const { user } = useAuth();

  return (
    <>
      <Header />
      <BackArrow />
      <main>
      {/* Title */}
      <div className="col">
        <h1 id="username">{user.username}</h1>
        <img 
          id="profile-img" 
          className="graphic profile-img" 
          src={`/api/${user.avatar || 'uploads/avatars/default.jpg'}`}
          alt="Profile" 
        />
      </div>

      {/* Stats component */}
      <Stats user={user} />
    </main>
    </>
  );
}

export default ProfilePage;