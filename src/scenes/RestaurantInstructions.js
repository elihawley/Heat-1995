class RestaurantInstructions extends Phaser.Scene {
    constructor() {
        super("restaurantInstructionsScene");
    }

    preload() {
        // load assets
        this.load.path = "./assets/";

        // load sounds
        this.load.audio('sfx_select', 'sfx/select.wav');
        this.load.audio('bgm_calamity', 'bgm/Calamity.wav');
        this.load.audio('sfx_type', 'sfx/type.wav');
        this.load.audio('sfx_hit', 'sfx/hit.wav');
        this.load.audio('sfx_gameover', 'sfx/gameover.wav');

        // load bitmap font
        this.load.bitmapFont('gem_font', 'font/gem.png', 'font/gem.xml');
    }

    create() {
        // add title text
        this.add.bitmapText(CENTER_X, CENTER_Y - 64, 'gem_font', 'RESTAURANT SCENE', 32).setOrigin(0.5);
        this.add.bitmapText(CENTER_X, CENTER_Y - 32, 'gem_font', 'A famous conversation between rivals!', 32).setOrigin(0.5);
        this.add.bitmapText(CENTER_X, CENTER_Y + 32, 'gem_font', 'Use SPACE to continue dialog', 16).setOrigin(0.5);
        this.add.bitmapText(CENTER_X, CENTER_Y + 64, 'gem_font', 'Hold ESC to leave game', 16).setOrigin(0.5);
        this.add.bitmapText(CENTER_X, CENTER_Y + 96, 'gem_font', 'Press SPACE to start', 16).setOrigin(0.5);
        this.add.bitmapText(CENTER_X, CENTER_Y + 128, 'gem_font', 'Press LEFT to return', 16).setOrigin(0.5);

        // create input
        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // wait for player input
        if(Phaser.Input.Keyboard.JustDown(cursors.space)) {
            this.sound.play('sfx_select');
            this.scene.start("restaurantPlayScene");
        }
        else if(Phaser.Input.Keyboard.JustDown(cursors.left)) {
            this.sound.play('sfx_select');
            this.scene.start("menuScene");
        }
    }
}