// Motor de Audio Web Audio API para simulación del Altavoz de micro:bit v2
export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isEnabled = true;
    this.volume = 0.5;
    this.isPlaying = false;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn('Web Audio API no soportado o bloqueado por el navegador.', e);
    }
  }

  setVolume(volPercent) {
    this.volume = Math.max(0, Math.min(1, volPercent / 100));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  toggleSound(enabled) {
    this.isEnabled = enabled;
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq = 440, durationMs = 200, type = 'square') {
    if (!this.isEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = type; // 'square' para el sonido característico de 8 bits de micro:bit
      osc.frequency.setValueAtTime(freq, now);

      // Envolvente rápida para evitar chasquidos (clipping)
      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.3, now + 0.015);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + (durationMs / 1000) - 0.01);

      osc.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + (durationMs / 1000));
    } catch (e) {
      console.warn('Error al reproducir tono:', e);
    }
  }

  // Melodías predefinidas de micro:bit
  playMelody(name = 'BA_DING') {
    if (!this.isEnabled) return;
    this.ensureContext();

    const melodies = {
      BA_DING: [
        { f: 587.33, d: 120 }, // D5
        { f: 880.00, d: 240 }  // A5
      ],
      ODE: [
        { f: 659.25, d: 250 }, // E5
        { f: 659.25, d: 250 },
        { f: 698.46, d: 250 }, // F5
        { f: 783.99, d: 250 }, // G5
        { f: 783.99, d: 250 },
        { f: 698.46, d: 250 },
        { f: 659.25, d: 250 },
        { f: 587.33, d: 250 }  // D5
      ],
      BIRTHDAY: [
        { f: 523.25, d: 200 }, // C5
        { f: 523.25, d: 100 },
        { f: 587.33, d: 300 }, // D5
        { f: 523.25, d: 300 }, // C5
        { f: 698.46, d: 300 }, // F5
        { f: 659.25, d: 600 }  // E5
      ],
      POWER_UP: [
        { f: 330, d: 80 },
        { f: 392, d: 80 },
        { f: 659, d: 80 },
        { f: 523, d: 80 },
        { f: 587, d: 80 },
        { f: 784, d: 200 }
      ],
      JUMP_UP: [
        { f: 300, d: 50 },
        { f: 450, d: 50 },
        { f: 600, d: 50 },
        { f: 750, d: 100 }
      ],
      ALARM: [
        { f: 880, d: 120 },
        { f: 587, d: 120 },
        { f: 880, d: 120 },
        { f: 587, d: 120 }
      ]
    };

    const notes = melodies[name] || melodies.BA_DING;
    let offset = 0;

    notes.forEach(note => {
      setTimeout(() => {
        this.playTone(note.f, note.d, 'square');
      }, offset);
      offset += note.d + 30;
    });
  }

  playClick() {
    this.playTone(1200, 25, 'triangle');
  }

  playSuccess() {
    this.playMelody('BA_DING');
  }

  playAlert() {
    this.playMelody('ALARM');
  }
}
