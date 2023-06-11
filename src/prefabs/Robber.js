class Robber extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        this.scale = 1.5;
        scene.add.existing(this);

        this.moveSpeed = 6;

        this.scene = scene;
    }

    update() {
        // Movement

        // Toggle Gravity

    }
}
