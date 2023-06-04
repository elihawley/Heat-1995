class Credits extends Phaser.Scene {
    constructor() {
        super('creditsScene');
    }

    create() {
        let menuConfig = {
            fontFamily: 'Georgia',
            fontSize: '12px',
            backgroundColor: 'brown',
            color: 'white',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0,
        };


        this.add.text(game.config.width / 2, borderUISize * 2 + borderPadding, 'CREDITS', menuConfig).setOrigin(.5);
        this.add.text(game.config.width / 2, borderUISize * 4 + borderPadding, 'Press (C) to return', Object.assign({}, menuConfig, {backgroundColor: '#00FF00', color: '#000'})).setOrigin(.5);
        this.add.text(game.config.width / 2, borderUISize * 6 + borderPadding*4, 'Developer: Elia Hawley', menuConfig).setOrigin(.5);
        this.add.text(game.config.width / 2, borderUISize * 8 + borderPadding*4, 'Assets: Asesprite', menuConfig).setOrigin(.5);
        this.add.text(game.config.width / 2, borderUISize * 10 + borderPadding*4, 'Music: JDSherbert', menuConfig).setOrigin(.5);
        this.add.text(game.config.width / 2, borderUISize * 12 + borderPadding*4, 'SFX: jsfxr', menuConfig).setOrigin(.5);

        keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyC)) {
            this.sound.play('sfx_select');
            this.scene.start('menuScene');
        }
    }
}
