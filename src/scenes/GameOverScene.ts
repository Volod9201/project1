import Phaser from 'phaser';
import { GameOverPayload } from './GameScene';
import { AudioManager } from '../managers/AudioManager';
import { Storage } from '../utils/Storage';
import { CyberBackground } from '../ui/CyberBackground';
import { createNeonButton, makePanel } from '../ui/Button';

export class GameOverScene extends Phaser.Scene {
  private bg!: CyberBackground;
  private payload!: GameOverPayload;

  constructor() {
    super('GameOverScene');
  }

  init(data: GameOverPayload): void {
    this.payload = data;
  }

  create(): void {
    const { width, height } = this.scale;
    this.bg = new CyberBackground(this);
    this.cameras.main.flash(360, 255, 43, 214, true);
    makePanel(this, width / 2, height / 2, 520, 430);
    this.add.text(width / 2, 76, 'SIGNAL LOST', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '50px',
      color: '#fff8ff',
      stroke: '#ff2bd6',
      strokeThickness: 7,
      shadow: { color: '#14f7ff', blur: 15, fill: true },
    }).setOrigin(0.5);
    this.add.text(width / 2, 150, `SCORE ${this.payload.score}`, { fontFamily: 'Arial Black, Arial', fontSize: '31px', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(width / 2, 190, `${this.payload.isNewBest ? 'NEW ' : ''}BEST ${this.payload.bestScore}`, { fontFamily: 'Arial Black, Arial', fontSize: '23px', color: '#14f7ff' }).setOrigin(0.5);

    const unlockText = this.payload.newlyUnlocked.length
      ? `UNLOCKED: ${this.payload.newlyUnlocked.map((item) => item.title).join('  •  ')}`
      : 'No new unlocks. Recompile courage.';
    this.add.text(width / 2, 228, unlockText, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      color: '#ffd7f7',
      align: 'center',
      wordWrap: { width: 430 },
    }).setOrigin(0.5);

    createNeonButton(this, width / 2, 300, 'RESTART', () => {
      Storage.setNumber('restartsAfterDeath', Storage.getNumber('restartsAfterDeath', 0) + 1);
      this.scene.start('GameScene');
    }, 250);
    createNeonButton(this, width / 2, 368, 'MAIN MENU', () => this.scene.start('MainMenuScene'), 250);
    createNeonButton(this, width / 2, 436, 'ACHIEVEMENTS', () => this.scene.start('AchievementsScene'), 250);
  }

  update(): void {
    this.bg.update(0.85);
  }
}
