class Credits extends Phaser.Scene {
    constructor() {
        super('creditsScene');
    }

    preload() {
        this.load.path = './assets/';
        this.load.audio('sfx_select', 'sfx/select.wav');

        this.load.bitmapFont('gem_font', 'font/gem.png', 'font/gem.xml');
    }

    create() {

        const centerX = game.config.width / 2;
        const centerY = game.config.height / 2;

        this.add.bitmapText(centerX, centerY - 64, 'gem_font', 'CREDITS', 32).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY - 32, 'gem_font', 'Press (C) to return', 32).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY, 'gem_font', 'Developer: Elia Hawley', 16).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + 32, 'gem_font', 'Images: ShatteredReality, Asesprite, GIMP', 16).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + 64, 'gem_font', 'Music: LunaLucid', 16).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + 96, 'gem_font', 'SFX: jsfxr, Audacity', 16).setOrigin(0.5);

        keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyC)) {
            this.sound.play('sfx_select');
            this.scene.start('menuScene');
        }
    }
}
