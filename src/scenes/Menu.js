class Menu extends Phaser.Scene {
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
            backgroundColor: 'brown',
            color: 'white',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0,
        };


        let t = this.add.text(game.config.width / 2, game.config.height / 3 - borderUISize * 2 - borderPadding * 2, 'GRAVITY RUNNER', menuConfig).setOrigin(.5);
        let t1 = this.add.text(game.config.width / 2, game.config.height / 2, 'Use (G) to change gravity. Avoid the bats!', menuConfig).setOrigin(.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(game.config.width / 2, game.config.height / 2 + borderUISize * 2 + borderPadding, 'Press <- for Novice or -> for Expert', menuConfig).setOrigin(.5);
        this.add.text(game.config.width / 2, game.config.height / 2 + borderUISize * 4 + borderPadding, 'Press (C) to see credits', menuConfig).setOrigin(.5);

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings = {
                speedMultiplier: 1,
                waveDifficultyLevel: 1,
            };
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
         else if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard mode
            game.settings = {
                speedMultiplier: 2,
                waveDifficultyLevel: 30,
            };
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
        else if (Phaser.Input.Keyboard.JustDown(keyC)) {
            // credits
            this.sound.play('sfx_select');
            this.scene.start('creditsScene');
        }
    }
}
