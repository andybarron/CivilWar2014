// method one of defining a Screen: separate functions.
// make sure the names don't conflict.
// -andy

TestWorldScreen = new Screen ({
	init: twsInit,
	update: twsUpdate,
	onKeyDown: twsOnKeyDown,
	backgroundColor: 0x66CC99
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

	// load textures from file
	var textureBunny = Images.getTexture("bunny1.png");
	var textureGreen = Images.getTexture("bunny2.png");

	// add text to screen to track framerate
	this.text = new PIXI.Text("", {
			font : "24px Arial",
			fill : "white"
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
	
	//add Dialogue Boxes
	var boxen = [];
   
	//blank
	var box0 = Images.getTexture("BOX0.png");
	boxen.push(box0);
	//TJ's dialogue box
	var box1 = Images.getTexture("BOX1.png");
	boxen.push(box1);
	//Others
	var box2 = Images.getTexture("BOX2.png");
	boxen.push(box2);
	var box3 = Images.getTexture("BOX3.png");
	boxen.push(box3);
	
	this.dialoguebox = new PIXI.MovieClip(boxen);
	
	
	this.dialoguebox.position.x = 0;
	this.dialoguebox.position.y = 400;
	
	stageWorld.addChild(this.dialoguebox);

	//helper variables for dialogue box control
	//text display should be 1 if a dialogue box is on-screen
	//interact should be 1 if the interaction button is currently held down
	
	this.textdisplay = 0;
	this.interact = 0;

	// add Thomas Jefferson

	var TJexture = Images.getTexture("jefferson.png");
	this.TJ = new PIXI.Sprite(TJexture);

	// do what's necessary to put him on the screen in a static location

	this.TJ.anchor.x = 0.5;
	this.TJ.anchor.y = 0.5;
	this.TJ.position.x = 500;
	this.TJ.position.y = 400;
	stageWorld.addChild(this.TJ);
	
	// NPC list
	
	//Placeholder NPC - so that BOX# lines up with NPCList[#]
	var blankTexture = Images.getTexture("nothing.png");
	this.Blanky = new PIXI.Sprite(blankTexture);
	
	
	// Lee
	
	var LeeTexture = Images.getTexture("lee.png");
	this.Lee = new PIXI.Sprite(LeeTexture);
	
	this.Lee.anchor.x = 0.5;
	this.Lee.anchor.y = 0.5;
	this.Lee.position.x = 100;
	this.Lee.position.y = 100;
	stageWorld.addChild(this.Lee);
	
	this.NPCList = [];
	this.NPCList.push(this.Blanky)
	this.NPCList.push(this.TJ);
	this.NPCList.push(this.Lee);
	
	//Proximity checker
	
	var TJbounds = this.TJ.getBounds();

	
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
	var TJ = this.TJ;
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
	
	// if near an NPC, highlight them
	
	for(var i = 0; i < this.NPCList.length; i++){
		if(recTouch(bunny.getBounds(), this.NPCList[i].getBounds(), 30)){
			var NPCBounds = this.NPCList[i].getBounds();
			var outline = new PIXI.Graphics();
			outline.lineStyle(4, 0xFFFF00);
			outline.drawRect(NPCBounds.x, NPCBounds.y, NPCBounds.width, NPCBounds.height);
			this.stage.addChild(outline);
		}
		if(!recTouch(bunny.getBounds(), this.NPCList[i].getBounds(), 30)){
			var NPCBounds = this.NPCList[i].getBounds();
			var outline = new PIXI.Graphics();
			outline.lineStyle(4, 0xFFFFFF);
			outline.drawRect(NPCBounds.x, NPCBounds.y, NPCBounds.width, NPCBounds.height);
			this.stage.addChild(outline);
		}
	}

	// press the spacebar near an NPC to get 'em to say something.
	
	if (Input.anyKeyDown(KEYS_INTERACT) && this.textdisplay == 0 && this.interact == 0) {
	
		for(var i = 0; i < this.NPCList.length; i++){
			if(recTouch(bunny.getBounds(), this.NPCList[i].getBounds(), 30)){
				this.interact = 1;
				this.dialoguebox.gotoAndStop(i);
			}
		}
	}
	
	if (this.interact == 1 && this.textdisplay == 0 && !Input.anyKeyDown(KEYS_INTERACT)){
		this.textdisplay = 1;
		this.interact =  0;
	}
	
	
	if (Input.anyKeyDown(KEYS_INTERACT) && this.textdisplay == 1 && this.interact == 0) {
		this.dialoguebox.gotoAndStop(0);
		this.interact = 1;
	 }
	 
	 if (this.interact == 1 && this.textdisplay == 1 && !Input.anyKeyDown(KEYS_INTERACT)){
		this.textdisplay = 0;
		this.interact = 0;
	 }
	
	//console.log("Textdisplayed: "+this.textdisplay);
	//console.log("Interacting: "+this.interact);
	
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
		Game.setScreen(TestMenuScreen);
	}
}

// method two of defining a Screen: inlining everything
// i was going to make a comment about how this is
// not preffered, but i almost like it better?
// we shall see... -andy

TestMenuScreen = new Screen ({
	init: function()
	{
		this.testWords = new PIXI.Text("CIVIL WAR PROJECT 2014 (try clicking on this screen)", {
			font : "64px Arial",
			fill: "001166",
			wordWrap: true,
			wordWrapWidth: 800
		});
		this.testWords.position.x = 0;
		this.testWords.position.y = STAGE_H/3;
		this.stage.addChild(this.testWords);


		// just for fun.... ;)
		this.doges = ["wow","many game","such eduation","brother vs brother","amaze sgd"];
		var doges = this.doges;

		for(var i = 0; i < doges.length; i++)
		{
			var dogeWord = new PIXI.Text(doges[i], {
				font : "36px Comic Sans MS",
				fill: getRandomInt(99) + "" + getRandomInt(99) + "" + getRandomInt(99)
			});
			dogeWord.position.x = Math.random()*STAGE_W/2;
			dogeWord.position.y = Math.random()*STAGE_H/2+STAGE_H/4;
			this.stage.addChild(dogeWord);
		}
	},
	update: function(delta)
	{

	},
	onKeyDown: function(keyCode)
	{
		if (arrayContains(KEYS_EXIT,keyCode))
		{
			Game.setScreen(TestWorldScreen);
		}
	},
	onMouseDown: function(point)
	{
		var doges = this.doges;
		var dogeWord = new PIXI.Text(doges[getRandomInt(doges.length)], {
			font : "36px Comic Sans MS",
			fill: getRandomInt(99) + "" + getRandomInt(99) + "" + getRandomInt(99)
		});
		dogeWord.position.x = point.x;
		dogeWord.position.y = point.y;
		this.stage.addChild(dogeWord);
	}
});