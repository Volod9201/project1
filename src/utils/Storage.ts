export interface SettingsState {
  muted: boolean;
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
}

const PREFIX = 'neon-drift:';

const defaults: SettingsState = {
  muted: false,
  masterVolume: 0.75,
  sfxVolume: 0.85,
  musicVolume: 0.45,
};

export class Storage {
  static getNumber(key: string, fallback = 0): number {
    const value = localStorage.getItem(PREFIX + key);
    const parsed = value === null ? Number.NaN : Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  static setNumber(key: string, value: number): void {
    localStorage.setItem(PREFIX + key, String(value));
  }

  static getStringArray(key: string): string[] {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
    } catch {
      return [];
    }
  }

  static setStringArray(key: string, value: string[]): void {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  }

  static getSettings(): SettingsState {
    try {
      const raw = localStorage.getItem(PREFIX + 'settings');
      return { ...defaults, ...(raw ? JSON.parse(raw) : {}) };
    } catch {
      return defaults;
    }
  }

  static setSettings(settings: SettingsState): void {
    localStorage.setItem(PREFIX + 'settings', JSON.stringify(settings));
  }
}
