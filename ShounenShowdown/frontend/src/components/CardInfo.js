import React, { useState, useEffect } from 'react';

import Move from './Move.js';

import { useUserCard } from '../contexts/UserCardContext';

const CardInfo = ({ card }) => {
  const { getCardMoves } = useUserCard();
  const [moves, setMoves] = useState([]);

  useEffect(() => {
    getCardMoves(card).then((moves) => {
      setMoves(moves);
    });
  }, [card]);

  return (
    <>
        <h1 className="card-name">{card.name}</h1>
        <div className="card-stats">
            <div className="tag">PWR {card.power}</div>
            <h2>LVL <span className="card-lvl">{card.level}</span></h2>
            <div className="tag">HP {card.hp}</div>
        </div>
        <img className="card-img" src={`/images/cards/${card.id}.jpg`}/>
        <p className="card-desc">{card.description}</p>
        <div className="card-moves">
            {moves.map((move, index) => (
                <Move key={index} moveId={move.id} />
            ))}
        </div>
    </>
  );
};

export default CardInfo;
