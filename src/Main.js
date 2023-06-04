/**
 * Elia Hawley
 * Heat 1995
 * Phase Components:
 *  1. Physics system
 *  2. Camera effects
 *  3. Lighting
 *  4. Particle effects
 *  5. Text objects
 *  6. Animation manager
 *  7. Tilemaps
 *  8. Timers
 *  9. Tweening
 * Creative tilt:
 *  - TODO
 */

let config = {
    type: Phaser.WEBGL,
    render: {
        pixelArt: true,
    },
    width: 400,
    height: 400,
    physics: {
        default: 'arcade',
    },
    scene: [ Menu, RestaurantInstructions, RestaurantPlay, BankInstructions, BankPlay, AirstripInstructions, AirstripPlay, Credits ],
};

let game = new Phaser.Game(config);

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let cursors, keyG, keyR, keyC;
