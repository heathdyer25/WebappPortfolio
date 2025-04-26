import React, { useState, useEffect, useRef } from 'react';

import { useAuth } from "../contexts/AuthContext.js";
import UserBadge from '../components/UserBadge.js';
import DeckClient from "../clients/DeckClient.js";
import { UserCardProvider, useUserCard } from '../contexts/UserCardContext.js';
import Card from '../components/Card.js';

import '../styles/battle.css';
import '../styles/cards.css';
import CardClient from '../clients/CardClient.js';
import UserClient from '../clients/UserClient.js';


// Local Storage Helpers
const saveToStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const loadFromStorage = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
};

const BattlePageContent = () => {
    const { user } = useAuth();
    const { getCardMoves } = useUserCard();
    const [deck, setDeck] = useState(() => loadFromStorage('deck', []));
    const [opponentDeck, setOpponentDeck] = useState(() => loadFromStorage('opponentDeck', []));
    const [battleDeck, setBattleDeck] = useState(() => loadFromStorage('battleDeck', []));
    const [opponentBattleDeck, setOpponentBattleDeck] = useState(() => loadFromStorage('opponentBattleDeck', []));
    const [gameStage, setGameStage] = useState(() => loadFromStorage('gameStage', null));
    const [action, setAction] = useState(() => loadFromStorage('action', null));

    const [selectedCard, setSelectedCard] = useState(() => loadFromStorage('selectedCard', null));
    const [selectedOpponentCard, setSelectedOpponentCard] = useState(() => loadFromStorage('selectedOpponentCard', null));
    const [selectedMove, setSelectedMove] = useState(() => loadFromStorage('selectedMove', null));
    const [selectedOpponentMove, setSelectedOpponentMove] = useState(() => loadFromStorage('selectedOpponentMove', null));
    const [moves, setMoves] = useState(() => loadFromStorage('moves', []));
    const [damage, setDamage] = useState(() => loadFromStorage('damage', null));
    
    const [hasResolvedAttack, setHasResolvedAttack] = useState(() => loadFromStorage('hasResolvedAttack', null));
    const [hasResolvedDefense, setHasResolvedDefense] = useState(() => loadFromStorage('hasResolvedDefense', null));
    const [waitForTimeout, setWaitForTimeout] = useState(() => loadFromStorage('waitForTimeout', null));


    
    useEffect(() => {
        saveToStorage('hasResolvedAttack', hasResolvedAttack);
    }, [hasResolvedAttack]);

    useEffect(() => {
        saveToStorage('hasResolvedDefense', hasResolvedDefense);
    }, [hasResolvedDefense]);

    useEffect(() => {
        saveToStorage('waitForTimeout', waitForTimeout);
    }, [waitForTimeout]);

    // Update Local Storage values
    useEffect(() => {
        saveToStorage('deck', deck);
    }, [deck]);

    useEffect(() => {
        saveToStorage('opponentDeck', opponentDeck);
    }, [opponentDeck]);

    useEffect(() => {
        saveToStorage('battleDeck', battleDeck);
    }, [battleDeck]);

    useEffect(() => {
        saveToStorage('opponentBattleDeck', opponentBattleDeck);
    }, [opponentBattleDeck]);

    useEffect(() => {
        saveToStorage('gameStage', gameStage);
    }, [gameStage]);

    useEffect(() => {
        saveToStorage('action', action);
    }, [action]);

    useEffect(() => {
        saveToStorage('selectedCard', selectedCard);
    }, [selectedCard]);

    useEffect(() => {
        saveToStorage('selectedOpponentCard', selectedOpponentCard);
    }, [selectedOpponentCard]);

    useEffect(() => {
        saveToStorage('selectedMove', selectedMove);
    }, [selectedMove]);

    useEffect(() => {
        saveToStorage('selectedOpponentMove', selectedOpponentMove);
    }, [selectedOpponentMove]);

    useEffect(() => {
        saveToStorage('moves', moves);
    }, [moves]);

    useEffect(() => {
        saveToStorage('damage', damage);
    }, [damage]);

    // Load decks and initialize battle decks with currentHp and a flag to track if they've acted
    useEffect(() => {
        if (gameStage === 'over') {
            return;
        }
        // Unnecessary if all decks have been defined
        if (deck.length !== 0 && opponentDeck.length !== 0 && battleDeck.length !== 0 && opponentBattleDeck.length !== 0 ) {
            return;
        }

        // If not in storage, fetch and generate decks as before
        DeckClient.getDeckByUserId(user.id)
            .then(deck => {
                setDeck(deck);
                const playerBattleDeck = deck.map(card => ({
                    card,
                    currentHp: card.hp,
                    hasActed: false
                }));
                setBattleDeck(playerBattleDeck);
            })
            .catch(error => {
                console.log("error loading data");
            });
    
        CardClient.getCards()
            .then(cards => {
                const levelGroups = {};
                for (let i = 1; i <= 5; i++) {
                    levelGroups[i] = cards.filter(card => card.level === i);
                }
    
                const levelCombos = [
                    [5],
                    [4, 1],
                    [3, 2],
                    [2, 2, 1],
                    [1, 1, 1, 1, 1],
                    [3, 1, 1],
                    [2, 1, 1, 1]
                ];
    
                const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
    
                let selectedCombo = getRandomElement(levelCombos);
    
                let usedCardIds = new Set();
                let selectedCards = [];
                let attempts = 0;
    
                while (attempts < 10) {
                    selectedCards = [];
                    usedCardIds.clear();
    
                    // Select cards for the opponent's deck based on the chosen level combination
                    for (const lvl of selectedCombo) {
                        const available = levelGroups[lvl];
    
                        // Filter out already selected cards
                        const availableUnique = available.filter(card => !usedCardIds.has(card.id));
    
                        if (availableUnique.length === 0) {
                            console.error(`No unique cards available for level ${lvl}`);
                            return;  // Exit if there are no unique cards available
                        }
    
                        const chosen = availableUnique[Math.floor(Math.random() * availableUnique.length)];
                        usedCardIds.add(chosen.id);
                        selectedCards.push(chosen);
                    }
    
                    // Check for duplicates in selectedCards (sanity check)
                    const cardIds = selectedCards.map(card => card.id);
                    const uniqueCardIds = new Set(cardIds);
    
                    if (cardIds.length === uniqueCardIds.size) {
                        // Valid deck generated without duplicates, break out of loop
                        break;
                    }
    
                    // If duplicates are found, increment attempts and try again
                    attempts++;
                    console.log("Duplicate cards detected, regenerating deck...");
                }
    
                // If after the max attempts, we couldn't generate a valid deck, log an error
                if (attempts >= 10) {
                    console.error("Unable to generate a valid opponent deck after multiple attempts.");
                    return;
                }
    
                setOpponentDeck(selectedCards);
    
                const opponentBattleDeck = selectedCards.map(card => ({
                    card,
                    currentHp: card.hp,
                    hasActed: false
                }));
    
                setOpponentBattleDeck(opponentBattleDeck);
            })
            .catch(error => {
                console.log("error generating opponent deck:", error);
            });
    }, [user.id]); 

    const compareDeckQuality = (deckA, deckB) => {
        // Sort decks low to high levels
        const sortedA = deckA.map(c => c.level).sort((a, b) => a - b);
        const sortedB = deckB.map(c => c.level).sort((a, b) => a - b);
    
        // Compare lexicographically
        for (let i = 0; i < Math.max(sortedA.length, sortedB.length); i++) {
            const valA = sortedA[i] ?? Infinity;
            const valB = sortedB[i] ?? Infinity;
    
            if (valA < valB) return -1; // A is worse
            if (valA > valB) return 1;  // B is worse
        }
    
        return 0; // Equal quality
    };
    
    // Determine who goes first
    useEffect(() => {
        if (gameStage === 'over') {
            return;
        }
        // Unnecessary if it's already been determined
        if (action && gameStage) return;

        if (deck.length === 0 || opponentDeck.length === 0) return;
    
        const result = compareDeckQuality(opponentDeck, deck);
    
        if (result === -1) {
            // Opponent has worse deck
            setAction('defend');
            setGameStage('defend');
        } else {
            // Player has worse or equal deck
            setAction('attack');
            setGameStage('attack');
        }
    }, [deck, opponentDeck]);
    

    const handleCardSelection = (card) => {
        if (gameStage === 'attack') {
            setSelectedCard(card);
            setGameStage('selectMove'); // Move to move selection after card selection
        }
    };

    useEffect(() => {
        if (gameStage === 'over') {
            return;
        }

        // Unnecessary if it's already been determined
        if (moves.length !== 0) return;
        
        if (selectedCard) {
            setMoves(getCardMoves(selectedCard));
            getCardMoves(selectedCard).then(movesData => {
                setMoves(movesData);
            })
            .catch(error => {
                console.error('Error fetching moves:', error); // Log error if the fetch fails
                setMoves([]); // Reset moves to an empty array in case of error
            });
        } else {
            setMoves([]);
        }
    }, [selectedCard]);

    const handleMove = (move) => {
        if (gameStage === 'selectMove' ) {
            setSelectedMove(move);
            if (action === 'attack')
            setGameStage('selectOpponentCard'); // Move to opponent card selection
            else 
            setGameStage('resultDefense');
        }
    };

    const handleOpponentCardSelection = (card) => {
        if (gameStage === 'selectOpponentCard') {
            setSelectedOpponentCard(card);
            // replace with a wait from other socket
            getCardMoves(card).then(movesData => {
                const defMoves = movesData.filter(move => move.type === 'DEF');
                const randomIndex = Math.floor(Math.random() * defMoves.length);
                setSelectedOpponentMove(defMoves[randomIndex]);
            });
            setGameStage('resultAttack'); // Once opponent card is selected, show the result
        }
    };

    const effectiveDamage = (pow, atkClass, defClass) => {
        const typeChart = {
            Mystic: { strongAgainst: "Energy", weakAgainst: "Brawler" },
            Energy: { strongAgainst: "Mobility", weakAgainst: "Mystic" },
            Mobility: { strongAgainst: "Brawler", weakAgainst: "Energy" },
            Brawler: { strongAgainst: "Mystic", weakAgainst: "Mobility" }
        };
    
        let multiplier = 1;
        
        let effectiveness = 'neutral';
        if (typeChart[atkClass]?.strongAgainst === defClass) {
            multiplier = 1.25;
            effectiveness = 'effective';
        } else if (typeChart[atkClass]?.weakAgainst === defClass) {
            multiplier = 0.75;
            effectiveness = 'ineffective';
        }
    
        const damage = Math.floor(pow * multiplier);
        setDamage({
            effectiveness: effectiveness,
            amount: damage,
        })

        return damage;
    };  

    useEffect(() => {
        if (gameStage === 'over') {
            return;
        }

        if (selectedOpponentCard && selectedOpponentMove && selectedCard) return;

        if (gameStage === 'defend' && battleDeck.length !== 0 && opponentBattleDeck.length !== 0) {
            const opponentCardsToAttack = opponentBattleDeck.filter(item => !item.hasActed && !item.currentHp == 0);

            // If there are any opponent cards left that haven't acted, select the first one
            if (opponentCardsToAttack.length > 0) {
                const opponentCard = opponentCardsToAttack[0].card;
                setSelectedOpponentCard(opponentCard); // Select the first available card
    
                getCardMoves(opponentCard).then(movesData => {
                    const atkMoves = movesData.filter(move => move.type === 'ATK');
                    const randomIndex = Math.floor(Math.random() * atkMoves.length);
                    setSelectedOpponentMove(atkMoves[randomIndex]);
                });

                // Filter for alive player cards (HP > 0)
                const alivePlayerCards = battleDeck.filter(item => item.currentHp > 0);

                if (alivePlayerCards.length > 0) {
                    const randomIndex = Math.floor(Math.random() * alivePlayerCards.length);
                    setSelectedCard(alivePlayerCards[randomIndex].card);
                }

                setGameStage('selectMove');
            }
        }
    }, [gameStage, opponentBattleDeck, battleDeck]);

    useEffect(()=> {
        
        if (gameStage === 'over') {
            return;
        }

        const playerDeckLoaded = battleDeck.length > 0;
        const opponentDeckLoaded = opponentBattleDeck.length > 0;

        if (playerDeckLoaded) {
            const allCardsDead = battleDeck.every(item => item.currentHp === 0);
            if (allCardsDead) {
                setGameStage('over');
                setAction('lose');
                localStorage.clear();
                return; // prevent win from being set too
            }
        }

        if (opponentDeckLoaded) {
            const allOpponentCardsDead = opponentBattleDeck.every(item => item.currentHp === 0);
            if (allOpponentCardsDead) {
                setGameStage('over');
                setAction('win');
                localStorage.clear();
            }
        }
    }, [battleDeck, opponentBattleDeck]);

    const timeoutRef = useRef(null);
    const hasNotRefreshRef = useRef(false);

    useEffect(() => {if (
        gameStage === 'resultAttack' &&
        selectedCard &&
        selectedOpponentCard &&
        selectedMove &&
        selectedOpponentMove
    ) {
        const cleanup = () => {
            setWaitForTimeout(false);
            setHasResolvedAttack(false); 

            setSelectedCard(null);
            setSelectedOpponentCard(null);
            setSelectedMove(null);
            setMoves([]);
            setSelectedOpponentMove(null);
            setDamage(null);

            setBattleDeck(prev => {
                const allActedOrDead = prev.every(item => item.hasActed || item.currentHp === 0);
                if (allActedOrDead) {
                    setAction('defend');
                    setGameStage('defend');

                    setBattleDeck(prev =>
                        prev.map(item => ({ ...item, hasActed: false }))
                    );
                    setOpponentBattleDeck(prev =>
                        prev.map(item => ({ ...item, hasActed: false }))
                    );
                } else {
                    setGameStage('attack');
                }
                return prev;
            });
        };

        if (hasResolvedAttack) {
            // cleanup(); // instant skip
            if(waitForTimeout && !hasNotRefreshRef.current) {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;
                }
                cleanup(); // instant skip
            }
        } else {
            setOpponentBattleDeck(prev =>
                prev.map(item =>
                    item.card.id === selectedOpponentCard.id
                        ? {
                            ...item,
                            currentHp: Math.max(
                                0,
                                item.currentHp -
                                    effectiveDamage(
                                        selectedCard.power,
                                        selectedMove.class,
                                        selectedOpponentMove.class
                                    )
                            ),
                        }
                        : item
                )
            );
    
            setBattleDeck(prev =>
                prev.map(item =>
                    item.card.id === selectedCard.id
                        ? { ...item, hasActed: true }
                        : item
                )
            );

            setHasResolvedAttack(true);

            setWaitForTimeout(true);

            hasNotRefreshRef.current = true;
            
            // Store the timeout ID so we can clear it
            timeoutRef.current = setTimeout(() => {
                cleanup();
                timeoutRef.current = null; // clear ref after running
            }, 5000);
        }
    } else if (
            gameStage === 'resultDefense' &&
            selectedCard &&
            selectedOpponentCard &&
            selectedMove &&
            selectedOpponentMove
        ) {
            const cleanup = () => {
                setWaitForTimeout(false);
                setHasResolvedDefense(false); 
    
                setSelectedCard(null);
                setSelectedOpponentCard(null);
                setSelectedMove(null);
                setMoves([]);
                setSelectedOpponentMove(null);
                setDamage(null);
    
                setOpponentBattleDeck(prev => {
                    const allActedOrDead = prev.every(item => item.hasActed || item.currentHp === 0);
                    if (allActedOrDead) {
                        setAction('attack');
                        setGameStage('attack');
    
                        setBattleDeck(prev =>
                            prev.map(item => ({ ...item, hasActed: false }))
                        );
                        setOpponentBattleDeck(prev =>
                            prev.map(item => ({ ...item, hasActed: false }))
                        );
                    } else {
                        setGameStage('defend');
                    }
                    return prev;
                });
            };
    
            if (hasResolvedDefense) {
                // cleanup(); // instant skip
                if (waitForTimeout && !hasNotRefreshRef.current){
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                        timeoutRef.current = null;
                    }
                    cleanup(); // instant skip
                }
            } else {
                setBattleDeck(prev =>
                    prev.map(item =>
                        item.card.id === selectedCard.id
                            ? {
                                ...item,
                                currentHp: Math.max(
                                    0,
                                    item.currentHp -
                                        effectiveDamage(
                                            selectedOpponentCard.power,
                                            selectedOpponentMove.class,
                                            selectedMove.class
                                        )
                                ),
                            }
                            : item
                    )
                );
        
                setOpponentBattleDeck(prev =>
                    prev.map(item =>
                        item.card.id === selectedOpponentCard.id
                            ? { ...item, hasActed: true }
                            : item
                    )
                );

                setHasResolvedDefense(true);

                setWaitForTimeout(true);

                hasNotRefreshRef.current = true;

                timeoutRef.current = setTimeout(() => {
                    cleanup();
                    timeoutRef.current = null; // clear ref after running
                }, 5000);
            }
        }
    }, [
        gameStage,
        selectedCard,
        selectedOpponentCard,
        selectedMove,
        selectedOpponentMove,
        hasResolvedAttack,
        hasResolvedDefense
    ]);
    
    function exit() {
        let rewards = {
            xp: 0,
            coins: 0,
        }

        if (action === 'win') {
            rewards.xp = 20;
            rewards.coins = 10;
        } else {
            rewards.xp = 10;
            rewards.coins = 5;
        }


        UserClient.updateBattleResults(user.id, action, rewards);
        window.location.href = "./";
        localStorage.clear();

    }
    

    return (
        <>
                <section className="search-status" found={"true"}>
                    <div className="search-container">
                        <p className="search-text">Searching for opponent</p>
                    </div>
                </section>
                <div className="game-status">
                    <div className="turn-container">
                        {action === 'win' && <p>You won!</p>}
                        {action === 'lose' && <p>You lost...</p>}
                        {(action === 'win' || action === 'lose') && <button className='button' onClick={() => exit()}>Exit</button>}
                    </div>
                    <div className='prompt'>
                        {gameStage === 'attack' && <><p>Prepare to attack!</p><p>Select a card</p></>}
                        {gameStage === 'defend' && <p>Opponent is attacking! Prepare to defend.</p>}
                        {gameStage === 'selectMove' && (
                            <p>
                                {action === 'attack' ? 'Select a move for your card' : 'Select a move to defend'}
                            </p>
                        )}
                        {gameStage === 'selectOpponentCard' && <p>Select an opponent card to attack</p>}
                        {gameStage === 'resultAttack' && (<>
                        <p>
                            {selectedCard?.name} vs {selectedOpponentCard?.name}
                        </p>
                        <p>
                            {selectedMove?.name || `${selectedMove?.class} Attack`} against{' '} 
                            {selectedOpponentMove?.name || `${selectedOpponentMove?.class} Defense`}{' '}
                        </p>
                        {damage && <p>({damage.effectiveness} -{damage.amount})</p>}
                        </>
                        )}
                        {gameStage === 'resultDefense' && (<>
                        <p>
                            {selectedCard?.name} vs {selectedOpponentCard?.name}
                        </p>
                        <p>
                            {selectedMove?.name || `${selectedMove?.class} Defense`} against{' '} 
                            {selectedOpponentMove?.name || `${selectedOpponentMove?.class} Attack`}{' '}
                        </p>
                        {damage && <p>({damage.effectiveness} -{damage.amount})</p>}
                        </>
                        )}
                    </div>
                </div>

                <main className="battlefield">
                    {/* Opponent section */}
                    <div className="opponent-section">
                        <div className="opponent-name">
                            <UserBadge chosenUser={"bot"} />
                        </div>
                        
                        <div id="opponent-deck" className="deck container">
                            {opponentBattleDeck.map((item) => (
                                <Card key={item.card.id} card={item.card} className={`${item.hasActed ? 'acted' : ''} ${item.currentHp == 0 ? 'dead' : ''} ${item.card.id === selectedOpponentCard?.id ? 'selected' : ''}` } onClick={(card) => {
                                    if (item.currentHp != 0) handleOpponentCardSelection(card);
                                }} currentHp={item.currentHp}/> 
                            ))}
                        </div>
                    </div>

                    {/* Player section */}
                    <div className="player-section">
                    {selectedCard && gameStage === "selectMove" && (
                        <div className="move-options">
                            <div className="options">
                                {moves.length > 0 && moves.map((move, index) => (
                                    ((action === "attack" && move.type === "ATK") || (action === "defend" && move.type === "DEF")) ? (
                                    <div className='option'>
                                        <button key={index} className='button' onClick={() => handleMove(move)}>
                                            {action === 'attack' ? (move?.name || `${move?.class} Attack`) : null}
                                            {action === 'defend' ? (move?.name || `${move?.class} Defense`) : null}
                                        </button>
                                        <img className="icon" src={`/images/icons/${move?.class}.png`}/>
                                    </div>
                                    ) : null
                                ))}
                            </div>
                        </div>
                    )}
                        <div id="deck" className="deck container">
                            {battleDeck.map((item) => (
                                <Card key={item.card.id} card={item.card} className={`${item.hasActed ? 'acted' : ''} ${item.currentHp == 0 ? 'dead' : ''} ${item.card.id === selectedCard?.id ? 'selected' : ''}` } onClick={(card) => {
                                    if (!item.hasActed && item.currentHp != 0) handleCardSelection(card);
                                }} currentHp={item.currentHp}/>
                            ))}
                        </div>
                        <div className="player-name">
                            <UserBadge chosenUser="current" />
                        </div>
                    </div>
                </main>
        </>
    );
};

const OfflineBattlePage = () => {
  return (
        <UserCardProvider>
            <BattlePageContent />
        </UserCardProvider>
  );
}

export default OfflineBattlePage;
