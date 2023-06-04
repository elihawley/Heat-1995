# Heat-1995

Notes...
1. Restaurant Convo
    - Both main characters meet for first time
    - Seemingly friendly convo over coffee (dialog), depending on what player chooses to say -> different ending (shoot vs end dialog?)
    - Text + Tweening: https://github.com/nathanaltice/Dialogging
    - Camera Effects: https://github.com/nathanaltice/CameraLucida/blob/master/src/scenes/FourViews.js
2. Shootout outside of bank
    - Hostage scene? 
        - Camera Effects: https://github.com/nathanaltice/CameraLucida/blob/master/src/scenes/FourViews.js
            - camera fadein/fadeout and slight wobble/shake for stress
            - camera flash when shooting
        - 'fire' key needs to be held down for a duration
            `var keyObj = scene.input.keyboard.addKey('W');  // Get key object
            var isDown = scene.input.keyboard.checkDown(keyObj, duration);` from https://rexrainbow.github.io/phaser3-rex-notes/docs/site/keyboardevents/
        - Spritesheet Animation
3. Shootout at airstrip
    - Quiet and tense, Changing lighting from airplanes
    - Light: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/point-light/
    - Physics and Particles: https://github.com/nathanaltice/PartyCoolFX/blob/master/src/scenes/ArcadeCollide.js
    - Tilemap https://github.com/elihawley/Tilemap-Tutorial/blob/main/src/Overworld.js
