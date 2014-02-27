// TODO add "current screen" var and use its Stage,
// rather than a single global Stage - this enables
// us to switch screens for different games, scenes,
// etc.

// create HTML5 canvas and add it to the document

function Game() {}

Game.canvas = document.createElement("canvas");
Game.canvas.id = 'display';
Game.canvas.width = STAGE_W;
Game.canvas.height = STAGE_H;
document.body.appendChild(Game.canvas);

Game.stage = new PIXI.Stage(0x66CC99);
Game.currentScreen = null; // we make sure to call Game.setScreen()

// create renderer instance
// defaults to WebGL, falls back to Canvas on old/mobile devices
Game.renderer = PIXI.autoDetectRenderer(STAGE_W, STAGE_H, Game.canvas);


// set up variables to track timestep
Game.oldTime = new Date();
Game.newTime = new Date();

// set up variables to track framerate
Game.deltas = [];
Game.framesBack = 60 * 3;
Game.updatesPerSec = 1;
Game.fps = 0;
Game.secToUpdate = 1 / Game.updatesPerSec;
Game.delta = 0;

Game.onKeyDown = function(code) {
	Game.currentScreen.onKeyDown(code);
}

Game.onMouseDown = function(point) {
	Game.currentScreen.onMouseDown(point);
}

Game.setScreen = function(screen) {
	debug("setting screen...");
	debug(Game.stage);
	debug(Game.stage.children);
	for(var i = 0; i < Game.stage.children.length; i++)
	{
		debug("removing a child...");
		Game.stage.removeChild(Game.stage.children[0]);
		if(i != 0)
		{
			throw "There are extraneous root objects on the stage!!";
			return;
		}
	}
	Game.stage.setBackgroundColor(screen.backgroundColor);
	Game.stage.addChild(screen.stage);
	Game.currentScreen = screen;
}

// update function
// TODO make this modular with the Screen class!
Game.loop = function() {

	// request an update approx. 60 times/second
	requestAnimFrame(Game.loop);

	// calculate length of frame
	Game.newTime = new Date();
	Game.delta = (Game.newTime.getTime() - Game.oldTime.getTime()) / 1000.0;

	if (Game.delta > MAX_DELTA) Game.delta = MAX_DELTA;

	Game.oldTime = Game.newTime;

	// this is all framerate tracking stuff...
	Game.deltas.push(Game.delta);
	while (Game.deltas.length > Game.framesBack) {
		Game.deltas.splice(0, 1);
	}

	if (Game.secToUpdate <= 0) {

		var total = 0;
		for (var i = 0; i < Game.deltas.length; i++) {
			total += Game.deltas[i];
		}
		var avg = total / Game.deltas.length;

		Game.fps = 1 / avg;

		Game.secToUpdate += 1 / Game.updatesPerSec;
	}

	Game.secToUpdate -= Game.delta;

	Game.currentScreen.update(Game.delta);
	Game.renderer.render(Game.stage);
}

// initialize custom input
Input.init({
	mouseAnchor : Game.canvas
});

Game.setScreen(TestWorldScreen);

// IMPORTANT: render the stageWorld once before calling an update
// so all the PIXI variables and actors are updated properly
Game.renderer.render(Game.stage);

Input.keyPressListeners.push(Game.onKeyDown);
Input.mousePressListeners.push(Game.onMouseDown);

// let's-a go!
requestAnimFrame(Game.loop);
