import React, { useState, useEffect } from "react";
import { useUserCard } from '../contexts/UserCardContext';
import Card from './Card';


const Deck = () => {

  const { deck } = useUserCard();

  return (
    <div id="deck" className="deck container">
      {deck.map((card) => (
        <Card key={card.id} card={card}/>
      ))}
    </div>
  );
};

export default Deck;
