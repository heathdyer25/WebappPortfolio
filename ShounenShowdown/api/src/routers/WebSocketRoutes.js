const express = require('express');
const router = express.Router();

let waitingClients = [];
const clientPairs = new Map();

function sendPacket(ws, label, data) {
    ws.send(JSON.stringify({ label, data }));
}

// WebSocketRoutes.js
const userConnections = new Map(); // Track WebSocket -> userID

router.ws('/ws', (ws) => {
    ws.on('message', (msg) => {
        const { label, data } = JSON.parse(msg);
        
        if (label === 'auth') {
            userId = data.userId;
            ws.userId = userId;
            userConnections.set(ws, userId);

            // Pairing logic
            if (waitingClients.length > 0) {
                const partner = waitingClients.pop();
                const partnerId = userConnections.get(partner);
                const firstAttacker = determineFirstAttacker(userId, partnerId);

                sendPacket(ws, 'paired', { 
                    opponentId: partnerId, 
                    yourId: userId,
                    turnOrder: firstAttacker === userId ? 'attack' : 'defend'
                });
                
                sendPacket(partner, 'paired', {
                    opponentId: userId,
                    yourId: partnerId,
                    turnOrder: firstAttacker === partnerId ? 'attack' : 'defend'
                });
                
                // Track the pair for later communication
                clientPairs.set(ws, partner);
                clientPairs.set(partner, ws);
            } else {
                waitingClients.push(ws); // Critical missing line   
            }
        }
        else if (label === 'selectedCard' || label === 'selectedMove' || label === 'selectedOpponentCard') {
            // Find the opponent's WebSocket
            const opponentWs = clientPairs.get(ws);

            // 2. If found, send the selected card to the opponent
            if (opponentWs && opponentWs.readyState === 1) {
              sendPacket(opponentWs, label, {...data});
            }
        } else if (label === 'ping') {
            ws.send(JSON.stringify({ label: 'pong' }));
          }
          
    });

    ws.on('close', () => {
        const userId = ws.userId;
        userConnections.delete(ws);
        waitingClients = waitingClients.filter(client => client !== ws);
    
        // Get opponent and clean up pair tracking
        const opponentWs = clientPairs.get(ws);
        if (opponentWs) {
            // Remove both directions from clientPairs
            clientPairs.delete(ws);
            clientPairs.delete(opponentWs);
            waitingClients = waitingClients.filter(client => client !== opponentWs);
            
            // Send disconnect notification only if opponent connection is still open
            if (opponentWs.readyState === 1) { // 1 = OPEN
                sendPacket(opponentWs, 'disconnect', { 
                    reason: 'partner_disconnected',
                    userId: userId
                });
            }
        }
    });
    

    
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});


function determineFirstAttacker(userId1, userId2) {
    // Simple 50/50 random selection between paired users
    return Math.random() < 0.5 ? userId1 : userId2;
}


module.exports = router;
