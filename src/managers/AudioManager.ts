import { Storage, SettingsState } from '../utils/Storage';

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

type SfxName = 'hover' | 'click' | 'boost' | 'score' | 'death' | 'achievement' | 'pause' | 'resume';

export class AudioManager {
  private static context: AudioContext | null = null;
  private static settings: SettingsState = Storage.getSettings();
  private static ambientGain: GainNode | null = null;
  private static ambientTimer: number | null = null;

  static getSettings(): SettingsState {
    return { ...this.settings };
  }

  static updateSettings(next: Partial<SettingsState>): void {
    this.settings = {
      ...this.settings,
      ...next,
      masterVolume: clamp01(next.masterVolume ?? this.settings.masterVolume),
      sfxVolume: clamp01(next.sfxVolume ?? this.settings.sfxVolume),
      musicVolume: clamp01(next.musicVolume ?? this.settings.musicVolume),
    };
    Storage.setSettings(this.settings);
    if (this.ambientGain) {
      this.ambientGain.gain.setTargetAtTime(this.musicLevel(), this.now(), 0.05);
    }
  }

  static async unlock(): Promise<void> {
    const AudioContextCtor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return;
    if (!this.context) this.context = new AudioContextCtor();
    if (this.context.state === 'suspended') await this.context.resume();
    this.startAmbient();
  }

  static play(name: SfxName): void {
    if (this.settings.muted) return;
    void this.unlock().then(() => {
      if (!this.context) return;
      const sfx = {
        hover: [520, 0.045, 'sine', 0.05],
        click: [180, 0.06, 'triangle', 0.08],
        boost: [680, 0.11, 'sawtooth', 0.11],
        score: [880, 0.12, 'square', 0.09],
        death: [90, 0.36, 'sawtooth', 0.18],
        achievement: [440, 0.34, 'triangle', 0.14],
        pause: [240, 0.12, 'sine', 0.08],
        resume: [360, 0.12, 'sine', 0.08],
      } as const satisfies Record<SfxName, readonly [number, number, OscillatorType, number]>;
      const [freq, duration, type, gain] = sfx[name];
      this.tone(freq, duration, type, gain * this.settings.sfxVolume, name === 'achievement');
    });
  }

  private static now(): number {
    return this.context?.currentTime ?? 0;
  }

  private static musicLevel(): number {
    return this.settings.muted ? 0 : this.settings.masterVolume * this.settings.musicVolume * 0.22;
  }

  private static sfxLevel(gain: number): number {
    return this.settings.masterVolume * this.settings.sfxVolume * gain;
  }

  private static tone(freq: number, duration: number, type: OscillatorType, gain: number, arpeggio = false): void {
    if (!this.context) return;
    const start = this.context.currentTime;
    const output = this.context.createGain();
    output.gain.setValueAtTime(0.0001, start);
    output.gain.exponentialRampToValueAtTime(Math.max(0.0002, this.sfxLevel(gain)), start + 0.012);
    output.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    output.connect(this.context.destination);

    const notes = arpeggio ? [1, 1.25, 1.5] : [1];
    notes.forEach((ratio, index) => {
      const osc = this.context!.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(freq * ratio, start + index * 0.055);
      if (type === 'sawtooth') osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq * ratio * 0.55), start + duration);
      osc.connect(output);
      osc.start(start + index * 0.035);
      osc.stop(start + duration + index * 0.035);
    });
  }

  private static startAmbient(): void {
    if (!this.context || this.ambientGain) return;
    this.ambientGain = this.context.createGain();
    this.ambientGain.gain.value = this.musicLevel();
    this.ambientGain.connect(this.context.destination);
    const bass = this.context.createOscillator();
    bass.type = 'sine';
    bass.frequency.value = 55;
    bass.connect(this.ambientGain);
    bass.start();

    const pulse = () => {
      if (!this.context || !this.ambientGain) return;
      const t = this.context.currentTime;
      this.ambientGain.gain.cancelScheduledValues(t);
      this.ambientGain.gain.setValueAtTime(this.musicLevel() * 0.35, t);
      this.ambientGain.gain.linearRampToValueAtTime(this.musicLevel(), t + 0.08);
      this.ambientGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, this.musicLevel() * 0.35), t + 0.42);
      this.ambientTimer = window.setTimeout(pulse, 520);
    };
    pulse();
  }
}
