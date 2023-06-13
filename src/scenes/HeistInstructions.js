class HeistInstructions extends Phaser.Scene {
    constructor() {
        super("heistInstructionsScene");
    }

    preload() {
        // load assets
        this.load.path = "./assets/";

        // load sounds
        this.load.audio('bgm_vengeance', 'bgm/Vengeance.mp3');
        this.load.audio('sfx_select', 'sfx/select.wav');
        this.load.audio('sfx_shoot', 'sfx/shoot.wav');
        this.load.audio('sfx_hit', 'sfx/hit.wav');
        this.load.audio('sfx_gameover', 'sfx/gameover.wav');
    }

    create() {
        // add title text
        this.add.bitmapText(CENTER_X, CENTER_Y - 64, 'gem_font', 'BANK SCENE', 32).setOrigin(0.5);
        this.add.bitmapText(CENTER_X, CENTER_Y - 32, 'gem_font', 'Fight under pressure', 32).setOrigin(0.5);
        this.add.bitmapText(CENTER_X, CENTER_Y + 32, 'gem_font', 'Use arrow keys to move and SPACE to shoot', 16).setOrigin(0.5);
        this.add.bitmapText(CENTER_X, CENTER_Y + 64, 'gem_font', 'Hold ESC to leave game.', 16).setOrigin(0.5);
        this.add.bitmapText(CENTER_X, CENTER_Y + 96, 'gem_font', 'Press SPACE to start', 16).setOrigin(0.5);
        this.add.bitmapText(CENTER_X, CENTER_Y + 128, 'gem_font', 'Press LEFT to return', 16).setOrigin(0.5);

        // create input
        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // wait for player input
        if(Phaser.Input.Keyboard.JustDown(cursors.space)) {
            this.sound.play('sfx_select');
            this.scene.start("heistPlayScene");
        }
        else if(Phaser.Input.Keyboard.JustDown(cursors.left)) {
            this.sound.play('sfx_select');
            this.scene.start("menuScene");
        }
    }
}