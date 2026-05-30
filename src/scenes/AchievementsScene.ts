import Phaser from 'phaser';
import { ACHIEVEMENTS, AchievementManager } from '../managers/AchievementManager';
import { CyberBackground } from '../ui/CyberBackground';
import { createNeonButton, makePanel } from '../ui/Button';

export class AchievementsScene extends Phaser.Scene {
  private bg!: CyberBackground;

  constructor() {
    super('AchievementsScene');
  }

  create(): void {
    const { width, height } = this.scale;
    this.bg = new CyberBackground(this);
    this.add.text(width / 2, 54, 'ACHIEVEMENTS', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '42px',
      color: '#ffffff',
      stroke: '#14f7ff',
      strokeThickness: 5,
    }).setOrigin(0.5);
    makePanel(this, width / 2, height / 2 + 10, 760, 390);
    const unlocked = AchievementManager.getUnlocked();
    ACHIEVEMENTS.forEach((achievement, index) => {
      const x = width / 2 - 330 + (index % 2) * 340;
      const y = 128 + Math.floor(index / 2) * 82;
      const isUnlocked = unlocked.has(achievement.id);
      const card = this.add.rectangle(x, y, 306, 60, 12, isUnlocked ? 0x101a32 : 0x080711, 0.9).setOrigin(0, 0.5);
      card.setStrokeStyle(2, isUnlocked ? 0x14f7ff : 0x4b3f67, isUnlocked ? 0.9 : 0.65);
      this.add.text(x + 18, y - 15, `${isUnlocked ? '◆' : '◇'} ${achievement.title}`, {
        fontFamily: 'Arial Black, Arial, sans-serif',
        fontSize: '17px',
        color: isUnlocked ? '#ffffff' : '#817995',
      });
      this.add.text(x + 18, y + 9, isUnlocked ? achievement.description : 'Locked transmission', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        color: isUnlocked ? '#9cfbff' : '#665e75',
      });
    });
    createNeonButton(this, width / 2, height - 58, 'BACK', () => this.scene.start('MainMenuScene'), 220);
  }

  update(): void {
    this.bg.update(0.45);
  }
}
