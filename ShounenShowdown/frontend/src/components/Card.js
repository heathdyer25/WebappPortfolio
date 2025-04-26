import React, { useState } from "react";

import Modal from "./Modal";
import CardInfo from "./CardInfo";

const Card = ({ card, modifyDeck, displayInfo, inDeck, className = '', onClick , currentHp}) => {
  // For dynamic modal content
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
        <div
        key={card.id}
        id={`card-${card.id}`}
        className={`card ${card.inDeck ? 'indeck' : ''} ${className}`}
        draggable="true"
        onClick={() => {
          if (modifyDeck) modifyDeck(card);
          if (onClick) onClick(card);
        }}
      >
          <div className="card-name">{card.name}</div>
          <div className="card-img-wrapper">
            <img
              className="card-img"
              src={`/images/cards/${card.id}.jpg`}
              alt={card.name}
              draggable="false"
            />
            {currentHp !== 0 && (
              <div className="hp-overlay">HP: {currentHp}</div>
            )}
          </div>
          <div>LVL <span className="card-lvl">{card.level}</span></div>
          { displayInfo && (
            <span className="info-btn"  onClick={e => {
              e.stopPropagation(); // Prevents the parent click
              setIsModalOpen(true);
            }}>i</span>
          )}
          </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <CardInfo key={card.id} card={card} />
        </Modal>
    </>
    );
};

export default Card;
