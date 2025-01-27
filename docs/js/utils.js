export function getUrlParams() {
    return _.fromPairs(new URLSearchParams(window.location.search).entries());
}

export function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.classList.remove('hidden');
}