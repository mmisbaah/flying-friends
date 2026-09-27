let audioContext;
export function playSound(type = 'tap') {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.frequency.value = type === 'collect' ? 660 : type === 'complete' ? 880 : 440;
  gain.gain.setValueAtTime(0.05, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.12);
  osc.connect(gain).connect(audioContext.destination); osc.start(); osc.stop(audioContext.currentTime + 0.12);
}
export function stopAudio() { if (audioContext?.state === 'running') audioContext.suspend(); }
