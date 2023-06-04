class Wizard extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        this.scale = 1.5;
        scene.add.existing(this);

        this.gravityOn = true;
        this.moveSpeed = 8;

        this.scene = scene;
    }

    update() {
        // Movement
        if (this.gravityOn && this.y <= (game.config.height - borderUISize - borderPadding - this.displayHeight)) {
            this.y += this.moveSpeed;
        } else if (!this.gravityOn && this.y >= (borderUISize + borderPadding + this.displayHeight)) {
            this.y -= this.moveSpeed;
        }

        // Toggle Gravity
        if (Phaser.Input.Keyboard.JustDown(keyG)) {
            this.gravityOn = !this.gravityOn;
            this.flipY = !this.flipY;
            this.scene.sound.play('sfx_changegravity');
        }
    }
}
