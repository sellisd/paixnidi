import { CONFIG } from './config.js';

let gameInterval = null;

export function startPolling() {
    stopPolling();
    gameInterval = setInterval(checkGameStatus, 1000);
}

export function stopPolling() {
    if (gameInterval) {
        clearInterval(gameInterval);
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
