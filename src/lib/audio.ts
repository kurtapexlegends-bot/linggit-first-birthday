// Web Audio API generator for cheerful SFX and "You Are My Sunshine" music box lullaby
class AudioController {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;
  private htmlAudio: HTMLAudioElement | null = null;
  private usingHtmlAudio: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Play cute pop sound when buttons or dialogues click
  public playPop() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain || this.isMuted) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Audio context error silently handled
    }
  }

  // Play celebration sparkle chime
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

  // "You Are My Sunshine" Music Box Synthesizer
  public startLullaby() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    // Check if user has provided a custom MP3 in /audio/you-are-my-sunshine.mp3
    if (typeof window !== "undefined") {
      const audio = new Audio("/audio/you-are-my-sunshine.mp3");
      audio.loop = true;
      audio.volume = 0.4;
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.htmlAudio = audio;
            this.usingHtmlAudio = true;
            if (this.isMuted) {
              audio.muted = true;
            }
          })
          .catch(() => {
            // If file doesn't exist or failed to play, fall back to our Web Audio Music Box
            this.usingHtmlAudio = false;
            this.runSynthLullaby();
          });
        return;
      }
    }

    this.runSynthLullaby();
  }

  private runSynthLullaby() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    // "You Are My Sunshine" melody notes and durations:
    // Notes: [frequency, duration in beats]
    // C4=261.63, D4=293.66, E4=329.63, F4=349.23, G4=392.00, A4=440.00, B4=493.88, C5=523.25
    const C4 = 261.63;
    const D4 = 293.66;
    const E4 = 329.63;
    const F4 = 349.23;
    const G4 = 392.0;
    const A4 = 440.0;
    const C5 = 523.25;

    // Melody: "You are my sun-shine, my on-ly sun-shine. You make me hap-py when skies are grey..."
    const melody: Array<{ note: number; duration: number; chord?: number[] }> = [
      // Pickup: You are my
      { note: G4, duration: 0.5 },
      { note: C4, duration: 0.5 },
      { note: D4, duration: 0.5 },
      // sun-shine
      { note: E4, duration: 1.5, chord: [C4, G4] },
      { note: E4, duration: 1.0 },
      // my on-ly
      { note: E4, duration: 0.5 },
      { note: D4, duration: 0.5 },
      { note: E4, duration: 0.5 },
      // sun-shine
      { note: C4, duration: 1.5, chord: [C4, E4] },
      { note: C4, duration: 1.0 },
      // you make me
      { note: C4, duration: 0.5 },
      { note: D4, duration: 0.5 },
      { note: E4, duration: 0.5 },
      // hap-py
      { note: F4, duration: 1.5, chord: [F4, A4] },
      { note: A4, duration: 1.0 },
      // when skies are
      { note: A4, duration: 0.5 },
      { note: G4, duration: 0.5 },
      { note: F4, duration: 0.5 },
      // grey
      { note: E4, duration: 2.0, chord: [C4, G4] },
      // You'll ne-ver
      { note: C4, duration: 0.5 },
      { note: D4, duration: 0.5 },
      { note: E4, duration: 0.5 },
      // know, dear
      { note: F4, duration: 1.5, chord: [F4, A4] },
      { note: A4, duration: 1.0 },
      // how much I
      { note: A4, duration: 0.5 },
      { note: G4, duration: 0.5 },
      { note: F4, duration: 0.5 },
      // love you
      { note: E4, duration: 1.5, chord: [C4, E4] },
      { note: C4, duration: 1.0 },
      // Please don't take
      { note: C4, duration: 0.5 },
      { note: D4, duration: 0.5 },
      { note: E4, duration: 0.5 },
      // my sun-shine a-way
      { note: D4, duration: 1.5, chord: [G4, D4] },
      { note: E4, duration: 0.5 },
      { note: D4, duration: 0.5 },
      { note: C4, duration: 2.5, chord: [C4, E4, G4] },
    ];

    const tempoBpm = 86;
    const beatSec = 60 / tempoBpm;

    let totalDuration = 0;
    melody.forEach((item) => {
      totalDuration += item.duration * beatSec;
    });

    const playLoop = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;

      let currentTime = this.ctx.currentTime + 0.1;

      melody.forEach((item) => {
        if (!this.ctx || !this.masterGain) return;
        const dur = item.duration * beatSec;

        // Play main melody note with a warm chime/bell envelope
        this.playBellNote(item.note, currentTime, dur);

        // If accompaniment chord exists, play softly
        if (item.chord) {
          item.chord.forEach((chordNote) => {
            this.playBellNote(chordNote / 2, currentTime, dur, 0.08); // lower octave bass note
          });
        }

        currentTime += dur;
      });

      // Schedule next loop
      this.timerId = window.setTimeout(() => {
        playLoop();
      }, totalDuration * 1000);
    };

    playLoop();
  }

  private playBellNote(freq: number, startTime: number, _duration: number, volume = 0.22) {
    if (!this.ctx || !this.masterGain) return;

    // Harmonic bell synth (fundamental + octave overtone)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 2, startTime); // pleasant sparkle overtone

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

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
    }
    if (this.htmlAudio) {
      this.htmlAudio.muted = this.isMuted;
    }
    return this.isMuted;
  }

  public getMutedState(): boolean {
    return this.isMuted;
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.htmlAudio) {
      this.htmlAudio.pause();
      this.htmlAudio.currentTime = 0;
    }
  }
}

export const audioController = new AudioController();
