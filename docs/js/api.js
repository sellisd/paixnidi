import { CONFIG } from './config.js';

export async function createGame() {
    const response = await axios.post(`http://${CONFIG.apiUrl}:${CONFIG.port}/game/new`, {
        player1: CONFIG.username,
        player2: null  // Will be filled when player 2 joins
    });
    return response.data;
}

export async function joinGame(gameId, playerName) {
    const response = await axios.post(`http://${CONFIG.apiUrl}:${CONFIG.port}/game/${gameId}/join`, {
        playerName
    });
    return response.data;
}

export async function makeMove(gameId, move) {
    const response = await axios.post(`http://${CONFIG.apiUrl}:${CONFIG.port}/game/${gameId}/move`, {
        move,
        player: CONFIG.username
    });
    return response.data;
}