export function initUI() {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && typeof window.pauseGame === 'function') window.pauseGame();
  });
}
