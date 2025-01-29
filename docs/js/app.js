import { CONFIG, saveConfig as saveConfigModule } from './config.js';
import { setupEventHandlers } from './eventHandlers.js';
import { populateFormFromUrl } from './url-parser.js';
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

    // Populate form fields from URL parameters
    populateFormFromUrl();

    // Set up event handlers
    setupEventHandlers();

});