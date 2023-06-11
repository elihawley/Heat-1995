class AirstripPlay extends Phaser.Scene {
    constructor () {
        super('playScene');
    }

    preload() {
        this.load.spritesheet('airstrip', './assets/airstripbackground.png');
        this.load.image('cop', './assets/Cop.js');
        this.load.image('robber', './assets/Robber.js');
        this.load.image('box1', './assets/box1.png')
    }

    create() {
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)

        this.airstrip = this.add.tileSprite(0, 0, 800, 800, 'airstrip').setOrigin(0, 0);

        this.cop = new Cop(this, borderUISize + borderPadding, game.config.height - borderUISize - borderPadding - (30*1.5), 'cop').setOrigin(1, 0);
        this.robber = new Robber(this, borderUISize + borderPadding, game.config.height - borderUISize - borderPadding - (30*1.5), 'robber').setOrigin(700, 700);

    
        // logic
        this.gameOver = false;
    }

    update() {
        if (this.gameOver) {
            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', this.textConfig).setOrigin(.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart', this.textConfig).setOrigin(.5);
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (!this.gameOver) {
            this.cop.update();
            this.robber.update();
        }

        if (this.checkCollision(cop, obstacles)) {
                for (const obstacle of obstacles) {
                    if (obstacle.visible) {
                        if (cop.x < obstacle.x + obstacle.displayWidth &&
                            cop.x + cop.displayWidth > obstacle.x &&
                            cop.y < obstacle.y + obstacle.displayHeight && 
                            cop.displayHeight + cop.y > obstacle.y) {
                                this.gameOver = true;
                        }
                    }
                }
        }
    }
}
