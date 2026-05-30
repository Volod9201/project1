import Phaser from 'phaser';

interface Gate {
  top: Phaser.GameObjects.Rectangle;
  bottom: Phaser.GameObjects.Rectangle;
  glowTop: Phaser.GameObjects.Rectangle;
  glowBottom: Phaser.GameObjects.Rectangle;
  scorer: Phaser.GameObjects.Zone;
  scored: boolean;
}

export class ObstacleManager {
  readonly group: Phaser.Physics.Arcade.Group;
  private readonly scene: Phaser.Scene;
  private readonly gates: Gate[] = [];
  private spawnTimer = 0;
  private elapsed = 0;
  private onScore: () => void;

  constructor(scene: Phaser.Scene, onScore: () => void) {
    this.scene = scene;
    this.onScore = onScore;
    this.group = scene.physics.add.group({ allowGravity: false, immovable: true });
  }

  update(deltaMs: number, playerX: number): void {
    this.elapsed += deltaMs / 1000;
    this.spawnTimer -= deltaMs;
    if (this.spawnTimer <= 0) {
      this.spawnGate();
      this.spawnTimer = this.currentSpawnDelay();
    }
    const speed = this.currentSpeed();
    for (const gate of [...this.gates]) {
      [gate.top, gate.bottom, gate.glowTop, gate.glowBottom, gate.scorer].forEach((item) => (item.x -= speed * (deltaMs / 1000)));
      (gate.top.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject();
      (gate.bottom.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject();
      if (!gate.scored && gate.scorer.x < playerX) {
        gate.scored = true;
        this.onScore();
      }
      if (gate.top.x < -90) this.destroyGate(gate);
    }
  }

  reset(): void {
    [...this.gates].forEach((gate) => this.destroyGate(gate));
    this.spawnTimer = 300;
    this.elapsed = 0;
  }

  private currentSpeed(): number {
    return Math.min(345, 188 + this.elapsed * 4.2);
  }

  private currentGap(): number {
    return Math.max(142, 210 - this.elapsed * 1.25);
  }

  private currentSpawnDelay(): number {
    return Math.max(1120, 1540 - this.elapsed * 8);
  }

  private spawnGate(): void {
    const width = 66;
    const gap = this.currentGap();
    const margin = 78;
    const center = Phaser.Math.Between(margin + gap / 2, this.scene.scale.height - margin - gap / 2);
    const topHeight = center - gap / 2;
    const bottomY = center + gap / 2;
    const bottomHeight = this.scene.scale.height - bottomY;
    const x = this.scene.scale.width + width;

    const glowTop = this.scene.add.rectangle(x, topHeight / 2, width + 28, topHeight, 14, 0x14f7ff, 0.16);
    const glowBottom = this.scene.add.rectangle(x, bottomY + bottomHeight / 2, width + 28, bottomHeight, 14, 0xff2bd6, 0.16);
    const top = this.scene.add.rectangle(x, topHeight / 2, width, topHeight, 10, 0x06182c, 0.96).setStrokeStyle(3, 0x14f7ff, 0.95);
    const bottom = this.scene.add.rectangle(x, bottomY + bottomHeight / 2, width, bottomHeight, 10, 0x16051d, 0.96).setStrokeStyle(3, 0xff2bd6, 0.95);
    const scorer = this.scene.add.zone(x + width / 2, this.scene.scale.height / 2, 4, this.scene.scale.height);
    this.scene.physics.add.existing(top, true);
    this.scene.physics.add.existing(bottom, true);
    this.group.add(top);
    this.group.add(bottom);

    this.scene.tweens.add({ targets: [glowTop, glowBottom], alpha: 0.28, duration: 420, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.gates.push({ top, bottom, glowTop, glowBottom, scorer, scored: false });
  }

  private destroyGate(gate: Gate): void {
    Phaser.Utils.Array.Remove(this.gates, gate);
    this.group.remove(gate.top, true, true);
    this.group.remove(gate.bottom, true, true);
    gate.glowTop.destroy();
    gate.glowBottom.destroy();
    gate.scorer.destroy();
  }
}
