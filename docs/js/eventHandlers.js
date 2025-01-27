import { createGame, joinGame, makeMove } from './api.js';
import { showError } from './utils.js';
import { startPolling } from './gameState.js';

export function setupEventHandlers() {
    document.getElementById('createGameBtn').addEventListener('click', handleCreateGame);
    document.getElementById('joinGameBtn').addEventListener('click', handleJoinGame);
    document.getElementById('moves').addEventListener('click', handleMove);
}

async function handleCreateGame() {
    try {
        const data = await createGame();
        document.getElementById('currentGameId').textContent = data.gameId;
        startPolling();
    } catch (error) {
        showError('createGameError', 'Failed to create game');
    }
}
