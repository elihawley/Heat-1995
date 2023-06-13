// 1. Restaurant Convo
//     - Both main characters meet for first time
//     - Seemingly friendly convo over coffee (dialog), depending on what player chooses to say -> different ending (shoot vs end dialog?)
//     - Text + Tweening: https://github.com/nathanaltice/Dialogging
//     - Camera Effects: https://github.com/nathanaltice/CameraLucida/blob/master/src/scenes/FourViews.js
class RestaurantPlay extends Phaser.Scene {
    constructor() {
        super("restaurantPlayScene");

        // dialog constants
        this.DBOX_X = 0;			    // dialog box x-position
        this.DBOX_Y = CENTER_Y + 50;			    // dialog box y-position
        this.DBOX_FONT = 'gem_font';	// dialog box font key

        this.TEXT_X = this.DBOX_X + 50;			// text w/in dialog box x-position
        this.TEXT_Y = this.DBOX_Y + 50;			// text w/in dialog box y-position
        this.TEXT_SIZE = 24;		// text font size (in pixels)
        this.TEXT_MAX_WIDTH = 715;	// max width of text within box

        this.NEXT_TEXT = '[SPACE]';	// text to display for next prompt
        this.NEXT_X = W - 45;			// next text prompt x-position
        this.NEXT_Y = H - 30;			// next text prompt y-position

        this.LETTER_TIMER = 20;		// # ms each letter takes to "type" onscreen

        this.tweenDuration = 100;

        this.COP_OFFSCREEN_X = -500;        // x,y values to place characters offscreen
        this.ROBBER_OFFSCREEN_X = W + 500;        // x,y values to place characters offscreen
        this.OFFSCREEN_Y = CENTER_Y + 25;
        this.COP_INSCREEN_X = 50;
        this.ROBBER_INSCREEN_X = W - 256 - 50;
    }

    preload() {
        // load assets
        this.load.path = "./assets/";

        // load JSON (dialog)
        this.load.json('dialog', 'json/restaurant-dialog.json');

        // load images
        this.load.image('dialogbox', 'img/dialogbox.png');
        this.load.image('restaurant_background', 'img/restaurant-background.png');
        this.load.image('cop_front', 'img/cop-front.png');
        this.load.image('cop_side', 'img/cop-side.png');
        this.load.image('cop_smile', 'img/cop-smile.png');
        this.load.image('robber_front', 'img/robber-front.png');
        this.load.image('robber_side', 'img/robber-side.png');
        this.load.image('robber_smile', 'img/robber-smile.png');
    }

    create() {
        // Background Music
        this.bgm = this.sound.add("bgm_calamity", {volume: 1, loop: true});
        this.bgm.play();

        // Background Image
        this.background = this.add.tileSprite(0, 0, W, H, 'restaurant_background').setOrigin(0, 0);

        // parse dialog from JSON file
        this.dialog = this.cache.json.get('dialog');

        // add dialog box sprite
        this.dialogbox = this.add.sprite(this.DBOX_X, this.DBOX_Y, 'dialogbox').setOrigin(0);

        // initialize dialog text objects (with no text)
        this.dialogText = this.add.bitmapText(this.TEXT_X, this.TEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE);
        this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE);

        // ready the character dialog images offscreen
        this.cop_front = this.add.sprite(this.COP_OFFSCREEN_X, this.OFFSCREEN_Y, 'cop_front').setOrigin(0, 1);
        this.cop_side = this.add.sprite(this.COP_OFFSCREEN_X, this.OFFSCREEN_Y, 'cop_side').setOrigin(0, 1);
        this.cop_smile = this.add.sprite(this.COP_OFFSCREEN_X, this.OFFSCREEN_Y, 'cop_smile').setOrigin(0, 1);
        this.robber_front = this.add.sprite(this.ROBBER_OFFSCREEN_X, this.OFFSCREEN_Y, 'robber_front').setOrigin(0, 1);
        this.robber_side = this.add.sprite(this.ROBBER_OFFSCREEN_X, this.OFFSCREEN_Y, 'robber_side').setOrigin(0, 1);
        this.robber_smile = this.add.sprite(this.ROBBER_OFFSCREEN_X, this.OFFSCREEN_Y, 'robber_smile').setOrigin(0, 1);

