const KEY = 'flying-friends-save-v1';
export function loadState() {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
}
export function saveState(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage may be unavailable */ }
}
