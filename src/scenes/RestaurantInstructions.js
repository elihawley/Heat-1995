class RestaurantInstructions extends Phaser.Scene {
    constructor() {
        super("restaurantInstructionsScene");
    }

    preload() {
        // load assets
        this.load.path = "./assets/";

        // load JSON (dialog)
        this.load.json('dialog', 'json/restaurant-dialog.json');

        // load images
        this.load.image('dialogbox', 'img/dialogbox.png');
        this.load.image('restaurant_background', 'img/restaurant-background.png');
        this.load.image('cop_front', 'img/cop-front.png');
        this.load.image('cop_side', 'img/cop-side.png');
        this.load.image('cop_smile', 'img/cop-smile.png');
        this.load.image('robber_front', 'img/robber-front.png');
        this.load.image('robber_side', 'img/robber-side.png');
        this.load.image('robber_smile', 'img/robber-smile.png');

        // load sounds
        this.load.audio('bgm_calamity', 'bgm/Calamity.wav');
        this.load.audio('sfx_select', 'sfx/select.wav');
        this.load.audio('sfx_type', 'sfx/type.wav');
        this.load.audio('sfx_hit', 'sfx/hit.wav');
        this.load.audio('sfx_gameover', 'sfx/gameover.wav');

        // load bitmap font
        this.load.bitmapFont('gem_font', 'font/gem.png', 'font/gem.xml');
    }

    create() {
        this.bgm = this.sound.add("bgm_calamity", {volume: 1, loop: true});
        // this.bgm.play();

        // add title text
        this.add.bitmapText(centerX, centerY - 64, 'gem_font', 'COFFEE SCENE', 32).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY - 32, 'gem_font', 'Make the right choice', 32).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY, 'gem_font', 'Use arrow keys and SPACE to select dialog options', 16).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + 32, 'gem_font', 'Press SPACE to start', 16).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + 64, 'gem_font', 'Press LEFT to return', 16).setOrigin(0.5);

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
            // this.bgm.stop();
            this.sound.play('sfx_select');
            this.scene.start("menuScene");
        }
    }
}