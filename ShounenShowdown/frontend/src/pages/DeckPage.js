// HomePage.js (Page)
import React, { useState, useEffect } from 'react';

import Header from '../components/Header';
import Deck from "../components/Deck";
import Collection from "../components/Collection";

import ClassInfo from "../components/ClassInfo";
import Modal from "../components/Modal";

import { useAuth } from "../contexts/AuthContext";
import { UserCardProvider, useUserCard } from '../contexts/UserCardContext';

import '../styles/cards.css';
import BackArrow from '../components/BackArrow';

const DeckPageContent = () => {

  // For dynamic modal content
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { updateDeck, deckSuccess, deckError } = useUserCard();

  return (
    <>
      <Header />
      <BackArrow />
      <main>
        <div className="col gap">
              {
                deckError && (
                <div className = "error">
                    {deckError}
                </div>
                )
              }
              {
                deckSuccess && (
                <div className = "success">
                    {deckSuccess}
                </div>
                )
              }
            <Deck />
            
            <div className="row gap">
                <div id="info-btn" className="button" onClick={() => setIsModalOpen(true)}>Info</div>
                <div id="update-deck" className="button" onClick={() => updateDeck()}>Update Deck</div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <ClassInfo />
            </Modal>

            <Collection />
        </div>
      </main>
    </>
  );
}

const DeckPage = () => {
  const { user } = useAuth();

  return (
    <UserCardProvider userId={user.id}>
      <DeckPageContent />
    </UserCardProvider>
  );
}

export default DeckPage;