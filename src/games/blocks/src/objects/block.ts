import { IBlockConstructor } from '../interfaces/block.interface';

export class Block extends Phaser.GameObjects.Sprite {
  private blockType: number;
  private isDying: boolean;
  particle: Phaser.GameObjects.Particles.ParticleEmitterManager;
  isDead: boolean;

  constructor(aParams: IBlockConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.type);

    this.blockType = aParams.type;
    this.isDying = false;

    this.initSprite();
    this.scene.add.existing(this);
    this.particle = this.scene.add.particles('textures', 'debris.png')
    this.isDead=false
  }

  update(): void {
    // if (this.isDying) {
    //   this.alpha -= 0.02;

    //   if (this.alpha === 0) {
    //     this.isDying = false;
    //     this.setType(0);
    //     this.setAlpha(1);
    //   }
    // }
  }

  private initSprite() {
    this.setFrame(this.blockType);
    this.setOrigin(0, 0);
  }

  public getType(): number {
    return this.blockType;
  }

  public setType(id: number): void {
    this.blockType = id;
    this.setFrame(this.blockType);
  }

  public activateDead(): void {
    this.isDying = true;
  }

  public getDead(): boolean {
    return this.isDying;
  }

  clearBlock() {
    if (!this.isDead) {
      this.isDead=true;
      this.particle.createEmitter({
        x: this.x,
        y: this.y,
        speedY: { min: -100, max: 100 },
        speedX: { min: -100, max: 100 },
        //angle: -90,
        //gravityY: 2338,
        maxParticles: 4
      })
      this.scene.add.tween({
        targets: this,
        alpha: 0,
        duration: 500,
        onComplete: () => {
          this.isDying=false
          this.setAlpha(1)
          this.setType(0)
          //super.destroy()
        }
      })
    }
  }
}
