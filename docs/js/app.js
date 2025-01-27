import { CONFIG, saveConfig as saveConfigModule } from './config.js';
import { setupEventHandlers } from './eventHandlers.js';
import { getUrlParams } from './utils.js';
import { joinGame } from './api.js';

// Make saveConfig globally available
window.saveConfig = function() {
    const apiUrl = document.getElementById('apiUrl').value;
    const port = document.getElementById('portNumber').value;
    const username = document.getElementById('username').value;

    try {
        saveConfigModule(apiUrl, port, username);
        document.getElementById('configError').textContent = '';
        document.getElementById('configError').classList.add('hidden');
    } catch (error) {
        const errorElement = document.getElementById('configError');
        errorElement.textContent = 'Failed to save configuration';
        errorElement.classList.remove('hidden');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setupEventHandlers();
    
    // Initialize form with current config values
    document.getElementById('apiUrl').value = CONFIG.apiUrl;
    document.getElementById('portNumber').value = CONFIG.port;
    document.getElementById('username').value = CONFIG.username;

    const params = getUrlParams();
    if (params.gameId && params.playerName) {
        joinGame(params.gameId, params.playerName);
    }
});