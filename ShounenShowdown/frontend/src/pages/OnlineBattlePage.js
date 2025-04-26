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

const BattlePageContent = () => {
    const { user } = useAuth();
    const [found, setFound] = useState("false");
    const [socket, setSocket] = useState(null);
    const [ opponent, setOpponent] = useState(null);
    const { getCardMoves } = useUserCard();
    const [deck, setDeck] = useState([]);
    const [opponentDeck, setOpponentDeck] = useState([]);
    const [battleDeck, setBattleDeck] = useState([]);
    const [opponentBattleDeck, setOpponentBattleDeck] = useState([]);
    const [gameStage, setGameStage] = useState(null);
    const [action, setAction] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [selectedOpponentCard, setSelectedOpponentCard] = useState(null);
    const [selectedMove, setSelectedMove] = useState(null);
    const [selectedOpponentMove, setSelectedOpponentMove] = useState(null);
    const [moves, setMoves] = useState([]);
    const [damage, setDamage] = useState(null);
    const [hasResolvedAttack, setHasResolvedAttack] = useState(null);
    const [hasResolvedDefense, setHasResolvedDefense] = useState(null);

    useEffect(() => {
        const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const ws = new WebSocket(`${scheme}://${window.location.host}/api/ws`);

        let pingInterval;
        ws.addEventListener('open', () => {
            console.log("Established connection.");
            console.log(`${scheme}://${window.location.host}/api/ws`);
            ws.send(JSON.stringify({ label: 'auth', data: { userId: user.id } })); 
            pingInterval = setInterval(() => {
                if (ws.readyState === 1) {
                    ws.send(JSON.stringify({ label: 'ping' }));
                }
            }, 30000);
        });

        
        ws.addEventListener('message', (event) => {
            const packet = JSON.parse(event.data);
            console.log(packet);
            if (packet.label === 'paired') {
                if (!packet.data.opponentId) {
                  console.error('Received invalid pairing');
                  return;
                }
                console.log(`Paired with ${packet.data.opponentId}`);
                setOpponent(packet.data.opponentId);
                setFound("true");
                setAction(packet.data.turnOrder);
                setGameStage(packet.data.turnOrder);
            }
            if (packet.label === 'selectedCard') {
                setSelectedOpponentCard(packet.data.selectedCard);
            }
            if (packet.label === 'selectedMove') {
                console.log("Loud and clear")
                setSelectedOpponentMove(packet.data.selectedMove);
                setGameStage(currentStage => {
                    if (currentStage === 'opponentSelectMove') {
                      console.log("Transitioning to resultAttack");
                      return 'resultAttack';
                    }
                    return currentStage;
                  });
            }
            if (packet.label === 'selectedOpponentCard') {
                setSelectedCard(packet.data.selectedOpponentCard);
                setGameStage('selectMove');
            }
            if (packet.label === 'disconnect') {
                setGameStage('over');
                setAction('disconnect');
            }
        });

        ws.addEventListener('close', (event) => {
            clearInterval(pingInterval);
        });

        setSocket(ws); // Store it if you want to send messages later

        return () => {
        ws.close();
        clearInterval(pingInterval);
        };
    }, [user?.id]);        

    // Load decks and initialize battle decks with currentHp and a flag to track if they've acted
    useEffect(() => {
        if (gameStage === 'over') {
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
        
            if (opponent) {
                UserClient.getUserByUserId(opponent).then(opp => {
                    DeckClient.getDeckByUserId(opp.id)
                        .then(deck => {
                            setOpponentDeck(deck);
                            const opponentBattleDeck = deck.map(card => ({
                                card,
                                currentHp: card.hp,
                                hasActed: false
                            }));
                            setOpponentBattleDeck(opponentBattleDeck);
                        })
                        .catch(error => {
                            console.log("error loading data");
                        });
                })
            }
    }, [user.id, opponent]); 

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

        if (deck.length === 0 || opponentDeck.length === 0) return;
    
        const result = compareDeckQuality(opponentDeck, deck);
    
        if (result === -1) {
            // Opponent has worse deck
            setAction('defend');
            setGameStage('defend');
        } else if (result === 1) {
            // Player has worse or equal deck
            setAction('attack');
            setGameStage('attack');
        }
    }, [deck, opponentDeck]);
    

    const handleCardSelection = (card) => {
        if (gameStage === 'attack') {
            setSelectedCard(card);
            setGameStage('selectMove');
            if (socket && socket.readyState === 1) {
                socket.send(JSON.stringify({
                label: 'selectedCard',
                data: { selectedCard: card }
                }));
            }
        }
    };

    useEffect(() => {
        if (gameStage === 'over') {
            return;
        }
        
        if (selectedCard) {
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
            if (socket && socket.readyState === 1) {
                socket.send(JSON.stringify({
                label: 'selectedMove',
                data: { selectedMove: move }
                }));
            }
            if (action === 'attack')
            setGameStage('selectOpponentCard'); // Move to opponent card selection
            else 
            setGameStage('resultDefense');
        }
    };

    const handleOpponentCardSelection = (card) => {
        if (gameStage === 'selectOpponentCard') {
            setSelectedOpponentCard(card);
            if (socket && socket.readyState === 1) {
                socket.send(JSON.stringify({
                label: 'selectedOpponentCard',
                data: { selectedOpponentCard: card }
                }));
            }
            setGameStage("opponentSelectMove");
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
                return; // prevent win from being set too
            }
        }

        if (opponentDeckLoaded) {
            const allOpponentCardsDead = opponentBattleDeck.every(item => item.currentHp === 0);
            if (allOpponentCardsDead) {
                setGameStage('over');
                setAction('win');
            }
        }
    }, [battleDeck, opponentBattleDeck]);

    useEffect(() => {if (
        gameStage === 'resultAttack' &&
        selectedCard &&
        selectedOpponentCard &&
        selectedMove &&
        selectedOpponentMove && !hasResolvedAttack
    ) {
        const cleanup = () => {
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
        
        setTimeout(() => {
            cleanup();
        }, 5000);
    } else if (
            gameStage === 'resultDefense' &&
            selectedCard &&
            selectedOpponentCard &&
            selectedMove &&
            selectedOpponentMove && !hasResolvedDefense
        ) {
            const cleanup = () => {
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
            setTimeout(() => {
                cleanup();
            }, 5000);
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
        if (action === 'lose') {
            rewards.xp = 10;
            rewards.coins = 5;
        } else {
            rewards.xp = 20;
            rewards.coins = 10;
        }
        UserClient.updateBattleResults(user.id, action, rewards);
        window.location.href = "./";
    }
    

    return (
        <>
                <section className="search-status" found={found}>
                    <div className="search-container">
                        <p className="search-text">Searching for opponent</p>
                        <button className='button' onClick={()=> {window.location.href = "./";
                        }}>Cancel</button>
                    </div>
                </section>

                <div className="game-status">
                    <div className="turn-container">
                        {action === 'win' && <p>You won!</p>}
                        {action === 'lose' && <p>You lost...</p>}
                        {action === 'disconnect' && <p>Opponent disconnected.<br></br>You win by default!</p>}
                        {(action === 'win' || action === 'lose' || action === 'disconnect') && <button className='button' onClick={() => exit()}>Exit</button>}
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
                        {gameStage === 'opponentSelectMove' && <p>Opponent is selecting a move</p>}
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
                            {opponent && <UserBadge chosenUser={opponent} />}
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
                                {moves.map((move, index) => (
                                    ((action === "attack" && move.type === "ATK") || (action === "defend" && move.type === "DEF")) ? (
                                        <button key={index} className='button' onClick={() => handleMove(move)}>
                                            {action === 'attack' ? (move?.name || `${move?.class} Attack`) : null}
                                            {action === 'defend' ? (move?.name || `${move?.class} Defense`) : null}
                                        </button>
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

const OnlineBattlePage = () => {
  return (
        <UserCardProvider>
            <BattlePageContent />
        </UserCardProvider>
  );
}

export default OnlineBattlePage;
