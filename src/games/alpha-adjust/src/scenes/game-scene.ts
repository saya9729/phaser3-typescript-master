import { CloneCrystal } from '../objects/clone-crystal';
import { OriginalCrystal } from '../objects/original-crystal';

export class GameScene extends Phaser.Scene {
  private cloneCrystal: CloneCrystal;
  private originalCrystal: OriginalCrystal;
  private playerHasClicked: boolean;
  private alphaDifferenceText: Phaser.GameObjects.Text;
  private feedbackText: Phaser.GameObjects.Text;
  particle: Phaser.GameObjects.Particles.ParticleEmitterManager;

  constructor() {
    super({
      key: 'GameScene'
    });
  }

  preload(): void {
    this.load.atlas('textures','assets/textures/texture_bundle.png','assets/textures/texture_bundle.json')
    this.load.image('crystal', './assets/images/crystal.png');
  }

  init(): void {
    this.playerHasClicked = false;
    this.alphaDifferenceText = null;
    this.feedbackText = null;
  }

  create(): void {
    // create game objects
    this.cloneCrystal = new CloneCrystal({
      scene: this,
      x: this.sys.canvas.width / 2 - 150,
      y: this.sys.canvas.height / 2,
      texture: 'crystal'
    });

    this.originalCrystal = new OriginalCrystal({
      scene: this,
      x: this.sys.canvas.width / 2 + 150,
      y: this.sys.canvas.height / 2,
      texture: 'crystal',
      alpha: Phaser.Math.RND.realInRange(0, 1)
    });
    this.particle = this.add.particles('textures', 'debris.png')
    this.input.on(
      'pointerdown',
      function () {
        if (!this.playerHasClicked) {
          this.playerHasClicked = true;
          this.particle.createEmitter({
            x: this.cloneCrystal.x,
            y: this.cloneCrystal.y,
            speedY: { min: -100, max: 100 },
            speedX: { min: -100, max: 100 },
            //angle: -90,
            //gravityY: 2338,
            maxParticles: 30
        })
        } else {
          this.scene.start('GameScene');
        }
      },
      this
    );    
  }

  update(): void {
    if (!this.playerHasClicked) {
      this.cloneCrystal.update();
    } else {
      let difference = this.calculateAlphaDifference();
      this.createResultTexts(difference);
    }
  }

  private calculateAlphaDifference(): number {
    return Math.abs(this.cloneCrystal.alpha - this.originalCrystal.alpha);
  }

  private createResultTexts(difference: number): void {
    this.alphaDifferenceText = this.add.text(
      this.sys.canvas.width / 2 - 100,
      this.sys.canvas.height / 2 + 100,
      difference.toFixed(2) + '',
      {
        fontFamily: 'Arial',
        fontSize: 100 + 'px',
        stroke: '#000000',
        strokeThickness: 8,
        color: '#ffffff'
      }
    );

    let textConfig: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'Arial',
      fontSize: 50 + 'px',
      stroke: '#000000',
      strokeThickness: 8,
      color: '#ffffff'
    };

    if (difference >= 0.5) {
      this.feedbackText = this.add.text(
        this.sys.canvas.width / 2 - 250,
        this.sys.canvas.height / 2 - 150,
        'You can do better!',
        textConfig
      );
    } else if (difference < 0.5 && difference >= 0.3) {
      this.feedbackText = this.add.text(
        this.sys.canvas.width / 2 - 40,
        this.sys.canvas.height / 2 - 150,
        'OK!',
        textConfig
      );
    } else if (difference < 0.3 && difference >= 0.1) {
      this.feedbackText = this.add.text(
        this.sys.canvas.width / 2 - 90,
        this.sys.canvas.height / 2 - 150,
        'Great!',
        textConfig
      );
    } else if (difference < 0.1) {
      this.feedbackText = this.add.text(
        this.sys.canvas.width / 2 - 145,
        this.sys.canvas.height / 2 - 150,
        'Wonderful!',
        textConfig
      );
    }
  }
}
