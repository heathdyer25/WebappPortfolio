// HomePage.js (Page)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate  } from 'react-router-dom';

import { useAuth } from "../contexts/AuthContext.js";
import Header from '../components/Header.js';
import UserBadge from '../components/UserBadge.js';
import UtilityIcons from '../components/UtilityIcons.js';
import Deck from '../components/Deck.js';
import '../styles/cards.css';

import { UserCardProvider } from '../contexts/UserCardContext';

const HomePage = () => {

  const { user } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const mode = event.target.mode.value;
    if (mode === 'Offline') {
      navigate('/offline-battle');
    } else {
      navigate('/online-battle');
    }
  };
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return (
    <UserCardProvider userId={user.id}>
      <Header />
      {/* <!-- Main Page Content --> */}
      <main>
        <div id="utility-strip">
          <UserBadge chosenUser={"current"}/>
          <UtilityIcons />
        </div>

        {/* battle icon */}
        <div className="row">
          <img className="graphic battle-icon" src="images/icons/battle.png" alt="battle icon" />
        </div>

        {/* battle options */}
        <form className="row gap battle-options" action="/battle" onSubmit={handleSubmit}>
          <input type="submit" className="button" value="Battle" />
          <select id="mode" className="button" name="mode">
            {isOnline && <option>Online</option>}
            <option>Offline</option>
          </select>
        </form>

        {/* Deck component */}
        <Deck/>
        <Link to="/deck" className="button">
            <img src="/images/icons/cards.png" className="icon" alt="Deck Icon" />
            <span>Deck & Collection</span>
        </Link>
      </main>
    </UserCardProvider>

  );
}

export default HomePage;