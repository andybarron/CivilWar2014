var STAGE_W = 800;
var STAGE_H = 600;

// console.log(Object.keys(PIXI).sort());

var canvas = document.createElement("canvas");
canvas.id = 'display';
canvas.width = STAGE_W;
canvas.height = STAGE_H;
document.body.appendChild(canvas);

// create an new instance of a pixi stage
var stage = new PIXI.Stage(0x6699FF,true); // make interactive!

// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(STAGE_W, STAGE_H, canvas);

// add the renderer view element to the DOM
// document.body.appendChild(renderer.view);

Input.init({mouseAnchor: canvas});
requestAnimFrame( animate );

// create a texture from an image path
var texture1 = PIXI.Texture.fromImage("img/bunny1.png");
var texture2 = PIXI.Texture.fromImage("img/bunny2.png");
var textures = [texture1,texture2];

// create a new Sprite using the texture

var BUNNY_COUNT = 500;
var bunnies = [];
var speeds = [];
var angles = [];

var text = new PIXI.Text("~",{font: "18px Arial", fill: "cyan"});
text.position.x = 6;
text.position.y = 6;

for(var i = 0; i < BUNNY_COUNT; i++){
    var tx = getRandomElement(textures);
    var bunny = new PIXI.Sprite(tx);

    // center the sprites anchor point
    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;

    // move the sprite t the center of the screen
    bunny.position.x = Math.random()*STAGE_W;
    bunny.position.y = Math.random()*STAGE_H;

    bunnies.push(bunny);
    speeds.push(1 - Math.random()*2);
    angles.push(0);

    stage.addChild(bunny);
}

var mine = bunnies[bunnies.length-1];
mine.setInteractive(true);
mine.mousedown = (function(){debug("that tickles!");});

stage.addChild(text);

var oldTime = new Date();
var newTime = new Date();

var deltas = [];
var framesBack = 60*3;
var updatesPerSec = 1;
var fps = 0;
var secToUpdate = 1/updatesPerSec;

function animate()
{

    requestAnimFrame( animate );

    newTime = new Date();
    var delta = (newTime.getTime()-oldTime.getTime())/1000.0;
    oldTime = newTime;

    // just for fun, lets rotate mr rabbit a little
    for(var i = 0; i < BUNNY_COUNT; i++){
        var bunny = bunnies[i];
        var speed = speeds[i];
        var rot = speeds[i]*2*Math.PI*delta;
        angles[i] += rot;
        bunny.rotation += rot;
        bunny.position.x += delta*50*Math.cos(angles[i]);
        bunny.position.y += delta*50*Math.sin(angles[i]);
    }

    mine.scale.x = 2;
    mine.scale.y = 2;
    mine.position.x = Input.mouse.x;
    mine.position.y = Input.mouse.y;

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
      text.setText(Math.round(fps) + " FPS");
    }

    secToUpdate -= delta;

    // console.log(bunnies[0].rotation);

    // render the stage   
    renderer.render(stage);
}