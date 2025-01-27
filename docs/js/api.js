import { CONFIG } from './config.js';

export async function createGame() {
    const response = await axios.post(`http://${CONFIG.apiUrl}:${CONFIG.port}/game/create`);
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