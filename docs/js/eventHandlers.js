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
        const qrcodeElement = document.getElementById('qrcode');
        qrcodeElement.innerHTML = '';
        console.log('Creating QR code for URL:', joinUrl);

        if (qrcodeElement) {
            const qr = new QRCode(qrcodeElement, {
                text: joinUrl,
                width: 256,
                height: 256,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
        } else {
            console.error('QR code element not found');
        }

        startPolling();
    } catch (error) {
        showError('createGameError', 'Failed to create game');
    }
}

async function handleJoinGame() {
    try {
        const gameId = document.getElementById('gameId').value;
        const playerName = document.getElementById('player2Name').value;

        if (!gameId || !playerName) {
            showError('joinGameError', 'Please enter both game ID and player name');
            return;
        }

        await joinGame(gameId, playerName);
        document.getElementById('currentGameId').textContent = gameId;
        document.getElementById('joinGameError').textContent = '';
        
        // Hide join section and show game section
        document.getElementById('joinGame').style.display = 'none';
        document.getElementById('gamePlay').style.display = 'block';
        
        startPolling();
    } catch (error) {
        showError('joinGameError', 'Failed to join game');
    }
}

async function handleMove(event) {
    if (!event.target.matches('button[data-move]')) {
        return;
    }

    try {
        const move = event.target.dataset.move;
        const gameId = document.getElementById('currentGameId').textContent;
        
        if (!gameId) {
            showError('result', 'No active game');
            return;
        }

        await makeMove(gameId, move);
        
        // Disable move buttons after making a move
        const moveButtons = document.querySelectorAll('#moves button');
        moveButtons.forEach(button => button.disabled = true);
        
    } catch (error) {
        showError('result', 'Failed to make move');
    }
}
