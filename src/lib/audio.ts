// Warm Web Audio Engine: "You Are My Sunshine" (fixed G3->C4 melody) + tactile storybook SFX
class AudioController {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private isMuted = false;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
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

      // Warm low-pass filter so synthesized tones sound like a soft wooden music box / celesta
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.setValueAtTime(2200, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(0.7, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.34, this.ctx.currentTime);

      this.filterNode.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx && this.ctx.state === "suspended") {
      void this.ctx.resume().catch(() => {});
    }
  }

  public playBubblePop(freq = 540 + Math.random() * 260) {
    try {
      this.initContext();
      if (!this.ctx || !this.filterNode || this.isMuted) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.9, now + 0.055);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.06);

      osc.connect(gain);
      gain.connect(this.filterNode);

      osc.start(now);
      osc.stop(now + 0.065);
    } catch {
      // Ignore audio errors when context is restricted
    }
  }

  public playPop() {
    this.playBubblePop(510);
  }

  public playPageTurn() {
    try {
      this.initContext();
      if (!this.ctx || !this.filterNode || this.isMuted) return;

      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.09);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.setValueAtTime(1200, now);
      bandpass.frequency.exponentialRampToValueAtTime(700, now + 0.09);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      noise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this.filterNode);

      noise.start(now);
      noise.stop(now + 0.09);
    } catch {
      // Ignore
    }
  }

  public playSparkle() {
    try {
      this.initContext();
      if (!this.ctx || !this.filterNode || this.isMuted) return;

      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.filterNode) return;
        const start = this.ctx.currentTime + idx * 0.055;
        this.playCelestaNote(freq, start, 0.42, 0.16);
      });
    } catch {
      // Ignore
    }
  }

  public playPottyCheer() {
    try {
      this.initContext();
      if (!this.ctx || !this.filterNode || this.isMuted) return;

      // Playful ascending marimba-like riff + two joyful claps
      const riff = [392.0, 440.0, 523.25, 659.25];
      riff.forEach((freq, idx) => {
        if (!this.ctx) return;
        this.playCelestaNote(freq, this.ctx.currentTime + idx * 0.08, 0.35, 0.2);
      });
    } catch {
      // Ignore
    }
  }

  public playCandleBlow() {
    try {
      this.initContext();
      if (!this.ctx || !this.filterNode || this.isMuted) return;

      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.34);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const lp = this.ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(900, now);
      lp.frequency.exponentialRampToValueAtTime(180, now + 0.34);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);

      noise.connect(lp);
      lp.connect(gain);
      gain.connect(this.filterNode);

      noise.start(now);
      noise.stop(now + 0.34);
    } catch {
      // Ignore
    }
  }

  public startLullaby(recording: boolean | string = true) {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.initContext();

    if (recording && typeof window !== "undefined") {
      const src = typeof recording === "string" ? recording : "/audio/you-are-my-sunshine.mp3";
      if (src) {
        const audio = new Audio(src);
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
    }

    this.runSynthLullaby();
  }

  private runSynthLullaby() {
    this.initContext();
    if (!this.ctx || !this.filterNode) return;

    // Accurate "You Are My Sunshine" in C major (starts on G3 stepping UP to C4, D4, E4)
    const G3 = 196.0;
    const A3 = 220.0;
    const B3 = 246.94;
    const C4 = 261.63;
    const D4 = 293.66;
    const E4 = 329.63;
    const F4 = 349.23;
    const G4 = 392.0;
    const A4 = 440.0;

    // Shift melody up one octave (G4 -> C5) for authentic twinkling music-box register
    const up = (hz: number) => hz * 2;

    const melody: Array<{ note: number; beats: number; chord?: number[] }> = [
      // "You are my"
      { note: up(G3), beats: 0.5 },
      { note: up(C4), beats: 0.5 },
      { note: up(D4), beats: 0.5 },
      // "sun-shine,"
      { note: up(E4), beats: 1.5, chord: [C4, E4, G4] },
      { note: up(E4), beats: 1.0 },
      // "my on-ly"
      { note: up(E4), beats: 0.5 },
      { note: up(D4), beats: 0.5 },
      { note: up(E4), beats: 0.5 },
      // "sun-shine,"
      { note: up(C4), beats: 1.5, chord: [C4, E4, G4] },
      { note: up(C4), beats: 1.0 },
      // "You make me"
      { note: up(C4), beats: 0.5 },
      { note: up(D4), beats: 0.5 },
      { note: up(E4), beats: 0.5 },
      // "hap-py"
      { note: up(F4), beats: 1.5, chord: [A3, C4, F4] },
      { note: up(A4), beats: 1.0 },
      // "when skies are"
      { note: up(A4), beats: 0.5 },
      { note: up(G4), beats: 0.5 },
      { note: up(F4), beats: 0.5 },
      // "grey."
      { note: up(E4), beats: 2.5, chord: [C4, E4, G4] },
      // "You'll ne-ver"
      { note: up(C4), beats: 0.5 },
      { note: up(D4), beats: 0.5 },
      { note: up(E4), beats: 0.5 },
      // "know, dear,"
      { note: up(F4), beats: 1.5, chord: [A3, C4, F4] },
      { note: up(A4), beats: 1.0 },
      // "how much I"
      { note: up(A4), beats: 0.5 },
      { note: up(G4), beats: 0.5 },
      { note: up(F4), beats: 0.5 },
      // "love you."
      { note: up(E4), beats: 1.5, chord: [C4, E4, G4] },
      { note: up(C4), beats: 1.0 },
      // "Please don't take"
      { note: up(C4), beats: 0.5 },
      { note: up(D4), beats: 0.5 },
      { note: up(E4), beats: 0.5 },
      // "my sun-shine"
      { note: up(F4), beats: 1.0, chord: [B3, D4, G4] },
      { note: up(D4), beats: 1.0 },
      // "a-way."
      { note: up(D4), beats: 0.5 },
      { note: up(E4), beats: 0.5 },
      { note: up(C4), beats: 2.5, chord: [C4, E4, G4] },
    ];

    const beatSec = 60 / 92;
    const totalDuration = melody.reduce((acc, item) => acc + item.beats * beatSec, 0);

    const scheduleLoop = () => {
      if (!this.isPlaying || !this.ctx || !this.filterNode) return;
      let cursor = this.ctx.currentTime + 0.08;

      melody.forEach((item) => {
        const dur = item.beats * beatSec;
        this.playCelestaNote(item.note, cursor, Math.max(0.55, dur * 1.45), 0.16);
        if (item.chord) {
          item.chord.forEach((chordHz, i) => {
            // Soft ukulele-like arpeggiated strum
            this.playWarmPluck(chordHz, cursor + i * 0.025, 0.7, 0.055);
          });
        }
        cursor += dur;
      });

      this.timerId = window.setTimeout(scheduleLoop, totalDuration * 1000);
    };

    scheduleLoop();
  }

  private playCelestaNote(freq: number, startTime: number, decay: number, volume: number) {
    if (!this.ctx || !this.filterNode) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    const overtoneGain = this.ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.18, startTime);

    // Gentle attack prevents clicks
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + decay);

    osc1.connect(gain);
    osc2.connect(overtoneGain);
    overtoneGain.connect(gain);
    gain.connect(this.filterNode);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + decay + 0.02);
    osc2.stop(startTime + decay + 0.02);
  }

  private playWarmPluck(freq: number, startTime: number, decay: number, volume: number) {
    if (!this.ctx || !this.filterNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + decay);

    osc.connect(gain);
    gain.connect(this.filterNode);

    osc.start(startTime);
    osc.stop(startTime + decay + 0.02);
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      const gain = this.masterGain.gain;
      gain.cancelScheduledValues(this.ctx.currentTime);
      gain.setTargetAtTime(muted ? 0 : 0.34, this.ctx.currentTime, 0.02);
    }
    if (this.htmlAudio) {
      this.htmlAudio.muted = this.isMuted;
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }
}

export const audioController = new AudioController();
