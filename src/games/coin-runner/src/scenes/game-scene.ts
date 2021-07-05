import { Coin } from '../objects/coin';
import { Player } from '../objects/player';

export class GameScene extends Phaser.Scene {
  private background: Phaser.GameObjects.Image;
  private coin: Coin;
  private coinsCollectedText: Phaser.GameObjects.Text;
  private collectedCoins: number;
  private player: Player;
  particle: Phaser.GameObjects.Particles.ParticleEmitterManager;

  constructor() {
    super({
      key: 'GameScene'
    });
  }

  preload(): void {
    this.load.atlas('textures','assets/textures/texture_bundle.png','assets/textures/texture_bundle.json')
    this.load.image('background', './assets/images/background.png');
    this.load.image('player', './assets/images/player.png');
    this.load.image('coin', './assets/images/coin.png');
  }

  init(): void {
    this.collectedCoins = 0;
  }

  create(): void {
    // create background
    this.background = this.add.image(0, 0, 'background');
    this.background.setOrigin(0, 0);

    // create objects
    this.coin = new Coin({
      scene: this,
      x: Phaser.Math.RND.integerInRange(100, 700),
      y: Phaser.Math.RND.integerInRange(100, 500),
      texture: 'coin'
    });
    this.player = new Player({
      scene: this,
      x: this.sys.canvas.width / 2,
      y: this.sys.canvas.height / 2,
      texture: 'player'
    });

    // create texts
    this.coinsCollectedText = this.add.text(
      this.sys.canvas.width / 2,
      this.sys.canvas.height - 50,
      this.collectedCoins + '',
      {
        fontFamily: 'Arial',
        fontSize: 38 + 'px',
        stroke: '#fff',
        strokeThickness: 6,
        color: '#000000'
      }
    );

    this.particle = this.add.particles('textures', 'debris.png')
  }

  update(): void {
    // update objects
    this.player.update();
    this.coin.update();

    // do the collision check
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.player.getBounds(),
        this.coin.getBounds()
      )
    ) {
      this.particle.createEmitter({
        x: this.coin.x,
        y: this.coin.y,
        speedY: { min: -100, max: 100 },
        speedX: { min: -100, max: 100 },
        //angle: -90,
        //gravityY: 2338,
        maxParticles: 4
    })
      this.updateCoinStatus();
    }
  }

  private updateCoinStatus(): void {
    this.collectedCoins++;
    this.coinsCollectedText.setText(this.collectedCoins + '');
    this.coin.changePosition();
  }
}
