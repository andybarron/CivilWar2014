// TODO add "current screen" var and use its Stage,
// rather than a single global Stage - this enables
// us to switch screens for different games, scenes,
// etc.

var STAGE_W = 800
var STAGE_H = 600

// create HTML5 canvas and add it to the document

var canvas = document.createElement("canvas");
canvas.id = 'display';
canvas.width = STAGE_W;
canvas.height = STAGE_H;
document.body.appendChild(canvas);

// create new instance of a PIXI stage
// param 1: hex bgcolor
// param 2: enable interactivity i.e. register mouse clicks
var stage = new PIXI.Stage(0x66CC99,true);

// create renderer instance
// defaults to WebGL, falls back to Canvas on old/mobile devices
var renderer = PIXI.autoDetectRenderer(STAGE_W, STAGE_H, canvas);

// load textures from file
// TODO put them in a texture atlas for increased rendering speed
// TODO some way to preload/cache textures (yay helper functions)
var textureBunny = PIXI.Texture.fromImage("assets/img/bunny1.png");
var textureGreen = PIXI.Texture.fromImage("assets/img/bunny2.png");

// disable texture smoothing
// may actually want to enable this, depending on art style
textureBunny.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
textureGreen.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

// add text to screen to track framerate
var text = new PIXI.Text("",{font: "24px Arial", fill: "cyan"});
text.position.x = 6;
text.position.y = 6;

// create PIXI sprite
var bunny = new PIXI.Sprite(textureBunny);

// center the sprite's anchor point
bunny.anchor.x = 0.5;
bunny.anchor.y = 0.5;

// move the sprite to the center of the screen
bunny.position.x = STAGE_W/2;
bunny.position.y = STAGE_H/2;

// scale the bunny up to 2x its normal size
bunny.scale = new PIXI.Point(3,3);

// make him interactive and popup when you click on him
bunny.interactive = true;
bunny.mousedown = function()
{
  alert("that tickles!");
};

// attach him to the stage
stage.addChild(bunny);

// add a hundred friends!
for (var i = 0; i < 100; i++)
{
  var ob = new PIXI.Sprite(textureGreen);

  // randomize their positions
  ob.position.x = Math.random()*STAGE_W;
  ob.position.y = Math.random()*STAGE_H;

  // center their anchor points
  ob.anchor.x = 0.5;
  ob.anchor.y = 0.5;

  // add a name var to track them
  ob.name = "obstacle";

  // put 'em onstage
  stage.addChild(ob);
}

// add fps text last to make sure it's on top of everything
// (ow ow)
stage.addChild(text);

// set up variables to track timestep
var oldTime = new Date();
var newTime = new Date();

// set up variables to track framerate
var deltas = [];
var framesBack = 60*3;
var updatesPerSec = 1;
var fps = 0;
var secToUpdate = 1/updatesPerSec;

// example function to show how to listen for key presses...
function keyPress(code)
{
  debug(code);
}

Input.keyPressListeners.push(keyPress);

// update function
// TODO make this modular with the Screen class!
function animate()
{

  // request an update approx. 60 times/second
  requestAnimFrame( animate );

  // calculate length of frame
  newTime = new Date();
  var delta = (newTime.getTime()-oldTime.getTime())/1000.0;
  oldTime = newTime;

  // this is all framerate tracking stuff...
  deltas.push(delta);

  while(deltas.length > framesBack)
  {
    deltas.splice(0,1);
  }

  if(secToUpdate <= 0) {

    var total = 0;
    for(var i = 0; i < deltas.length; i++)
    {
      total += deltas[i];
    }
    var avg = total/deltas.length;

    fps = 1/avg;

    secToUpdate += 1/updatesPerSec;
    text.setText( DEBUG_MODE ? (Math.round(fps) + " FPS") : "" );
  }

  secToUpdate -= delta;

  // run bunny around screen based on key presses
  if (Input.anyKeyDown(KEYS_UP))
  {
    bunny.position.y -= PLAYER_SPEED*delta;
  }
  if (Input.anyKeyDown(KEYS_DOWN))
  {
    bunny.position.y += PLAYER_SPEED*delta;
  }
  if (Input.anyKeyDown(KEYS_LEFT))
  {
    bunny.position.x -= PLAYER_SPEED*delta;
  }
  if (Input.anyKeyDown(KEYS_RIGHT))
  {
    bunny.position.x += PLAYER_SPEED*delta;
  }

  // collision detection - remove every obstacle bunny that is touching
  // our debug character
  var pBounds = bunny.getBounds();

  for(var i = 0; i < stage.children.length; i++)
  {
    var ob = stage.children[i];
    if (!exists(ob.name) || ob.name != "obstacle")
    {
      continue;
    }
    
    var oBounds = ob.getBounds();
    var pBounds = bunny.getBounds();

    // recTouch is a helper from helpers.js
    // yaaaaaaaaay
    var touching = recTouch(oBounds,pBounds,-10);

    if (touching)
    {
      stage.removeChild(ob);
      i--;
    }
  }

  // render the stage
  renderer.render(stage);
}

// initialize custom input
Input.init({mouseAnchor: canvas});

// IMPORTANT: render the stage once before calling an update
// so all the PIXI variables and actors are updated proplerly
renderer.render(stage);

// let's-a go!
requestAnimFrame( animate );
