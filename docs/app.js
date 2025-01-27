import { CONFIG } from './config.js';
import { setupEventHandlers } from './eventHandlers.js';
import { getUrlParams } from './utils.js';
import { joinGame } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    setupEventHandlers();
    
    document.getElementById('apiUrl').value = CONFIG.apiUrl;
    document.getElementById('portNumber').value = CONFIG.port;

    const params = getUrlParams();
    if (params.gameId && params.playerName) {
        joinGame(params.gameId, params.playerName);
    }
});