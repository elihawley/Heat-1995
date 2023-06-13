// 2. Shootout outside of bank
//     - Randomly spawned enemy
//     - One shot; distracted by pressure
//         - Camera Effects: https://github.com/nathanaltice/CameraLucida/blob/master/src/scenes/FourViews.js
//             - camera fadein/fadeout and slight wobble/shake for stress
//             - camera flash when shooting
//         - 'fire' key needs to be held down for a duration
//             `var keyObj = scene.input.keyboard.addKey('W');  // Get key object
//             var isDown = scene.input.keyboard.checkDown(keyObj, duration);` from https://rexrainbow.github.io/phaser3-rex-notes/docs/site/keyboardevents/
//         - Spritesheet Animation

class HeistPlay extends Phaser.Scene {
    constructor() {
        super('heistPlayScene');

        this.VEL = 100;
    }

    preload() {
        // load assets
        this.load.path = "./assets/";

        // load images
        this.load.image('tilesetImage', 'img/city-tileset.png');
        this.load.tilemapTiledJSON('heistTilemapJSON', 'json/heist-tilemap.json');
        this.load.spritesheet('cop', 'img/cop-spritesheet.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('robber', 'img/robber-spritesheet.png', { frameWidth: 32, frameHeight: 32 })
    }

    create() {
        // Set up BGM
        this.bgm = this.sound.add("bgm_vengeance", {volume: 1, loop: true});
        this.bgm.play();

        // Set up tileset
        const map = this.add.tilemap('heistTilemapJSON');
        const tileset = map.addTilesetImage('city-tileset', 'tilesetImage');
        const bgLayer = map.createLayer('Background', tileset, 0, 0);
        const terrainLayer = map.createLayer('Terrain', tileset, 0, 0);
        const decorationLayer = map.createLayer('Decoration', tileset, 0, 0).setDepth(10);

        // Set up spawns
        const copSpawn = map.findObject('Spawns', obj => obj.name === 'copSpawn')
        let robberSpawnNumber = Math.floor(Math.random() * 6)
        const robberSpawn = map.findObject('Spawns', obj => obj.name === `robberSpawn${robberSpawnNumber}`)

        // Spawn characters
        this.cop = this.physics.add.sprite(copSpawn.x, copSpawn.y, 'cop', 0);
        this.robber = this.physics.add.sprite(robberSpawn.x, robberSpawn.y, 'robber', 0);
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
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)

        this.cameras.main.setZoom(2);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.cop, true, 0.25, 0.25);

        this.gameOver = false;

    }

    update() {

        if (this.gameOver) {
            this.sound.play('sfx_gameover', {volume: .5});
            this.add.bitmapText(CENTER_X, CENTER_Y - 32, this.DBOX_FONT, 'GAME OVER', this.TEXT_SIZE).setOrigin(.5);
            this.add.bitmapText(CENTER_X, CENTER_Y, this.DBOX_FONT, 'Press (R) to Restart or <- for Menu', this.TEXT_SIZE).setOrigin(.5);
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(cursors.left)) {
            this.sound.stopAll();
            this.scene.start("menuScene");
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.sound.stopAll();
            this.scene.restart();
        }

        if (keyESC.isDown && !Phaser.Input.Keyboard.DownDuration(keyESC, 1500)) {
            this.sound.stopAll();
            this.scene.start("menuScene");
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
