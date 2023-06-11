// 3. Shootout at airstrip
//     - Quiet and tense, Changing lighting from airplanes
//     - Randomly spawned enemy
//     - Light: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/point-light/
//     - Physics and Particles: https://github.com/nathanaltice/PartyCoolFX/blob/master/src/scenes/ArcadeCollide.js
//     - Tilemap https://github.com/elihawley/Tilemap-Tutorial/blob/main/src/Overworld.js

class AirstripPlay extends Phaser.Scene {
    constructor() {
        super('airstripPlayScene');

        this.VEL = 100;

        this.AIRPLANE_LIGHT_X = -100
        this.AIRPLANE_LIGHT_INITIAL_Y = H + 250
        this.AIRPLANE_LIGHT_FINAL_Y = -250
    }

    preload() {
        // load assets
        this.load.path = "./assets/";

        // load images
        this.load.image('tilesetImage', 'img/city-tileset.png');
        this.load.tilemapTiledJSON('airstripTilemapJSON', 'json/airstrip-tilemap.json');
        this.load.spritesheet('cop', 'img/cop-spritesheet.png', { frameWidth: 34, frameHeight: 34 })
        this.load.spritesheet('robber', 'img/robber-spritesheet.png', { frameWidth: 34, frameHeight: 34 })
    }

    create() {
        // Set up lighting
        this.lights.enable()
        this.lights.setAmbientColor(0x2F2F2F)
        this.airplaneLight = this.lights.addLight(this.AIRPLANE_LIGHT_X, this.AIRPLANE_LIGHT_INITIAL_Y, W - 50, 0xFFFFFF, 2)

        // Set up airplaneLightTween
        this.airplaneLightTween = this.tweens.add({
            targets: this.airplaneLight,
            y: {
                from: this.AIRPLANE_LIGHT_INITIAL_Y,
                to: this.AIRPLANE_LIGHT_FINAL_Y,
            },
            duration: 4000,
            ease: 'Linear',
            repeat: 0,
            persist: true,
        })

        // Set up tileset
        const map = this.add.tilemap('airstripTilemapJSON');
        const tileset = map.addTilesetImage('city-tileset', 'tilesetImage');
        const bgLayer = map.createLayer('Background', tileset, 0, 0).setPipeline('Light2D');
        const terrainLayer = map.createLayer('Terrain', tileset, 0, 0).setPipeline('Light2D');
        const decorationLayer = map.createLayer('Decoration', tileset, 0, 0).setDepth(10).setPipeline('Light2D');

        // Set up spawns
        const copSpawn = map.findObject('Spawns', obj => obj.name === 'copSpawn')
        let robberSpawnNumber = Math.floor(Math.random() * 5)
        const robberSpawn = map.findObject('Spawns', obj => obj.name === `robberSpawn${robberSpawnNumber}`)

        // Spawn characters
        this.cop = this.physics.add.sprite(copSpawn.x, copSpawn.y, 'cop', 0).setPipeline('Light2D');
        this.robber = this.physics.add.sprite(robberSpawn.x, robberSpawn.y, 'robber', 0).setPipeline('Light2D');
        this.cop.body.setCollideWorldBounds(true);
        this.robber.body.setCollideWorldBounds(true);

        // Set world bounds
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

        // All tiles in terrain layer will collide
        terrainLayer.setCollisionByExclusion([-1]);
        this.physics.add.collider(this.cop, terrainLayer)



        // logic
        this.cursors = this.input.keyboard.createCursorKeys();
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.cop, true, 0.25, 0.25);

        this.gameOver = false;

        this.airplaneLightClock = this.time.addEvent({
            callback: () => {
                if (this.gameOver) {
                    this.airplaneLightClock.remove();
                }

                this.airplaneLightTween.play();
                this.sound.play('sfx_airplane');

            },
            callbackScope: this,
            delay: 12000,
            loop: true,
        });

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

            // Cop Movement
            this.copDirection = new Phaser.Math.Vector2(0);
            if (this.cursors.left.isDown) {
                this.copDirection.x = -1;
            } else if (this.cursors.right.isDown) {
                this.copDirection.x = 1;
            }
            if (this.cursors.up.isDown) {
                this.copDirection.y = -1;
            } else if (this.cursors.down.isDown) {
                this.copDirection.y = 1;
            }

            this.copDirection.normalize();
            this.cop.setVelocity(this.VEL * this.copDirection.x, this.VEL * this.copDirection.y);

        }

    }
}
