export function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        gameId: urlParams.get('gameId'),
        playerName: urlParams.get('playerName')
    };
}

export function populateFormFromUrl() {
    console.log('Populating form from URL...');
    const params = getUrlParams();
    console.log('URL params:', params);
    
    // Wait for a short delay to ensure DOM elements are ready
    setTimeout(() => {
        // Populate game ID if present
        if (params.gameId) {
            const gameIdInput = document.getElementById('gameId');
            if (gameIdInput) {
                console.log('Setting gameId:', params.gameId);
                gameIdInput.value = params.gameId;
            } else {
                console.error('gameId input element not found');
            }
        }

        // Populate player name if present 
        if (params.playerName) {
            const playerNameInput = document.getElementById('username');
            if (playerNameInput) {
                console.log('Setting playerName:', params.playerName);
                playerNameInput.value = params.playerName;
            } else {
                console.error('username input element not found');
            }
        }
    }, 100); // 100ms delay
}

// Call on DOMContentLoaded and when page is fully loaded
document.addEventListener('DOMContentLoaded', populateFormFromUrl);
window.addEventListener('load', populateFormFromUrl);