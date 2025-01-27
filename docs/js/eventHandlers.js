import { createGame, joinGame, makeMove } from './api.js';
import { showError } from './utils.js';
import { startPolling } from './gameState.js';
import { CONFIG } from './config.js';

export function setupEventHandlers() {
    document.getElementById('createGameBtn').addEventListener('click', handleCreateGame);
    document.getElementById('joinGameBtn').addEventListener('click', handleJoinGame);
    document.getElementById('moves').addEventListener('click', handleMove);
}

async function handleCreateGame() {
    try {
        const data = await createGame();
        const gameId = data.gameId;
        document.getElementById('currentGameId').textContent = gameId;
        
        // Generate game join URL
        const baseUrl = 'https://sellisd.github.io/paixnidi/';
        const joinUrl = `${baseUrl}?gameId=${gameId}`;
        
        // Clear previous QR code
        document.getElementById('qrcode').innerHTML = '';
        
        // Generate new QR code
        QRCode.toCanvas(document.getElementById('qrcode'), joinUrl, function (error) {
            if (error) {
                console.error('Error generating QR code:', error);
            }
        });

        startPolling();
    } catch (error) {
        showError('createGameError', 'Failed to create game');
    }
}
