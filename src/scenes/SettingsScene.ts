import Phaser from 'phaser';
import { AudioManager } from '../managers/AudioManager';
import { CyberBackground } from '../ui/CyberBackground';
import { createNeonButton, makePanel } from '../ui/Button';
import { SettingsState } from '../utils/Storage';

export class SettingsScene extends Phaser.Scene {
  private bg!: CyberBackground;
  private settings!: SettingsState;

  constructor() {
    super('SettingsScene');
  }

  create(): void {
    const { width, height } = this.scale;
    this.bg = new CyberBackground(this);
    this.settings = AudioManager.getSettings();
    this.add.text(width / 2, 70, 'SETTINGS', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '44px',
      color: '#ffffff',
      stroke: '#ff2bd6',
      strokeThickness: 6,
    }).setOrigin(0.5);
    makePanel(this, width / 2, height / 2, 560, 330);
    this.addToggle(width / 2, 178);
    this.addSlider(width / 2, 246, 'Master Volume', 'masterVolume');
    this.addSlider(width / 2, 306, 'SFX Volume', 'sfxVolume');
    this.addSlider(width / 2, 366, 'Music Pulse', 'musicVolume');
    createNeonButton(this, width / 2, height - 62, 'BACK', () => this.scene.start('MainMenuScene'), 220);
  }

  update(): void {
    this.bg.update(0.45);
  }

  private addToggle(x: number, y: number): void {
    const label = this.add.text(x - 160, y, 'Mute', { fontFamily: 'Arial Black, Arial', fontSize: '22px', color: '#ffffff' }).setOrigin(0, 0.5);
    const box = this.add.rectangle(x + 126, y, 120, 38, 12, this.settings.muted ? 0x50112e : 0x0f2740, 0.95)
      .setStrokeStyle(2, this.settings.muted ? 0xff2bd6 : 0x14f7ff, 0.9)
      .setInteractive({ useHandCursor: true });
    const value = this.add.text(box.x, y, this.settings.muted ? 'OFF' : 'ON', { fontFamily: 'Arial Black, Arial', fontSize: '18px', color: '#ffffff' }).setOrigin(0.5);
    box.on('pointerdown', () => {
      AudioManager.play('click');
      this.settings.muted = !this.settings.muted;
      AudioManager.updateSettings({ muted: this.settings.muted });
      box.setFillStyle(this.settings.muted ? 0x50112e : 0x0f2740, 0.95).setStrokeStyle(2, this.settings.muted ? 0xff2bd6 : 0x14f7ff, 0.9);
      value.setText(this.settings.muted ? 'OFF' : 'ON');
    });
    label.setDepth(2);
  }

  private addSlider(x: number, y: number, label: string, key: 'masterVolume' | 'sfxVolume' | 'musicVolume'): void {
    this.add.text(x - 210, y, label, { fontFamily: 'Arial Black, Arial', fontSize: '19px', color: '#ffffff' }).setOrigin(0, 0.5);
    const track = this.add.rectangle(x + 75, y, 250, 8, 0x1b204a, 1).setInteractive({ useHandCursor: true });
    const fill = this.add.rectangle(track.x - 125, y, 250 * this.settings[key], 8, 0x14f7ff, 1).setOrigin(0, 0.5);
    const knob = this.add.circle(track.x - 125 + 250 * this.settings[key], y, 12, 0xff2bd6, 1).setStrokeStyle(2, 0xffffff, 0.85);
    const percent = this.add.text(x + 230, y, `${Math.round(this.settings[key] * 100)}%`, { fontFamily: 'Arial, sans-serif', fontSize: '16px', color: '#a8fbff' }).setOrigin(0.5);
    const setValue = (pointer: Phaser.Input.Pointer) => {
      const value = Phaser.Math.Clamp((pointer.x - (track.x - 125)) / 250, 0, 1);
      this.settings[key] = value;
      AudioManager.updateSettings({ [key]: value });
      fill.width = 250 * value;
      knob.x = track.x - 125 + 250 * value;
      percent.setText(`${Math.round(value * 100)}%`);
    };
    track.on('pointerdown', setValue);
    track.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) setValue(pointer);
    });
  }
}
