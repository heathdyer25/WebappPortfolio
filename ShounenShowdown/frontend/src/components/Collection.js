import React from 'react';
import { useUserCard } from '../contexts/UserCardContext';
import Card from './Card';

const Collection = () => {
  const { collection, modifyDeck } = useUserCard();

  return (
    <div id="collection" className="collection">
      {collection.map(card => (
        <Card key={card.id} card={card} modifyDeck={modifyDeck} displayInfo={true} inDeck={card.inDeck}/>
      ))}
    </div>
  );
};

export default Collection;
