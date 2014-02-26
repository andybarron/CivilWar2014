// TODO add "current screen" var and use its Stage,
// rather than a single global Stage - this enables
// us to switch screens for different games, scenes,
// etc.

var STAGE_W = 800;
var STAGE_H = 600;

// create HTML5 canvas and add it to the document

var canvas = document.createElement("canvas");
canvas.id = 'display';
canvas.width = STAGE_W;
canvas.height = STAGE_H;
document.body.appendChild(canvas);

// create new instance of a PIXI stageWorld
// param 1: hex bgcolor
// param 2: enable interactivity i.e. register mouse clicks
var stageWorld = new PIXI.Stage(0x66CC99, true);
// Waiting to populate stageMenu until Andy gets his Screen class implemented
var stageMenu = new PIXI.Stage(0xFFFFFF, true);
var stageCurrent = stageWorld;

// create renderer instance
// defaults to WebGL, falls back to Canvas on old/mobile devices
var renderer = PIXI.autoDetectRenderer(STAGE_W, STAGE_H, canvas);

// load textures from file
// TODO put them in a texture atlas for increased rendering speed
// TODO some way to preload/cache textures (yay helper functions)
var textureBunny = PIXI.Texture.fromImage("assets/img/bunny1.png");
var textureGreen = PIXI.Texture.fromImage("assets/img/bunny2.png");
var textureTJ = PIXI.Texture.fromImage("assets/img/jefferson.png");

// disable texture smoothing
// may actually want to enable this, depending on art style
textureBunny.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
textureGreen.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
textureTJ.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

// add text to screen to track framerate
var text = new PIXI.Text("", {
		font : "24px Arial",
		fill : "cyan"
	});
text.position.x = 6;
text.position.y = 6;

// create PIXI sprite
var bunny = new PIXI.Sprite(textureBunny);

// center the sprite's anchor point
bunny.anchor.x = 0.5;
bunny.anchor.y = 0.5;

// move the sprite to the center of the screen
bunny.position.x = STAGE_W / 2;
bunny.position.y = STAGE_H / 2;

// scale the bunny up to 2x its normal size
bunny.scale = new PIXI.Point(2, 2);

// make him interactive and popup when you click on him
bunny.interactive = true;
bunny.mousedown = function () {
	alert("that tickles!");
};

// attach him to the stageWorld
stageWorld.addChild(bunny);

// add Thomas Jefferson

var TJ = new PIXI.Sprite(textureTJ);

// do what's necessary to put him on the screen in a static location

TJ.anchor.x = 0.5;
TJ.anchor.y = 0.5;
TJ.position.x = 500;
TJ.position.y = 400;
stageWorld.addChild(TJ);

//HARDCODED TEXT! YEAH!

var TJText = new PIXI.Text("Well, I feel anachronistic...", {
		font : "24px Arial",
		align : "right"
	});
TJText.position.x = 50;
TJText.position.y = 535;
var textdisplay = 0;

var TJnamText = new PIXI.Text("TJ", {
		font : "24px Arial",
		align : "right"
	});
TJnamText.position.x = 50;
TJnamText.position.y = 475;

var answer1 = new PIXI.Text("Oh really? I didn't notice the cartoon bunnies.", {
		font : "16px Arial",
		align : "right"
	});
answer1.position.x = 420;
answer1.position.y = 565;

var answer2 = new PIXI.Text("Yeah, you don't belong in the Civil War, TJ.", {
		font : "16px Arial",
		align : "right"
	});
answer2.position.x = 420;
answer2.position.y = 515;

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
stageWorld.addChild(text);

// set up variables to track timestep
var oldTime = new Date();
var newTime = new Date();

// set up variables to track framerate
var deltas = [];
var framesBack = 60 * 3;
var updatesPerSec = 1;
var fps = 0;
var secToUpdate = 1 / updatesPerSec;

// example function to show how to listen for key presses...
function keyPress(code) {
	debug(code);
	if (Input.isKeyDown(27)) { // Esc key listener
		//if(Input.keyPress(27)) { Doesn't work... blame Andy's code
		if (stageCurrent == stageWorld) {
			stageCurrent = stageMenu;
		} else if (stageCurrent == stageMenu) {
			stageCurrent = stageWorld;
		}
	}
}

Input.keyPressListeners.push(keyPress);

// update function
// TODO make this modular with the Screen class!
function animate() {

	// request an update approx. 60 times/second
	requestAnimFrame(animate);

	// calculate length of frame
	newTime = new Date();
	var delta = (newTime.getTime() - oldTime.getTime()) / 1000.0;
	oldTime = newTime;

	// this is all framerate tracking stuff...
	deltas.push(delta);
	while (deltas.length > framesBack) {
		deltas.splice(0, 1);
	}

	if (secToUpdate <= 0) {

		var total = 0;
		for (var i = 0; i < deltas.length; i++) {
			total += deltas[i];
		}
		var avg = total / deltas.length;

		fps = 1 / avg;

		secToUpdate += 1 / updatesPerSec;
		text.setText(DEBUG_MODE ? (Math.round(fps) + " FPS") : "");
	}

	secToUpdate -= delta;

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

	if (Input.anyKeyDown(KEYS_SPACE) && textdisplay == 0) {
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

		stageWorld.addChild(TJText);
		stageWorld.addChild(TJnamText);
		stageWorld.addChild(answer1);
		stageWorld.addChild(answer2);
		textdisplay = 1;
		console.log(textdisplay);
	}

	// collision detection - remove every obstacle bunny that is touching
	// our debug character
	var pBounds = bunny.getBounds();

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

	// render the stageWorld
	renderer.render(stageCurrent);
}

// initialize custom input
Input.init({
	mouseAnchor : canvas
});

// IMPORTANT: render the stageWorld once before calling an update
// so all the PIXI variables and actors are updated properly
renderer.render(stageCurrent);

// let's-a go!
requestAnimFrame(animate);
