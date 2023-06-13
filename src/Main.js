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
 *  - Airstrip Scene: Lighting and airplane sound that mimics the Doppler effect of a passing plane
 */

let config = {
    type: Phaser.WEBGL,
    render: {
        pixelArt: true,
    },
    width: 800,
    height: 512,
    physics: {
        default: 'arcade',
    },

    scene: [ Menu, RestaurantInstructions, RestaurantPlay, HeistInstructions, HeistPlay, AirstripInstructions, AirstripPlay, Credits ],
};

let game = new Phaser.Game(config);

const CENTER_X = game.config.width / 2
const CENTER_Y = game.config.height / 2
const W = game.config.width
const H = game.config.height

let cursors, keyR, keyC, keyESC;
