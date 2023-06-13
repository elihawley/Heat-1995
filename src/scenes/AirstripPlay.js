// 3. Shootout at airstrip
//     - Quiet and tense, Changing lighting from airplanes
//     - Randomly spawned enemy
//     - Light: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/point-light/
//     - Physics and Particles: https://github.com/nathanaltice/PartyCoolFX/blob/master/src/scenes/ArcadeCollide.js
//     - Tilemap https://github.com/elihawley/Tilemap-Tutorial/blob/main/src/Overworld.js

class AirstripPlay extends Phaser.Scene {
    constructor() {
        super('airstripPlayScene');

        this.DBOX_FONT = 'gem_font';	// dialog box font key
        this.TEXT_SIZE = 14;		// text font size (in pixels)

        this.COP_VEL = 100;
        this.BULLET_VEL = 1000;

        this.AIRPLANE_LIGHT_X = -100
        this.AIRPLANE_LIGHT_INITIAL_Y = H + 250
        this.AIRPLANE_LIGHT_FINAL_Y = -250

        this.BULLET_OFFSCREEN_X = 15;
        this.BULLET_OFFSCREEN_Y = 15;
    }

    preload() {
        // load assets
        this.load.path = "./assets/";

        // load images
        this.load.image('tilesetImage', 'img/city-tileset.png');
        this.load.tilemapTiledJSON('airstripTilemapJSON', 'json/airstrip-tilemap.json');
        this.load.spritesheet('cop', 'img/cop-spritesheet.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('robber', 'img/robber-spritesheet.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('bullet', 'img/bullet.png', { frameWidth: 4, frameHeight: 4 })
        this.load.spritesheet('blood_particle', 'img/blood-particle.png', { frameWidth: 4, frameHeight: 4 })
    }

    create() {
        // Set up BGM
        this.bgm = this.sound.add("bgm_again", {volume: 1, loop: true});
        this.bgm.play();

        // Set up lighting
        this.lights.enable()
        this.lights.setAmbientColor(0x2F2F2F)
        this.airplaneLight = this.lights.addLight(this.AIRPLANE_LIGHT_X, this.AIRPLANE_LIGHT_INITIAL_Y, W + 100, 0xFFFFFF, 4)

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
        this.physics.add.collider(this.cop, terrainLayer);



        // logic
        this.cursors = this.input.keyboard.createCursorKeys();
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)

        this.cameras.main.setZoom(2);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.cop, true, 0.25, 0.25);

        this.gameOver = false;

        this.airplaneLightClock = this.time.addEvent({
            callback: () => {
                if (this.gameOver) {
                    this.airplaneLightClock.remove();
                }

                this.airplaneLightTween.play();
                this.sound.play('sfx_airplane', {volume: 1.2});

            },
            callbackScope: this,
            delay: 9000,
            loop: true,
        });


        // Shooting Physics
        this.bullet = this.physics.add.sprite(this.BULLET_OFFSCREEN_X, this.BULLET_OFFSCREEN_Y, 'bullet', 0).setPipeline('Light2D');
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

        this.sound.play('sfx_airplane', {volume: 1.2});
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
}
