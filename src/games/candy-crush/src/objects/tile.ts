import { IImageConstructor } from '../interfaces/image.interface';

export class Tile extends Phaser.GameObjects.Image {
  particle: Phaser.GameObjects.Particles.ParticleEmitterManager;
  constructor(aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

    // set image settings
    this.setOrigin(0, 0);
    this.setInteractive();
    this.setDepth(1)

    this.scene.add.existing(this);
    this.particle = this.scene.add.particles('textures', 'debris.png')
  }

  destroy() {    
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
      alpha:0,
      ease: 'Linear',
      duration: 400,
      repeat: 0,
      yoyo: false,
      onComplete:()=>{
        super.destroy()
      }
    })
  }
}
