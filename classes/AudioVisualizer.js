export class AudioVisualizer {
  constructor(audioFilePath, fftSize = 256) {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = fftSize;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);

    this.audio = new Audio(audioFilePath);
    this.audio.crossOrigin = 'anonymous';
    const track = this.audioContext.createMediaElementSource(this.audio);
    track.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
  }

  getFrequencyData() {
    this.analyser.getByteFrequencyData(this.dataArray);
    return this.dataArray;
  }

  togglePlayPause() {
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    if (this.audio.paused) {
      this.audio.play();
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
    } else {
      this.audio.pause();
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    }
  }
}
