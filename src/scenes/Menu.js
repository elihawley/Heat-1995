class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }

    preload() {
        this.load.path = './assets/';
        this.load.audio('bgm_dubious', 'bgm/Dubious.mp3');
        this.load.audio('sfx_select', 'sfx/select.wav');
        this.load.audio('sfx_gameover', 'sfx/gameover.wav');

        this.load.bitmapFont('gem_font', 'font/gem.png', 'font/gem.xml');
    }

    create() {
        this.bgm = this.sound.add("bgm_dubious", {volume: 1, loop: true});
        // this.bgm.play();

        const centerX = game.config.width / 2;
        const centerY = game.config.height / 2;

        this.add.bitmapText(centerX, centerY - 64, 'gem_font', 'HEAT (1995)', 32).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY - 32, 'gem_font', '(C) Credits', 32).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY, 'gem_font', '(LEFT) Restaurant Scene', 16).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + 32, 'gem_font', '(RIGHT) Heist Scene', 16).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + 64, 'gem_font', '(DOWN) Airstrip Scene', 16).setOrigin(0.5);

        // create input
        cursors = this.input.keyboard.createCursorKeys();
        keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(cursors.left)) {
            // this.bgm.stop();
            this.sound.play('sfx_select');
            this.scene.start('restaurantInstructionsScene');
        }
        else if (Phaser.Input.Keyboard.JustDown(cursors.right)) {
            // this.bgm.stop();
            this.sound.play('sfx_select');
            this.scene.start('heistInstructionsScene');
        }
        else if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
            // this.bgm.stop();
            this.sound.play('sfx_select');
            this.scene.start('airstripInstructionsScene');
        }
        else if (Phaser.Input.Keyboard.JustDown(keyC)) {
            this.sound.play('sfx_select');
            this.scene.start('creditsScene');
        }
    }
}
