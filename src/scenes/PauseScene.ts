import Phaser from 'phaser';
import { AudioManager } from '../managers/AudioManager';
import { createNeonButton, makePanel } from '../ui/Button';

export class PauseScene extends Phaser.Scene {
  constructor() {
    super('PauseScene');
  }

  create(): void {
    const { width, height } = this.scale;
    this.add.rectangle(0, 0, width, height, 0x02020a, 0.58).setOrigin(0);
    makePanel(this, width / 2, height / 2, 380, 330);
    this.add.text(width / 2, height / 2 - 112, 'SYSTEM PAUSED', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '34px',
      color: '#ffffff',
      stroke: '#14f7ff',
      strokeThickness: 5,
    }).setOrigin(0.5);
    createNeonButton(this, width / 2, height / 2 - 35, 'RESUME', () => this.resumeGame(), 250);
    createNeonButton(this, width / 2, height / 2 + 38, 'RESTART', () => {
      AudioManager.play('resume');
      this.scene.stop('GameScene');
      this.scene.start('GameScene');
    }, 250);
    createNeonButton(this, width / 2, height / 2 + 111, 'MAIN MENU', () => {
      this.scene.stop('GameScene');
      this.scene.start('MainMenuScene');
    }, 250);
    this.input.keyboard?.on('keydown-P', () => this.resumeGame());
    this.input.keyboard?.on('keydown-ESC', () => this.resumeGame());
  }

  private resumeGame(): void {
    AudioManager.play('resume');
    this.scene.stop();
    this.scene.resume('GameScene');
  }
}
