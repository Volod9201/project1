import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { ObstacleManager } from '../entities/ObstacleManager';
import { AchievementDefinition, AchievementManager } from '../managers/AchievementManager';
import { AudioManager } from '../managers/AudioManager';
import { Storage } from '../utils/Storage';
import { CyberBackground } from '../ui/CyberBackground';

export interface GameOverPayload {
  score: number;
  bestScore: number;
  isNewBest: boolean;
  newlyUnlocked: AchievementDefinition[];
}

export class GameScene extends Phaser.Scene {
  private bg!: CyberBackground;
  private player!: Player;
  private obstacles!: ObstacleManager;
  private score = 0;
  private gatesPassed = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private isDead = false;

  constructor() {
    super('GameScene');
  }

  create(): void {
    const { width, height } = this.scale;
    this.isDead = false;
    this.score = 0;
    this.gatesPassed = 0;
    Storage.setNumber('runs', Storage.getNumber('runs', 0) + 1);
    void AudioManager.unlock();
    this.bg = new CyberBackground(this);
    this.player = new Player(this, width * 0.28, height / 2);
    this.obstacles = new ObstacleManager(this, () => this.scoreGate());

    this.scoreText = this.add.text(width / 2, 34, '0', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '46px',
      color: '#ffffff',
      stroke: '#12001f',
      strokeThickness: 7,
      shadow: { color: '#14f7ff', blur: 12, fill: true },
    }).setOrigin(0.5).setDepth(20);
    this.add.text(18, height - 34, 'SPACE / TAP boost   •   P / ESC pause', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      color: '#a8fbff',
    }).setDepth(20);

    this.physics.add.overlap(this.player, this.obstacles.group, () => this.die(), undefined, this);
    this.input.on('pointerdown', () => this.boost());
    this.input.keyboard?.on('keydown-SPACE', () => this.boost());
    this.input.keyboard?.on('keydown-P', () => this.pauseGame());
    this.input.keyboard?.on('keydown-ESC', () => this.pauseGame());
  }

  update(_time: number, delta: number): void {
    if (this.isDead) return;
    this.bg.update(1);
    this.player.updatePlayer(delta);
    this.obstacles.update(delta, this.player.x);
    if (this.player.y < 16 || this.player.y > this.scale.height - 16) this.die();
  }

  private boost(): void {
    if (this.isDead || this.scene.isPaused()) return;
    AudioManager.play('boost');
    this.player.boost();
  }

  private scoreGate(): void {
    this.score += 1;
    this.gatesPassed += 1;
    this.scoreText.setText(String(this.score));
    AudioManager.play('score');
    this.tweens.add({ targets: this.scoreText, scale: 1.2, duration: 90, yoyo: true, ease: 'Sine.easeOut' });
  }

  private pauseGame(): void {
    if (this.isDead) return;
    AudioManager.play('pause');
    this.scene.pause();
    this.scene.launch('PauseScene');
  }

  private die(): void {
    if (this.isDead) return;
    this.isDead = true;
    AudioManager.play('death');
    this.cameras.main.shake(260, 0.016);
    this.player.explode();
    const runs = Storage.getNumber('runs', 1);
    const previousBest = Storage.getNumber('bestScore', 0);
    const bestScore = Math.max(previousBest, this.score);
    Storage.setNumber('bestScore', bestScore);
    const newlyUnlocked = AchievementManager.evaluateRun({ score: this.score, gatesPassed: this.gatesPassed, runNumber: runs });
    if (newlyUnlocked.length > 0) AudioManager.play('achievement');
    this.time.delayedCall(580, () => {
      this.scene.start('GameOverScene', {
        score: this.score,
        bestScore,
        isNewBest: bestScore > previousBest,
        newlyUnlocked,
      } satisfies GameOverPayload);
    });
  }
}
