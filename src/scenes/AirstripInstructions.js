class AirstripInstructions extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }

    preload() {
        this.load.audio('sfx_select', './assets/select.wav');
        this.load.audio('sfx_gameover', './assets/gameover.wav');
        this.load.audio('sfx_changegravity', './assets/changegravity.wav');
        this.load.audio('sfx_music', './assets/backgroundmusic.wav');
    }

    create() {
        let menuConfig = {
            fontFamily: 'Georgia',
            fontSize: '18px',
            color: 'white',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0,
        };


        let t = this.add.text(game.config.width / 2, game.config.height / 3 - borderUISize * 2 - borderPadding * 2, 'THE AIRSTRIP', menuConfig).setOrigin(.5);
        let t1 = this.add.text(game.config.width / 2, game.config.height / 2, 'Arrow Keys to move, good luck', menuConfig).setOrigin(.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(game.config.width / 2, game.config.height / 2 + borderUISize * 2 + borderPadding, 'Press P to begin', menuConfig).setOrigin(.5);
        
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyP)) {
            this.game.settings = {
                speedMultiplier: 1
             };
            this.scene.start('playScene');
        }
    }
}