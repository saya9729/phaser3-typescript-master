import { CONST } from '../const/const';

export class MainMenuScene extends Phaser.Scene {
  private startKey: Phaser.Input.Keyboard.Key;
  private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];
  private circleGraphic: Phaser.GameObjects.Graphics;
  private circleGeom: Phaser.Geom.Circle;

  constructor() {
    super({
      key: 'MainMenuScene'
    });
  }

  init(): void {
    this.startKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.P
    );

    CONST.P1_SCORE = 0;
    CONST.P2_SCORE = 0;
  }

  preload(): void {
    this.load.atlas('textures','assets/textures/texture_bundle.png','assets/textures/texture_bundle.json')
    this.load.bitmapFont(
      'pcsenior',
      './assets/font/pcsenior.png',
      './assets/font/pcsenior.fnt'
    );
  }

  create(): void {
    this.circleGraphic = this.add.graphics({
      x: 0,
      y: 0,
      fillStyle: { color: 0xff00ff, alpha: 1 }
    });

    this.circleGeom = new Phaser.Geom.Circle(152, 105, 8);
    this.circleGraphic.fillCircleShape(this.circleGeom);

    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 28,
        this.sys.canvas.height / 2 - 10,
        'pcsenior',
        'PLAY  P',
        8
      )
    );

    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 60,
        this.sys.canvas.height / 2 - 60,
        'pcsenior',
        'BLOCKADE',
        16
      )
    );
  }

  update(): void {
    if (this.startKey.isDown) {
      this.scene.start('GameScene');
    }
  }
}
