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

document.addEventListener('DOMContentLoaded', async () => {
    // First set up configuration
    document.getElementById('apiUrl').value = CONFIG.apiUrl;
    document.getElementById('portNumber').value = CONFIG.port;
    document.getElementById('username').value = CONFIG.username;

    // Set up event handlers
    setupEventHandlers();

    // Handle URL parameters
    const params = getUrlParams();
    const gameId = params.gameId;
    
    if (gameId) {
        // Fill in the game ID input
        const gameIdInput = document.getElementById('gameId');
        if (gameIdInput) {
            gameIdInput.value = gameId;
        }

        // If we also have a player name, attempt to join
        if (params.playerName) {
            try {
                await joinGame(gameId, params.playerName);
                // Hide join section and show game section after successful join
                document.getElementById('joinGame').style.display = 'none';
                document.getElementById('gamePlay').style.display = 'block';
            } catch (error) {
                console.error('Failed to auto-join game:', error);
            }
        }
    }
});