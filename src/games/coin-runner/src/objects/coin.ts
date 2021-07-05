import { Tweens } from 'phaser';
import { IImageConstructor } from '../interfaces/image.interface';

export class Coin extends Phaser.GameObjects.Image {
  private centerOfScreen: number;
  private changePositionTimer: Phaser.Time.TimerEvent;
  private lastPosition: string;
  particle: Phaser.GameObjects.Particles.ParticleEmitterManager;
  tween: any;

  constructor(aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture);

    this.initVariables();
    this.initImage();
    this.initEvents();

    this.scene.add.existing(this);
    this.particle = this.scene.add.particles('textures', 'debris.png')
    this.tween=this.tween=this.scene.tweens.add({
      targets:this,
      alpha:0,
      yoyo:true,
      duration:300,
      repeat:-1
    })
  }

  private initVariables(): void {
    this.centerOfScreen = this.scene.sys.canvas.width / 2;
    this.changePositionTimer = null;
    this.setFieldSide();
  }

  private initImage(): void {
    this.setOrigin(0.5, 0.5);
  }

  private initEvents(): void {
    this.changePositionTimer = this.scene.time.addEvent({
      delay: 2000,
      callback: this.changePosition,
      callbackScope: this,
      loop: true
    });
  }

  update(): void { }

  public changePosition(): void {
    this.setNewPosition();
    this.setFieldSide();

    this.changePositionTimer.reset({
      delay: 2000,
      callback: this.changePosition,
      callbackScope: this,
      loop: true
    });
  }

  private setNewPosition(): void {
    if (this.lastPosition == 'right') {
      this.x = Phaser.Math.RND.integerInRange(100, this.centerOfScreen);
    } else {
      this.x = Phaser.Math.RND.integerInRange(385, 700);
    }
    this.y = Phaser.Math.RND.integerInRange(100, 500);

    if(this.tween){
      this.tween.stop()
      this.alpha=1
    }

    this.tween=this.scene.tweens.add({
      targets:this,
      alpha:0,
      yoyo:true,
      duration:300,
      repeat:-1
    })
  }

  private setFieldSide(): void {
    if (this.x <= this.centerOfScreen) {
      this.lastPosition = 'left';
    } else {
      this.lastPosition = 'right';
    }
  }

  coinClaimed() {
    this.particle.createEmitter({
      x: this.x,
      y: this.y,
      speedY: { min: -100, max: 100 },
      speedX: { min: -100, max: 100 },
      //angle: -90,
      //gravityY: 2338,
      maxParticles: 4
    })
  }
}
