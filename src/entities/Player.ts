import Phaser from 'phaser';

export class Player extends Phaser.GameObjects.Container {
  private velocityY = 0;
  private readonly maxDown = 470;
  private readonly maxUp = -330;
  private readonly gravity = 900;
  private readonly boostVelocity = -330;
  private readonly bodyRadius = 17;
  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);
    this.ensureTexture();

    const aura = scene.add.circle(0, 0, 28, 0x14f7ff, 0.16);
    const hull = scene.add.image(0, 0, 'drone').setScale(1.0);
    const core = scene.add.circle(5, 0, 5, 0xfff7fd, 0.95);
    this.add([aura, hull, core]);

    scene.physics.add.existing(this);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCircle(this.bodyRadius, -this.bodyRadius, -this.bodyRadius);
    body.setAllowGravity(false);
    body.setImmovable(false);

    this.emitter = scene.add.particles(x, y, 'spark', {
      lifespan: 330,
      speed: { min: 20, max: 80 },
      scale: { start: 0.9, end: 0 },
      alpha: { start: 0.8, end: 0 },
      tint: [0x14f7ff, 0xff2bd6],
      quantity: 1,
      frequency: 28,
      emitting: true,
    });

    scene.tweens.add({ targets: aura, alpha: 0.33, scale: 1.22, duration: 520, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  boost(): void {
    this.velocityY = this.boostVelocity;
    this.scene.tweens.add({ targets: this, scaleX: 1.12, scaleY: 0.9, duration: 90, yoyo: true, ease: 'Sine.easeOut' });
    this.emitter.explode(10, this.x - 18, this.y + 6);
  }

  updatePlayer(deltaMs: number): void {
    const delta = deltaMs / 1000;
    this.velocityY = Phaser.Math.Clamp(this.velocityY + this.gravity * delta, this.maxUp, this.maxDown);
    this.y += this.velocityY * delta;
    this.rotation = Phaser.Math.Clamp(this.velocityY / 520, -0.58, 0.72);
    this.emitter.setPosition(this.x - 18, this.y + 6);
    (this.body as Phaser.Physics.Arcade.Body).updateFromGameObject();
  }

  explode(): void {
    this.visible = false;
    this.emitter.explode(70, this.x, this.y);
  }

  destroy(fromScene?: boolean): void {
    this.emitter.destroy();
    super.destroy(fromScene);
  }

  private ensureTexture(): void {
    if (!this.scene.textures.exists('spark')) {
      const g = this.scene.make.graphics({ add: false });
      g.fillStyle(0xffffff, 1).fillCircle(4, 4, 4);
      g.generateTexture('spark', 8, 8);
      g.destroy();
    }
    if (this.scene.textures.exists('drone')) return;
    const g = this.scene.make.graphics({ add: false });
    g.fillStyle(0x14f7ff, 0.25).fillEllipse(32, 32, 58, 34);
    g.lineStyle(3, 0x14f7ff, 0.95).strokeEllipse(32, 32, 48, 26);
    g.fillStyle(0xff2bd6, 0.95).fillTriangle(12, 32, 42, 18, 42, 46);
    g.fillStyle(0x050012, 1).fillTriangle(20, 32, 39, 24, 39, 40);
    g.lineStyle(2, 0xfff7fd, 0.9).strokeCircle(45, 32, 6);
    g.lineStyle(2, 0x14f7ff, 0.7).strokeLineShape(new Phaser.Geom.Line(5, 32, 16, 32));
    g.generateTexture('drone', 64, 64);
    g.destroy();
  }
}
