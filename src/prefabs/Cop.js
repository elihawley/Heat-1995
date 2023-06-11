class Cop extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bat');
        this.scale = 1.5;
        scene.add.existing(this);
        // this.angle = -.05 + Math.random() * .1;
        
        this.moveSpeed = 6;

        this.scene = scene;
    }

    update() {

        // move left and right
        if (keyLEFT.isDown && this.x >= borderUISize + this.width){ // && this.checkCollision(this, )) { missing collision check between characters &
            this.x -= this.moveSpeed;
        } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
            this.x += this.moveSpeed;
        }

        // move up and down
        if (keyUP.isDown && this.y >= borderUISize + this.height) {
            this.y += this.moveSpeed;
        } else if (keyDOWN.isDown && this.y >= this.height) {
            this.y -= this.moveSpeed;
        }
    }

    resetToSpawnArea() {
        this.x = game.config.width - borderUISize - borderPadding;
        this.y = (Math.random() < .5) ? (4*borderUISize + 2*borderPadding) : (game.config.height - 2*borderUISize - 2*borderPadding);
        this.visible = true;
        this.moveSpeed = 1 + Math.random() * this.scene.speedMultiplier;
    }
}
