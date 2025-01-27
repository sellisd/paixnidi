export const CONFIG = {
    apiUrl: localStorage.getItem('apiUrl') || '192.168.1.6',
    port: localStorage.getItem('port') || '8080',
    username: localStorage.getItem('username') || 'ego'
};

export function saveConfig(apiUrl, port, username) {
    localStorage.setItem('apiUrl', apiUrl);
    localStorage.setItem('port', port);
    localStorage.setItem('username', username);
    Object.assign(CONFIG, { apiUrl, port, username });
}