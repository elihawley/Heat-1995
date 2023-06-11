class AirstripInstructions extends Phaser.Scene {
    constructor() {
        super("airstripInstructionsScene");
    }

    preload() {
        // load assets
        this.load.path = "./assets/";

        // load images
        this.load.image('tilesetImage', 'city-tileset.png');
        this.load.tilemapTiledJSON('tilemapJSON', 'json/airstrip-tilemap.json');
        this.load.spritesheet('cop', 'cop-spritesheet.png', { frameWidth: 16, frameHeight: 16 })
        this.load.spritesheet('robber', 'robber-spritesheet.png', { frameWidth: 16, frameHeight: 16 })

        // load sounds
        this.load.audio('bgm_again', 'bgm/Again.mp3');
        this.load.audio('sfx_select', 'sfx/select.wav');
        this.load.audio('sfx_shoot', 'sfx/shoot.wav');
        this.load.audio('sfx_hit', 'sfx/hit.wav');
        this.load.audio('sfx_airplane', 'sfx/airplane.wav');
        this.load.audio('sfx_gameover', 'sfx/gameover.wav');

        // load bitmap font
        this.load.bitmapFont('gem_font', 'font/gem.png', 'font/gem.xml');
    }

    create() {
        this.bgm = this.sound.add("bgm_again", {volume: 1, loop: true});
        // this.bgm.play();

        // add title text
        this.add.bitmapText(centerX, centerY - 64, 'gem_font', 'AIRSTRIP SCENE', 32).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY - 32, 'gem_font', 'Fight in the darkness', 32).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY, 'gem_font', 'Use arrow keys to move and SPACE to shoot', 16).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + 32, 'gem_font', 'Press SPACE to start', 16).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + 64, 'gem_font', 'Press LEFT to return', 16).setOrigin(0.5);

        // create input
        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(cursors.space)) {
            this.sound.play('sfx_select');
            this.scene.start("airstripPlayScene");
        }
        else if(Phaser.Input.Keyboard.JustDown(cursors.left)) {
            // this.bgm.stop();
            this.sound.play('sfx_select');
            this.scene.start("menuScene");
        }
    }
}