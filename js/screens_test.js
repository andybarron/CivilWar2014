// method one of defining a Screen: separate functions.
// make sure the names don't conflict.
// this is preferred!

// TODO change keys on KEYS_EXIT press

TestWorldScreen = new Screen ({
	init: twsInit,
	update: twsUpdate,
	onKeyDown: twsOnKeyDown
	// onMouseDown: someOtherFunction
	// remember, you need commas after every
	// key-value pair except the last one!
});

function twsInit()
{

	// IMPORTANT:
	// anything that you want to access
	// after the init() method completes
	// (i.e. in the update function),
	// you must attach it to the screen
	// via "this.variableName = ...",
	// instead of "var variableName = ..."

	var stageWorld = this.stage;
	// just a nickname so we don't have to change so much stuff
	stageWorld.setBackgroundColor(0x66CC99);

	// load textures from file
	var textureBunny = Images.getTexture("bunny1.png");
	var textureGreen = Images.getTexture("bunny2.png");

	// add text to screen to track framerate
	this.text = new PIXI.Text("", {
			font : "24px Arial",
			fill : "cyan"
		});
	this.text.position.x = 6;
	this.text.position.y = 6;

	// create PIXI sprite
	this.bunny = new PIXI.Sprite(textureBunny);

	// center the sprite's anchor point
	this.bunny.anchor.x = 0.5;
	this.bunny.anchor.y = 0.5;

	// move the sprite to the center of the screen
	this.bunny.position.x = STAGE_W / 2;
	this.bunny.position.y = STAGE_H / 2;

	// scale the bunny up to 2x its normal size
	this.bunny.scale = new PIXI.Point(2, 2);

	// make him interactive and popup when you click on him
	this.bunny.interactive = true;
	this.bunny.mousedown = function () {
		alert("that tickles!");
	};

	// attach him to the stageWorld
	stageWorld.addChild(this.bunny);

	// add Thomas Jefferson

	var TJ = Images.createSprite("jefferson.png");

	// do what's necessary to put him on the screen in a static location

	TJ.anchor.x = 0.5;
	TJ.anchor.y = 0.5;
	TJ.position.x = 500;
	TJ.position.y = 400;
	stageWorld.addChild(TJ);

	//HARDCODED TEXT! YEAH!
	// TODO "display dialog" Screen method
	// that does all this rectangle stuff
	// so all you have to do is supply
	// a string or three

	this.TJText = new PIXI.Text("Well, I feel anachronistic...", {
			font : "24px Arial",
			align : "right"
		});
	this.TJText.position.x = 50;
	this.TJText.position.y = 535;
	this.textdisplay = 0;

	this.TJnamText = new PIXI.Text("TJ", {
			font : "24px Arial",
			align : "right"
		});
	this.TJnamText.position.x = 50;
	this.TJnamText.position.y = 475;

	this.answer1 = new PIXI.Text("Oh really? I didn't notice the cartoon bunnies.", {
			font : "16px Arial",
			align : "right"
		});
	this.answer1.position.x = 420;
	this.answer1.position.y = 565;

	this.answer2 = new PIXI.Text("Yeah, you don't belong in the Civil War, TJ.", {
			font : "16px Arial",
			align : "right"
		});
	this.answer2.position.x = 420;
	this.answer2.position.y = 515;

	// add a hundred friends!
	for (var i = 0; i < 100; i++) {
		var ob = new PIXI.Sprite(textureGreen);

		// randomize their positions
		ob.position.x = Math.random() * STAGE_W;
		ob.position.y = Math.random() * STAGE_H;

		// center their anchor points
		ob.anchor.x = 0.5;
		ob.anchor.y = 0.5;

		// add a name var to track them
		ob.name = "obstacle";

		// put 'em onstage
		stageWorld.addChild(ob);
	}

	// add fps text last to make sure it's on top of everything
	// (ow ow)
	stageWorld.addChild(this.text);
}

function twsUpdate(delta)
{

	var stageWorld = this.stage;
	var bunny = this.bunny; // i'm lazy
	bunny.rotation += delta*2*Math.PI/5;

	// run bunny around screen based on key presses
	if (Input.anyKeyDown(KEYS_UP)) {
		bunny.position.y -= PLAYER_SPEED * delta;
	}
	if (Input.anyKeyDown(KEYS_DOWN)) {
		bunny.position.y += PLAYER_SPEED * delta;
	}
	if (Input.anyKeyDown(KEYS_LEFT)) {
		bunny.position.x -= PLAYER_SPEED * delta;
	}
	if (Input.anyKeyDown(KEYS_RIGHT)) {
		bunny.position.x += PLAYER_SPEED * delta;
	}

	// press the spacebar to get TJ to say something.
	// you should probably also need to be near him for that to occur...\
	// TODO: More collisions

	if (Input.anyKeyDown(KEYS_INTERACT) && this.textdisplay == 0) {
		//RECTANGLES FOR THE RECTANGLE GOD!
		//This is the text box that appears at the bottom.

		// create graphics object
		var graphics = new PIXI.Graphics();
		//define the inside color
		graphics.beginFill(0xffffff);
		//line width and color
		graphics.lineStyle(5, 0xaaaaaa);
		//and the dimensions(x,y) and position(x,y) of the rectangle
		graphics.drawRect(0, 500, 400, 100);

		// and this is the textbox that contains "TJ" or the name
		graphics.drawRect(40, 460, 50, 50);
		// and these are two answer buttons
		// TODO make buttons work.
		graphics.lineStyle(5, 0x0000ff);
		graphics.drawRect(405, 500, 350, 45);
		graphics.lineStyle(5, 0xff0000);
		graphics.drawRect(405, 550, 350, 45);

		//and add it to the stageWorld
		graphics.endFill();
		stageWorld.addChild(graphics);

		stageWorld.addChild(this.TJText);
		stageWorld.addChild(this.TJnamText);
		stageWorld.addChild(this.answer1);
		stageWorld.addChild(this.answer2);
		this.textdisplay = 1;
	}

	// collision detection - remove every obstacle bunny that is touching
	// our debug character
	var pBounds = this.bunny.getBounds();

	for (var i = 0; i < stageWorld.children.length; i++) {
		var ob = stageWorld.children[i];
		if (!exists(ob.name) || ob.name != "obstacle") {
			continue;
		}

		var oBounds = ob.getBounds();
		//var pBounds = bunny.getBounds(); // already defined outside of the for loop

		// recTouch is a helper from helpers.js
		// yaaaaaaaaay
		var touching = recTouch(oBounds, pBounds, -10);

		if (touching) {
			stageWorld.removeChild(ob);
			i--;
		}
	}

	this.text.setText(DEBUG_MODE ? (Math.round(Game.fps) + " FPS") : "");
}

function twsOnKeyDown(keyCode)
{
	// switch screens on ESC press
	if (arrayContains(KEYS_EXIT,keyCode))
	{
		Game.currentScreen = TestMenuScreen;
	}
}

// method two of defining a Screen: inlining everything
// not particularly pretty, but hey, it works...
// don't forget the commas!

TestMenuScreen = new Screen ({
	init: function()
	{
		this.stage.setBackgroundColor(0x0011CC);
	},
	update: function(delta)
	{

	},
	onKeyDown: function(keyCode)
	{
		if (arrayContains(KEYS_EXIT,keyCode))
		{
			Game.currentScreen = TestWorldScreen;
		}
	}
});