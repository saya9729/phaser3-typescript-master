import { Player } from '../objects/player';
import { PlayerTwo } from '../objects/playerTwo';
import { Wall } from '../objects/wall';
import { CONST } from '../const/const';

export class GameScene extends Phaser.Scene {
  // field and game setting
  private gameHeight: number;
  private gameWidth: number;
  private boardWidth: number;
  private boardHeight: number;
  private horizontalFields: number;
  private verticalFields: number;
  private tick: number;

  // objects
  private player: Player;
  private playerTwo: PlayerTwo;
  private gameBorder: Phaser.GameObjects.Image[];

  // texts
  private scoreText: Phaser.GameObjects.BitmapText;
  particle: Phaser.GameObjects.Particles.ParticleEmitterManager;
  waitingSceneEnd: boolean;

  constructor() {
    super({
      key: 'GameScene'
    });
  }

  init(): void {
    this.gameHeight = this.sys.canvas.height;
    this.gameWidth = this.sys.canvas.width;
    this.boardWidth = this.gameWidth - 2 * CONST.FIELD_SIZE;
    this.boardHeight = this.gameHeight - 2 * CONST.FIELD_SIZE;
    this.horizontalFields = this.boardWidth / CONST.FIELD_SIZE;
    this.verticalFields = this.boardHeight / CONST.FIELD_SIZE;
    this.tick = 0;
  }

  preload(): void {
    this.load.image('border', './assets/images/border.png');
    this.load.spritesheet('player', './assets/images/player.png', {
      frameWidth: 8,
      frameHeight: 8
    });
  }

  create(): void {
    // objects
    this.player = new Player(this, 12, 12, 'right');
    this.playerTwo = new PlayerTwo(this, 244, 212, 'left');

    // TODO: Replace with Group and Action
    this.gameBorder = [];
    let i = 0;
    for (let x = 0; x < this.gameWidth / CONST.FIELD_SIZE; x++) {
      for (let y = 0; y < this.gameHeight / CONST.FIELD_SIZE; y++) {
        if (
          y === 0 ||
          y === this.gameHeight / CONST.FIELD_SIZE - 1 ||
          x === 0 ||
          x === this.gameWidth / CONST.FIELD_SIZE - 1
        ) {
          this.gameBorder[i] = new Wall({
            scene: this,
            x: CONST.FIELD_SIZE / 2 + x * CONST.FIELD_SIZE,
            y: CONST.FIELD_SIZE / 2 + y * CONST.FIELD_SIZE,
            texture: 'border'
          });
          i++;
        }
      }
    }

    // texts
    this.scoreText = this.add.bitmapText(
      this.gameWidth / 2 - 20,
      0,
      'pcsenior',
      CONST.P1_SCORE + ' : ' + CONST.P2_SCORE,
      8
    );

    this.particle = this.add.particles('textures', 'debris.png')
    this.waitingSceneEnd = false;
  }

  update(time: number): void {
    if (!this.waitingSceneEnd) {
      for (let wall of this.gameBorder) {
        wall.update();
      }
      if (this.tick === 0) {
        this.tick = time;
      }

      if (!this.player.isDead() && !this.playerTwo.isDead()) {
        if (time - this.tick > 200) {
          this.player.move();
          this.playerTwo.move();
          this.player.grow();
          this.playerTwo.grow();
          this.checkCollision();
          this.tick = time;
        }
        this.player.handleInput();
        this.playerTwo.handleInput();
      } else {
        if (this.player.isDead()) {
          CONST.P2_SCORE++;
          this.particle.createEmitter({
            x: this.player.getHead().x,
            y: this.player.getHead().y,
            speedY: { min: -100, max: 100 },
            speedX: { min: -100, max: 100 },
            //angle: -90,
            //gravityY: 2338,
            maxParticles: 4
          })
          this.add.tween({
            targets:this.player.getHead(),
            alpha:0,
            duration:100,
            repeat:5,
            yoyo:true
          })
        } else {
          CONST.P1_SCORE++;
          this.particle.createEmitter({
            x: this.playerTwo.getHead().x,
            y: this.playerTwo.getHead().y,
            speedY: { min: -100, max: 100 },
            speedX: { min: -100, max: 100 },
            //angle: -90,
            //gravityY: 2338,
            maxParticles: 4
          })
          this.add.tween({
            targets:this.playerTwo.getHead(),
            alpha:0,
            duration:100,
            repeat:5,
            yoyo:true
          })
        }

        this.scoreText.setText(CONST.P1_SCORE + ' : ' + CONST.P2_SCORE);

        if (CONST.P1_SCORE === 6 || CONST.P2_SCORE === 6) {
          this.waitingSceneEnd = true
          this.time.delayedCall(1000, () => {
            this.scene.start('MainMenuScene')
          })
        } else {
          this.waitingSceneEnd = true
          this.time.delayedCall(1000, () => {
            this.scene.restart()
          })
        }
      }
    }
  }

  private checkCollision(): void {
    // border <-> snake collision
    for (let i = 0; i < this.gameBorder.length; i++) {
      if (
        this.player.getHead().x === this.gameBorder[i].x &&
        this.player.getHead().y === this.gameBorder[i].y
      ) {
        this.player.setDead(true);
      }

      if (
        this.playerTwo.getHead().x === this.gameBorder[i].x &&
        this.playerTwo.getHead().y === this.gameBorder[i].y
      ) {
        this.playerTwo.setDead(true);
      }
    }

    // check snake <-> snake collision
    let playerOneBody = this.player.getBody();
    let bodiesMerged = playerOneBody.concat(this.playerTwo.getBody());

    for (let i = 0; i < bodiesMerged.length; i++) {
      if (
        this.player.getBody().length > 1 &&
        this.player.getHead().x === bodiesMerged[i].x &&
        this.player.getHead().y === bodiesMerged[i].y
      ) {
        this.player.setDead(true);
      }

      if (
        this.playerTwo.getBody().length > 1 &&
        this.playerTwo.getHead().x === bodiesMerged[i].x &&
        this.playerTwo.getHead().y === bodiesMerged[i].y
      ) {
        this.playerTwo.setDead(true);
      }
    }
  }

  private rndXPos(): number {
    return (
      Phaser.Math.RND.between(1, this.horizontalFields - 1) * CONST.FIELD_SIZE
    );
  }

  private rndYPos(): number {
    return (
      Phaser.Math.RND.between(1, this.verticalFields - 1) * CONST.FIELD_SIZE
    );
  }
}
