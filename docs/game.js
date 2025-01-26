const CONFIG = {
    apiUrl: 'localhost',
    port: 8080
};

let currentPlayer = '';
let gameInterval;

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
}

async function createGame() {
    const playerName = document.getElementById('playerName').value.trim();
    if (!playerName) {
        showError('createGameError', 'Please enter your name');
        return;
    }

    try {
        const response = await fetch(`http://${CONFIG.apiUrl}:${CONFIG.port}/game/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                player1: playerName,
                player2: ""
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        document.getElementById('currentGameId').textContent = data.game_id; // Fix: API returns game_id not gameId
        currentPlayer = 'player1';
        startPolling();
    } catch (error) {
        showError('createGameError', 'Failed to create game. Please try again.');
        console.error('Error creating game:', error);
    }
}

// Fix join game request URL and payload
async function joinGame() {
    const gameId = document.getElementById('gameId').value.trim();
    const playerName = document.getElementById('player2Name').value.trim();
    
    if (!gameId || !playerName) {
        showError('joinGameError', 'Please enter both game ID and your name');
        return;
    }

    try {
        const response = await fetch(`http://${CONFIG.apiUrl}:${CONFIG.port}/game/${gameId}/join`, { // Fix: Add gameId to URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ playerName }) // Fix: Match JoinGameRequest model
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        document.getElementById('currentGameId').textContent = gameId;
        currentPlayer = 'player2';
        startPolling();
    } catch (error) {
        showError('joinGameError', 'Failed to join game. Please try again.');
        console.error('Error joining game:', error);
    }
}

async function makeMove(move) {
    const gameId = document.getElementById('currentGameId').textContent;
    
    try {
        const response = await fetch(`http://${CONFIG.apiUrl}:${CONFIG.port}/game/${gameId}/move`, { // Fix: Add gameId to URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ move }) // Fix: Match MoveRequest model
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error making move:', error);
    }
}

async function checkGameStatus() {
    const gameId = document.getElementById('currentGameId').textContent;
    
    try {
        const response = await fetch(`http://${CONFIG.apiUrl}:${CONFIG.port}/game/${gameId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const game = await response.json();
        updateGameUI(game);
    } catch (error) {
        console.error('Error checking game status:', error);
    }
}

function showGameSection(gameId) {
    document.getElementById('currentGameId').textContent = gameId;
}

function updateGameUI(game) {
    const statusElem = document.getElementById('gameStatus');
    const resultElem = document.getElementById('result');

    statusElem.textContent = game.status;
    
    switch(game.status) {
        case 'active':
            resultElem.textContent = 'Waiting for opponent...';
            break;
        case 'playing':
            resultElem.textContent = 'Game in progress';
            break;
        case 'completed':
            resultElem.textContent = `Winner: ${game.winner}`;
            clearInterval(gameInterval);
            break;
    }
}

function startPolling() {
    gameInterval = setInterval(checkGameStatus, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('createGameBtn').addEventListener('click', createGame);
    document.getElementById('joinGameBtn').addEventListener('click', joinGame);
    document.getElementById('moves').addEventListener('click', (e) => {
        if (e.target.matches('[data-move]')) {
            makeMove(e.target.dataset.move);
        }
    });
});