declare namespace Phaser {
  const AUTO: number;
  namespace Scale { const FIT: string; const CENTER_BOTH: string; }
  namespace Types { namespace Core { interface GameConfig { [key: string]: any; } } }
  namespace Math { function Clamp(value: number, min: number, max: number): number; function Between(min: number, max: number): number; }
  namespace Geom { class Line { constructor(x1: number, y1: number, x2: number, y2: number); } }
  namespace Utils { namespace Array { function Remove<T>(array: T[], item: T): T | null; } }
  namespace Physics { namespace Arcade { class Body { setCircle(...args: any[]): this; setAllowGravity(...args: any[]): this; setImmovable(...args: any[]): this; updateFromGameObject(): void; } class StaticBody extends Body {} class Group { add(obj: any): void; remove(obj: any, destroyChild?: boolean, removeFromScene?: boolean): void; getChildren(): any[]; } } }
  namespace Input { class Pointer { x: number; y: number; isDown: boolean; } }
  namespace GameObjects {
    class GameObject { x: number; y: number; alpha: number; visible: boolean; scale: number; scaleX: number; scaleY: number; rotation: number; body?: any; scene: Scene; setOrigin(...args: any[]): this; setStrokeStyle(...args: any[]): this; setFillStyle(...args: any[]): this; setInteractive(...args: any[]): this; setDepth(...args: any[]): this; setScale(...args: any[]): this; setRotation(...args: any[]): this; setTint(...args: any[]): this; setAlpha(...args: any[]): this; setSize(...args: any[]): this; setData(key: string, value: any): this; getData(key: string): any; on(event: string, cb: (...args: any[]) => void): this; once(event: string, cb: (...args: any[]) => void): this; destroy(fromScene?: boolean): void; }
    class Container extends GameObject { constructor(scene: Scene, x?: number, y?: number); add(children: any[] | any): this; }
    class Rectangle extends GameObject { width: number; height: number; constructor(...args: any[]); }
    class Circle extends GameObject { constructor(...args: any[]); }
    class Image extends GameObject { constructor(...args: any[]); }
    class Text extends GameObject { constructor(...args: any[]); setText(text: string): this; }
    class TileSprite extends GameObject { tilePositionX: number; tilePositionY: number; constructor(...args: any[]); }
    class Zone extends GameObject { constructor(...args: any[]); }
    class Graphics extends GameObject { fillStyle(...args: any[]): this; fillRect(...args: any[]): this; fillCircle(...args: any[]): this; fillEllipse(...args: any[]): this; fillTriangle(...args: any[]): this; lineStyle(...args: any[]): this; strokeEllipse(...args: any[]): this; strokeCircle(...args: any[]): this; strokeLineShape(...args: any[]): this; generateTexture(...args: any[]): void; }
    namespace Particles { class ParticleEmitter extends GameObject { explode(...args: any[]): void; setPosition(x: number, y: number): this; } }
  }
  class Scene {
    constructor(key?: string);
    scale: { width: number; height: number };
    add: any; make: any; textures: any; physics: any; tweens: any; time: any; cameras: any; input: any; scene: any;
  }
  class Game { constructor(config: Types.Core.GameConfig); }
}
export = Phaser;
export as namespace Phaser;
