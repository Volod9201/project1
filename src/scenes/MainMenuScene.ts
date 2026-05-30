import Phaser from 'phaser';
import { AudioManager } from '../managers/AudioManager';
import { Storage } from '../utils/Storage';
import { CyberBackground } from '../ui/CyberBackground';
import { createNeonButton } from '../ui/Button';

export class MainMenuScene extends Phaser.Scene {
  private bg!: CyberBackground;

  constructor() {
    super('MainMenuScene');
  }

  create(): void {
    const { width, height } = this.scale;
    this.bg = new CyberBackground(this);
    this.input.once('pointerdown', () => void AudioManager.unlock());
    this.input.keyboard?.once('keydown', () => void AudioManager.unlock());

    const title = this.add.text(width / 2, 92, 'NEON DRIFT', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '66px',
      color: '#f7fbff',
      stroke: '#ff2bd6',
      strokeThickness: 8,
      shadow: { color: '#14f7ff', blur: 22, fill: true },
    }).setOrigin(0.5);
    this.add.text(width / 2, 152, 'thread the skyline • chase the pulse', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      color: '#9cfbff',
      letterSpacing: 2,
    }).setOrigin(0.5);
    this.add.text(width / 2, 196, `BEST SCORE ${Storage.getNumber('bestScore', 0)}`, {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '24px',
      color: '#fff3fb',
    }).setOrigin(0.5);

    createNeonButton(this, width / 2, 270, 'PLAY', () => this.scene.start('GameScene'));
    createNeonButton(this, width / 2, 342, 'ACHIEVEMENTS', () => this.scene.start('AchievementsScene'));
    createNeonButton(this, width / 2, 414, 'SETTINGS', () => this.scene.start('SettingsScene'));

    this.tweens.add({ targets: title, y: title.y + 7, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  update(): void {
    this.bg.update(0.55);
  }
}