        // input
        cursors = this.input.keyboard.createCursorKeys();
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)

        // logic
        this.gameOver = false;

        // dialog variables
        this.dialogConvo = 0;			// current "conversation"
        this.dialogLine = 0;			// current line of conversation
        this.dialogSpeaker = null;		// current speaker
        this.dialogLastSpeaker = null;	// last speaker
        this.dialogTyping = false;		// flag while text is "typing"

        // start dialog
        this.nextLine();
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

        // check for spacebar press
        if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
            if(!this.gameOver && !this.dialogTyping) {
                // reached end of convo 
                if(this.dialogLine === this.dialog[this.dialogConvo].length) {
                    // reached end of last convo
                    if (this.dialogConvo === this.dialog.length - 1) {
                        this.gameOver = true;
                    }
                    // move to next convo
                    this.dialogLine = 0;
                    this.dialogConvo++;
                }
    
                if (!this.gameOver) {
                    this.nextLine();
                }
            }
            else if (!this.gameOver && this.dialogTyping) {
                // quick finish line
                this.dialogTyping = false;
                this.finishLine();
            }
        }
    }

    nextLine() {
        this.dialogTyping = true;

        // clear text
        this.dialogText.text = '';
        this.nextText.text = '';
        
        // set current speaker
        this.dialogSpeaker = this.dialog[this.dialogConvo][this.dialogLine]['speaker'];

        // check if there's a new speaker (for exit/enter animations)
        if(this.dialog[this.dialogConvo][this.dialogLine]['newSpeaker']) {
            // tween out prior speaker's image
            if(this.dialogLastSpeaker && this.dialogLastSpeaker.startsWith('cop_')) {
                this.tweens.add({
                    targets: this[this.dialogLastSpeaker],
                    x: this.COP_OFFSCREEN_X,
                    duration: this.tweenDuration,
                    ease: 'Linear'
                });
            }
            else if(this.dialogLastSpeaker && this.dialogLastSpeaker.startsWith('robber_')) {
                this.tweens.add({
                    targets: this[this.dialogLastSpeaker],
                    x: this.ROBBER_OFFSCREEN_X,
                    duration: this.tweenDuration,
                    ease: 'Linear'
                });
            }
            // tween in new speaker's image
            if(this.dialogSpeaker.startsWith('cop_')) {
                this.tweens.add({
                    targets: this[this.dialogSpeaker],
                    x: this.COP_INSCREEN_X,
                    duration: this.tweenDuration,
                    ease: 'Linear'
                });
            }
            else if(this.dialogSpeaker.startsWith('robber_')) {
                this.tweens.add({
                    targets: this[this.dialogSpeaker],
                    x: this.ROBBER_INSCREEN_X,
                    duration: this.tweenDuration,
                    ease: 'Linear'
                });
            }
        }
        else {
            // if no "NewSpeaker", then change speaker without tweening
            if(this.dialogLastSpeaker && this.dialogLastSpeaker.startsWith('cop_')) {
                this[this.dialogLastSpeaker].x = this.COP_OFFSCREEN_X;
            }
            else if(this.dialogLastSpeaker && this.dialogLastSpeaker.startsWith('robber_')) {
                this[this.dialogLastSpeaker].x = this.ROBBER_OFFSCREEN_X;
            }
            // switch in new speaker's image
            if(this.dialogSpeaker.startsWith('cop_')) {
                this[this.dialogSpeaker].x = this.COP_INSCREEN_X;
            }
            else if(this.dialogSpeaker.startsWith('robber_')) {
                this[this.dialogSpeaker].x = this.ROBBER_INSCREEN_X;
            }
        }

        // build dialog (concatenate speaker + line of text)
        const speakerName = this.dialog[this.dialogConvo][this.dialogLine]['speaker'].startsWith('cop_') ? 'Cop' : 'Robber';
        this.dialogLines = speakerName + ': ' + this.dialog[this.dialogConvo][this.dialogLine]['dialog'];

        // create a timer to iterate through each letter in the dialog text
        let currentChar = 0; 
        this.textTimer = this.time.addEvent({
            delay: this.LETTER_TIMER,
            repeat: this.dialogLines.length - 1,
            callback: () => { 
                // concatenate next letter from dialogLines
                this.dialogText.text += this.dialogLines[currentChar];
                // advance character position
                currentChar++;
                // check if timer has exhausted its repeats 
                // (necessary since Phaser 3 no longer seems to have an onComplete event)
                if(this.textTimer.getRepeatCount() == 0) {
                    // show prompt for more text
                    this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, this.NEXT_TEXT, this.TEXT_SIZE).setOrigin(1);
                    // un-lock input
                    this.dialogTyping = false;
                    // destroy timer
                    this.textTimer.destroy();
                }
            },
            callbackScope: this // keep Scene context
        });
        
        // set bounds on dialog
        this.dialogText.maxWidth = this.TEXT_MAX_WIDTH;

        // increment dialog line
        this.dialogLine++;

        // set past speaker
        this.dialogLastSpeaker = this.dialogSpeaker;
    
    }

    finishLine() {
        if (this.textTimer) this.textTimer.destroy();

        const speakerName = this.dialog[this.dialogConvo][this.dialogLine]['speaker'].startsWith('cop_') ? 'Cop' : 'Robber';
        this.dialogText.text = speakerName + ': ' + this.dialog[this.dialogConvo][this.dialogLine]['dialog'];

        this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, this.NEXT_TEXT, this.TEXT_SIZE).setOrigin(1);
    }
}