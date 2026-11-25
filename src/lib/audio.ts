// Web Audio API Sound System for Ms. Rachel Interactive Playroom
class AudioController {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;
  private htmlAudio: HTMLAudioElement | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      try {
        this.ctx = new AudioCtx();
      } catch {
        return;
      }
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx && this.ctx.state === "suspended") {
      void this.ctx.resume().catch(() => {});
    }
  }

  // Crisp, tactile bubble pop with pitch variance
  public playBubblePop(freq = 600 + Math.random() * 300) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain || this.isMuted) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.8, now + 0.05);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // ignore
    }
  }

  // UI button pop
  public playPop() {
    this.playBubblePop(520);
  }

  // Magic Sparkle Arpeggio
  public playSparkle() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain || this.isMuted) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + idx * 0.06;

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch {
      // ignore
    }
  }

  // Gentle breath puff for blowing out birthday candle
  public playCandleBlow() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain || this.isMuted) return;

      const bufferSize = this.ctx.sampleRate * 0.3;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1; // White noise
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.3);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start();
      noise.stop(this.ctx.currentTime + 0.3);
    } catch {
      // ignore
    }
  }

  // Playful Hand Clap Rhythm
  public playClap() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain || this.isMuted) return;

      [0, 0.12, 0.24].forEach((delay) => {
        if (!this.ctx || !this.masterGain) return;
        const now = this.ctx.currentTime + delay;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.06);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.06);
      });
    } catch {
      // ignore
    }
  }

  // Background Lullaby: "You Are My Sunshine"
  public startLullaby(recording: boolean | string = true) {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.initContext();

    if (recording && typeof window !== "undefined") {
      const audio = new Audio(typeof recording === "string" ? recording : "/audio/you-are-my-sunshine.mp3");
      audio.loop = true;
      audio.volume = 0.35;
      audio.muted = this.isMuted;
      this.htmlAudio = audio;
      void audio.play()?.catch(() => {
        this.htmlAudio = null;
        this.runSynthLullaby();
      });
      return;
    }

    this.runSynthLullaby();
  }

  private runSynthLullaby() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const C4 = 261.63;
    const D4 = 293.66;
    const E4 = 329.63;
    const F4 = 349.23;
    const G4 = 392.0;
    const A4 = 440.0;
    const C5 = 523.25;

    const melody = [
      { note: G4, duration: 0.5 },
      { note: C4, duration: 0.5 },
      { note: D4, duration: 0.5 },
      { note: E4, duration: 1.5, chord: [C4, G4] },
      { note: E4, duration: 1.0 },
      { note: E4, duration: 0.5 },
      { note: D4, duration: 0.5 },
      { note: E4, duration: 0.5 },
      { note: C4, duration: 1.5, chord: [C4, E4] },
      { note: C4, duration: 1.0 },
      { note: C4, duration: 0.5 },
      { note: D4, duration: 0.5 },
      { note: E4, duration: 0.5 },
      { note: F4, duration: 1.5, chord: [F4, A4] },
      { note: A4, duration: 1.0 },
      { note: A4, duration: 0.5 },
      { note: G4, duration: 0.5 },
      { note: F4, duration: 0.5 },
      { note: E4, duration: 2.0, chord: [C4, G4] },
      { note: C4, duration: 0.5 },
      { note: D4, duration: 0.5 },
      { note: E4, duration: 0.5 },
      { note: F4, duration: 1.5, chord: [F4, A4] },
      { note: A4, duration: 1.0 },
      { note: A4, duration: 0.5 },
      { note: G4, duration: 0.5 },
      { note: F4, duration: 0.5 },
      { note: E4, duration: 1.5, chord: [C4, E4] },
      { note: C4, duration: 1.0 },
      { note: C4, duration: 0.5 },
      { note: D4, duration: 0.5 },
      { note: E4, duration: 0.5 },
      { note: D4, duration: 1.5, chord: [G4, D4] },
      { note: E4, duration: 0.5 },
      { note: D4, duration: 0.5 },
      { note: C4, duration: 2.5, chord: [C4, E4, G4] },
    ];

    const beatSec = 60 / 84;
    let totalDuration = melody.reduce((acc, i) => acc + i.duration * beatSec, 0);

    const playLoop = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      let currentTime = this.ctx.currentTime + 0.1;

      melody.forEach((item) => {
        if (!this.ctx || !this.masterGain) return;
        const dur = item.duration * beatSec;
        this.playBellNote(item.note, currentTime, dur);
        if (item.chord) {
          item.chord.forEach((cNote) => {
            this.playBellNote(cNote / 2, currentTime, dur, 0.08);
          });
        }
        currentTime += dur;
      });

      this.timerId = window.setTimeout(playLoop, totalDuration * 1000);
    };

    playLoop();
  }

  private playBellNote(freq: number, startTime: number, _duration: number, volume = 0.2) {
    if (!this.ctx || !this.masterGain) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    const decayTime = Math.min(1.4, Math.max(0.6, _duration * 1.5));
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + decayTime);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + decayTime);
    osc2.stop(startTime + decayTime);
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      const gain = this.masterGain.gain;
      gain.cancelScheduledValues(this.ctx.currentTime);
      gain.setTargetAtTime(muted ? 0 : 0.35, this.ctx.currentTime, 0.018);
    }
    if (this.htmlAudio) {
      this.htmlAudio.muted = this.isMuted;
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public isSoundMuted() {
    return this.isMuted;
  }
}

export const audioController = new AudioController();
