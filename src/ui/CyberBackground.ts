import Phaser from 'phaser';

export class CyberBackground {
  private readonly scene: Phaser.Scene;
  private readonly layers: Phaser.GameObjects.GameObject[] = [];
  private grid!: Phaser.GameObjects.TileSprite;
  private scan!: Phaser.GameObjects.TileSprite;
  private width: number;
  private height: number;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.width = scene.scale.width;
    this.height = scene.scale.height;
    this.ensureTextures();
    this.build();
  }

  update(speed = 1): void {
    this.grid.tilePositionX += 0.55 * speed;
    this.grid.tilePositionY -= 0.22 * speed;
    this.scan.tilePositionY += 0.42;
    this.layers.forEach((layer) => {
      if (layer instanceof Phaser.GameObjects.TileSprite && layer !== this.grid && layer !== this.scan) {
        layer.tilePositionX += Number(layer.getData('speed')) * speed;
      }
    });
  }

  private ensureTextures(): void {
    if (!this.scene.textures.exists('grid-tile')) {
      const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
      g.lineStyle(1, 0x16f7ff, 0.45);
      g.strokeLineShape(new Phaser.Geom.Line(0, 48, 96, 48));
      g.strokeLineShape(new Phaser.Geom.Line(48, 0, 48, 96));
      g.generateTexture('grid-tile', 96, 96);
      g.destroy();
    }
    if (!this.scene.textures.exists('scanline-tile')) {
      const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xffffff, 0.055);
      g.fillRect(0, 0, 4, 1);
      g.generateTexture('scanline-tile', 4, 4);
      g.destroy();
    }
    if (!this.scene.textures.exists('city-far')) this.createCityTexture('city-far', 0x251052, 0.75, 56, 13);
    if (!this.scene.textures.exists('city-near')) this.createCityTexture('city-near', 0x07091c, 1, 88, 21);
  }

  private createCityTexture(key: string, color: number, alpha: number, maxHeight: number, seed: number): void {
    const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
    let x = 0;
    let i = seed;
    while (x < 1024) {
      i = (i * 9301 + 49297) % 233280;
      const w = 24 + (i % 46);
      i = (i * 9301 + 49297) % 233280;
      const h = 24 + (i % maxHeight);
      g.fillStyle(color, alpha);
      g.fillRect(x, 128 - h, w - 3, h);
      g.fillStyle(0x14f7ff, 0.32);
      for (let yy = 128 - h + 8; yy < 126; yy += 18) {
        if ((yy + x) % 3 !== 0) g.fillRect(x + 6, yy, Math.max(4, w - 16), 2);
      }
      x += w;
    }
    g.generateTexture(key, 1024, 128);
    g.destroy();
  }

  private build(): void {
    const bg = this.scene.add.rectangle(0, 0, this.width, this.height, 0x050012).setOrigin(0);
    const horizon = this.scene.add.rectangle(0, this.height * 0.42, this.width, this.height * 0.6, 0x160034, 0.85).setOrigin(0);
    const sun = this.scene.add.circle(this.width * 0.75, this.height * 0.27, 82, 0xff2bd6, 0.26);
    const far = this.scene.add.tileSprite(0, this.height - 190, this.width, 128, 'city-far').setOrigin(0).setData('speed', 0.18);
    const near = this.scene.add.tileSprite(0, this.height - 145, this.width, 128, 'city-near').setOrigin(0).setData('speed', 0.55);
    this.grid = this.scene.add.tileSprite(this.width / 2, this.height - 36, this.width * 1.2, 210, 'grid-tile').setTint(0x14f7ff).setAlpha(0.26);
    this.grid.setScale(1, 0.55).setRotation(-0.08);
    const vignette = this.scene.add.rectangle(0, 0, this.width, this.height, 0x000000, 0.25).setOrigin(0);
    this.scan = this.scene.add.tileSprite(0, 0, this.width, this.height, 'scanline-tile').setOrigin(0).setAlpha(0.34);
    this.layers.push(bg, horizon, sun, far, near, this.grid, vignette, this.scan);

    this.scene.tweens.add({ targets: sun, alpha: 0.44, scale: 1.06, duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }
}
