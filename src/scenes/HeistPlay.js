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

        this.DBOX_FONT = 'gem_font';	// dialog box font key
        this.TEXT_SIZE = 14;		// text font size (in pixels)

        this.COP_VEL = 100;
        this.BULLET_VEL = 1000;

        this.BULLET_OFFSCREEN_X = 15;
        this.BULLET_OFFSCREEN_Y = 15;
    }

    preload() {
        // load assets
        this.load.path = "./assets/";

        // load images
        this.load.image('tilesetImage', 'img/city-tileset.png');
        this.load.tilemapTiledJSON('heistTilemapJSON', 'json/heist-tilemap.json');
        this.load.spritesheet('cop', 'img/cop-spritesheet.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('robber', 'img/robber-spritesheet.png', { frameWidth: 32, frameHeight: 32 })

        this.load.spritesheet('bullet', 'img/bullet.png', { frameWidth: 4, frameHeight: 4 })
        this.load.spritesheet('blood_particle', 'img/blood-particle.png', { frameWidth: 4, frameHeight: 4 })
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
        this.physics.add.collider(this.cop, terrainLayer);


        // Set up Camera and Camera Effects
        this.cameras.main.setZoom(2);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.cop, true, 0.25, 0.25);

        // Each effect is assigned a number.
        // Every time triggerCamFX is called, the list will be shuffled and a random number of effects will be chosen.
        // 0: this.barrelFX
        // 1: this.bloomFX
        // 2: this.circleFX
        // 3: this.pixelateFX
        // 4: flash
        // 5: rotateTo
        // 6: shake
        this.camFXList = [0,1,2,3,4,5,6]

        this.CameraFXClock = this.time.addEvent({
            delay: 2500,
            callback: this.triggerCamFX,
            callbackScope: this,
            loop: true
        })


        // Set up input
        this.cursors = this.input.keyboard.createCursorKeys();
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)

        this.gameOver = false;

        // Shooting Physics
        this.bullet = this.physics.add.sprite(this.BULLET_OFFSCREEN_X, this.BULLET_OFFSCREEN_Y, 'bullet', 0);
        this.bullet.setCollideWorldBounds(true);
        this.bullet.body.onWorldBounds = true;

        // check bullet collisions
        this.physics.world.on('worldbounds', (body) => {
            if (body.gameObject.texture.key === 'bullet') {
                this.bullet.x = this.BULLET_OFFSCREEN_X;
                this.bullet.y = this.BULLET_OFFSCREEN_Y;
            }
        });
        this.physics.add.collider(this.bullet, terrainLayer, () => {
            this.bullet.x = this.BULLET_OFFSCREEN_X
            this.bullet.y = this.BULLET_OFFSCREEN_Y
        }, () => true, this);
        
        this.physics.add.collider(this.bullet, this.robber, () => {
            this.sound.play('sfx_hit');
            this.add.particles(this.robber.x, this.robber.y, 'blood_particle', {
                tint: { start: 0xf00f00, end: 0xce1c1c },
                scale: { start: 0.25, end: 0.5 },
                speed: 50,
                lifespan: 500,
                maxParticles: 10,
                blendMode: 'ADD'
            })
            this.cop.setVelocity(0, 0);
            this.bullet.x = this.BULLET_OFFSCREEN_X
            this.bullet.y = this.BULLET_OFFSCREEN_Y
            this.gameOver = true;
        }, () => true, this);
        
        this.cop.anims.create({
            key: 'anim_cop_shoot',
            frames: this.anims.generateFrameNumbers('cop', {start: 0, end: 1}),
            yoyo: true,
        })

    }

    update() {

        if (this.gameOver) {
            this.sound.play('sfx_gameover', {volume: .5});
            const {x:camX, y:camY} = this.cameras.main.getWorldPoint(this.cameras.main.centerX, this.cameras.main.centerY);
            this.add.bitmapText(camX, camY - 32, this.DBOX_FONT, 'GAME OVER', this.TEXT_SIZE).setOrigin(.5);
            this.add.bitmapText(camX, camY, this.DBOX_FONT, 'Press (R) to Restart or <- for Menu', this.TEXT_SIZE).setOrigin(.5);
        }
        if (this.gameOver && this.cursors.left.isDown) {
            this.sound.stopAll();
            this.scene.start("menuScene");
        }
        if (this.gameOver && keyR.isDown) {
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
                this.copFacingX = -1;
                this.copFacingY = 0;
                this.cop.angle = 270;
                this.bullet.angle = 270;
            } else if (this.cursors.right.isDown) {
                this.copDirection.x = 1;
                this.copFacingX = 1;
                this.copFacingY = 0;
                this.cop.angle = 90;
                this.bullet.angle = 90;
            }
            if (this.cursors.up.isDown) {
                this.copDirection.y = -1;
                this.copFacingY = -1;
                this.copFacingX = 0;
                this.cop.angle = 0;
                this.bullet.angle = 0;
            } else if (this.cursors.down.isDown) {
                this.copDirection.y = 1;
                this.copFacingY = 1;
                this.copFacingX = 0;
                this.cop.angle = 180;
                this.bullet.angle = 180;
            }

            this.copDirection.normalize();
            this.cop.setVelocity(this.COP_VEL * this.copDirection.x, this.COP_VEL * this.copDirection.y);

            // Shooting
            if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
                this.bullet.x = this.cop.x + 14;
                this.bullet.y = this.cop.y - 14;

                this.sound.play('sfx_shoot');
                this.cop.play('anim_cop_shoot');

                this.bulletDirection = new Phaser.Math.Vector2(0);
                this.bulletDirection.y = 1;
                this.bulletDirection.x = this.copFacingX;
                this.bulletDirection.y = this.copFacingY;
                this.bulletDirection.normalize();
                this.bullet.setVelocity(this.BULLET_VEL * this.bulletDirection.x, this.BULLET_VEL * this.bulletDirection.y);
            }

        }

    }

    triggerCamFX() {
        this.cameras.main.postFX.clear();
        this.shuffleArray(this.camFXList)

        const numEffects = Math.floor(Math.random() * 7) + 1;

        const chosenEffects = this.camFXList.slice(0, numEffects);

        if (chosenEffects.includes(0)) {
            this.cameras.main.postFX.addBarrel(2);
        }
        if (chosenEffects.includes(1)) {
            this.cameras.main.postFX.addBloom(0xffffff);
        }
        if (chosenEffects.includes(2)) {
            this.cameras.main.postFX.addCircle(8, 0xF00F00);
        }
        if (chosenEffects.includes(3)) {
            this.cameras.main.postFX.addPixelate(2);
        }
        if (chosenEffects.includes(4)) {
            const r = Phaser.Math.RND.integerInRange(0, 255);
            const g = Phaser.Math.RND.integerInRange(0, 255);
            const b = Phaser.Math.RND.integerInRange(0, 255);
            this.cameras.main.flash(1000, r, g, b, false)
        }
        if (chosenEffects.includes(5)) {
            const radianRotation = Phaser.Math.FloatBetween(-Math.PI / 8, Math.PI / 8);
            this.cameras.main.rotateTo(radianRotation, false, 1500/2, "Sine.easeInOut");
        }
        if (chosenEffects.includes(6)) {
            const randomIntensity = Phaser.Math.FloatBetween(0, .075);
            this.cameras.main.shake(1000, randomIntensity, false);
        }
    
    }

    // From https://stackoverflow.com/a/12646864
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}
