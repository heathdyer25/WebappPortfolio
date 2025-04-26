import React, { createContext, useState, useContext, useEffect } from 'react';
import DeckClient from '../clients/DeckClient';
import CardClient from '../clients/CardClient';

/**
 * React context for managing the logged in user's cards and collection
 * @author Heath Dyer (hadyer)
 * 
 */

// Create context for managing deck
const UserCardContext = createContext();

// Create provider component
export const UserCardProvider = ({ children, userId }) => {
    // State for deck and collection
    const [deck, setDeck] = useState([]);
    const [collection, setCollection] = useState([]);

    /** All cards in the app */
    const [cards, setCards] = useState([]);
    /** All moves in the app */
    const [moves, setMoves] = useState([]);

    const [deckError, setDeckError] = useState("");
    const [deckSuccess, setDeckSuccess] = useState("");

    // Load deck and collection data based on userId
    useEffect(() => {
        if (userId) {
            Promise.all([
                DeckClient.getDeckByUserId(userId),
                CardClient.getCardsByUserId(userId),
                // we also want to wait until logged in to load 
                // all moves and cards to prevent errors
                CardClient.getCards(),
                CardClient.getMoves(),
            ])
            .then(([deck, collection, cards, moves]) => {
                markDeckInCollection(deck, collection);
                setDeck(deck);
                setCollection(collection);
                // set the all cards and all moves variables
                setCards(cards);
                setMoves(moves);
            })
            .catch(error => {
                console.log("Error loading deck or collection data");
            });
        }
    }, [userId]);

      const getCardMoves = (card) => {
        return CardClient.getMoves()
          .then(moves => {
            return moves ? moves.filter(move => move.card_id == card.id) : [];
          }).catch(error => {
            console.log("Error loading card moves");
        });
      };
      
      
        
      

    /**
     * Function to give inDeck property to cards in collection
     * for visual updates 
     * @param {*} deck 
     * @param {*} collection 
     */
    const markDeckInCollection = (deck, collection) => {
        collection.forEach(card => {
            card.inDeck = deck.some(deckCard => deckCard.id === card.id);
        });
    }

    /**
     * Adds and removes cards from collection to deck
     * @param {*} card 
     */
    const modifyDeck = (card) => {
        setDeck(prevDeck => {
            const newDeck = [...prevDeck];
            const index = newDeck.findIndex(deckCard => deckCard.id === card.id);
    
            if (index !== -1) {
                newDeck.splice(index, 1);
                collection.find(mycard => card.id == mycard.id).inDeck = false;
            }
            else {
                let totalLvl = card.level;
                prevDeck.forEach(card => {
                    totalLvl += card.level
                })
                console.log(totalLvl);
                //TODO display error
                if (totalLvl > 5) {
                    setDeckSuccess("");
                    setDeckError("Cannot have a deck where sum of card levels is greater than 5.");
                }
                else {
                    newDeck.push(card);
                    collection.find(mycard => card.id == mycard.id).inDeck = true;
                    setDeckSuccess("");
                    setDeckError("");
                }
            }
            return newDeck;
        });
    };

    // Make request to API to update deck
    const updateDeck = () => {
        //TODO display error and success
        DeckClient.updateDeckByUserId(userId, deck.map(item => item.id))
        .then(response => {
            setDeckError("");
            setDeckSuccess(response.message);
          })
          .catch(error => {
            setDeckSuccess("");
            setDeckError(error.message);
          });
    }

    return (
        <UserCardContext.Provider value={{ deck, collection, modifyDeck, updateDeck, getCardMoves, deckError, deckSuccess, setDeckError, setDeckSuccess}}>
            {children}
        </UserCardContext.Provider>
    );

};

// Custom hook to use the deck context
export const useUserCard = () => {
    return useContext(UserCardContext);
};
