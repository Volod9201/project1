import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  create(): void {
    const { width, height } = this.scale;
    this.add.rectangle(0, 0, width, height, 0x050012).setOrigin(0);
    this.add.text(width / 2, height / 2 - 30, 'BOOTING NEON CORE', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '28px',
      color: '#14f7ff',
      stroke: '#ff2bd6',
      strokeThickness: 3,
    }).setOrigin(0.5);
    const bar = this.add.rectangle(width / 2, height / 2 + 24, 0, 8, 0xff2bd6).setOrigin(0.5);
    this.tweens.add({ targets: bar, width: 320, duration: 650, ease: 'Sine.easeInOut', onComplete: () => this.scene.start('MainMenuScene') });
  }
}
