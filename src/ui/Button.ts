import Phaser from 'phaser';
import { AudioManager } from '../managers/AudioManager';

export function createNeonButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  onClick: () => void,
  width = 260,
): Phaser.GameObjects.Container {
  const height = 54;
  const bg = scene.add.rectangle(0, 0, width, height, 12, 0x100822, 0.86).setStrokeStyle(2, 0x14f7ff, 0.8);
  const glow = scene.add.rectangle(0, 0, width + 10, height + 10, 16, 0x14f7ff, 0.16);
  const text = scene.add.text(0, 0, label, {
    fontFamily: 'Arial Black, Arial, sans-serif',
    fontSize: '22px',
    color: '#f5fbff',
    stroke: '#7200ff',
    strokeThickness: 4,
  }).setOrigin(0.5);
  const button = scene.add.container(x, y, [glow, bg, text]).setSize(width, height).setInteractive({ useHandCursor: true });

  button.on('pointerover', () => {
    AudioManager.play('hover');
    scene.tweens.add({ targets: button, scaleX: 1.045, scaleY: 1.045, duration: 130, ease: 'Sine.easeOut' });
    bg.setStrokeStyle(3, 0xff2bd6, 1);
  });
  button.on('pointerout', () => {
    scene.tweens.add({ targets: button, scaleX: 1, scaleY: 1, duration: 160, ease: 'Sine.easeOut' });
    bg.setStrokeStyle(2, 0x14f7ff, 0.8);
  });
  button.on('pointerdown', () => {
    AudioManager.play('click');
    scene.tweens.add({ targets: button, scaleX: 0.97, scaleY: 0.97, duration: 70, yoyo: true, onComplete: onClick });
  });
  return button;
}

export function makePanel(scene: Phaser.Scene, x: number, y: number, width: number, height: number): Phaser.GameObjects.Rectangle {
  return scene.add.rectangle(x, y, width, height, 24, 0x06081d, 0.82).setStrokeStyle(2, 0x14f7ff, 0.75);
}
