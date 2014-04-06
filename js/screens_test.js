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
	Sounds.load("coin.wav");
	// IMPORTANT:
	// anything that you want to access
	// after the init() method completes
	// (i.e. in the update function),
	// you must attach it to the screen
	// via "this.variableName = ...",
	// instead of "var variableName = ..."

	var stageWorld = this.stage;
	// just a nickname so we don't have to change so much stuff
	
	//REMEMBER - stuff added to the screen is added in order
	//Lowest stuff first (the things that go behind everything else)

	// load textures from file
	var textureBunny = Images.getTexture("hat4.png");
	var textureGreen = Images.getTexture("wheat.gif");

	// add text to screen to track framerate
	this.text = new PIXI.Text("", {
			font : "24px Arial",
			fill : "white"
		});
	this.text.position.x = 6;
	this.text.position.y = 6;
	this.text.fixed = true;

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
	
	// create PIXI MovieClip
	var newClip = [];
	
	newClip.push(Images.getTexture("hat4.png"));
	newClip.push(Images.getTexture("hat4back.png"));
	newClip.push(Images.getTexture("hat4sideleft.png"));
	newClip.push(Images.getTexture("hat4sideright.png"));

	this.bunny = new PIXI.MovieClip(newClip);

	// center the sprite's anchor point
	this.bunny.anchor.x = 0.5;
	this.bunny.anchor.y = 0.5;

	// move the sprite to the center of the screen
	this.bunny.position.x = STAGE_W / 2;
	this.bunny.position.y = STAGE_H / 2;

	// scale the bunny up to 2x its normal size
	this.bunny.scale = new PIXI.Point(.2, .2);

	// make him interactive and popup when you click on him
	this.bunny.interactive = true;
	this.bunny.mousedown = function () {
		alert("that tickles!");
	};

	// attach him to the stageWorld
	stageWorld.addChild(this.bunny);

	// add Thomas Jefferson

	var TJexture = [];
	TJexture.push(Images.getTexture("Harriet.png")); // I know she looks bad but she's better than Thomas Jefferson
	TJexture.push(Images.getTexture("Harriet_Speaking.png")); // She opens her mouth when you get close!
	this.TJ = new PIXI.MovieClip(TJexture);

	// do what's necessary to put him on the screen in a static location

	this.TJ.anchor.x = 0.5;
	this.TJ.anchor.y = 0.5;
	this.TJ.position.x = 500;
	this.TJ.position.y = 400;
	stageWorld.addChild(this.TJ);
	
	//Placeholder NPC - so that BOX# lines up with NPCList[#]
	var blankTexture = [];
	blankTexture.push(Images.getTexture("nothing.png"));
	blankTexture.push(Images.getTexture("nothing.png"));
	this.Blanky = new PIXI.MovieClip(blankTexture);
	
	
	// Lee
	
	var LeeTexture = [];
	LeeTexture.push(Images.getTexture("lee.png"));
	LeeTexture.push(Images.getTexture("lee_h.png"));
	this.Lee = new PIXI.MovieClip(LeeTexture);
	
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
	
	//add Dialogue Boxes
	var boxen = [];
   
	//blank
	boxen.push(Images.getTexture("BOX0.png"));
	//TJ's (HT's?) dialogue box
	boxen.push(Images.getTexture("BOX1.png"));
	//Lee
	boxen.push(Images.getTexture("BOX2.png"));
	//Someone else's
	boxen.push(Images.getTexture("BOX3.png"));
	boxen.push(Images.getTexture("BOX4.png"));
	
	this.dialoguebox = new PIXI.MovieClip(boxen);
	
	
	this.dialoguebox.position.x = 0;
	this.dialoguebox.position.y = 400;
	this.dialoguebox.fixed = true;
	
	stageWorld.addChild(this.dialoguebox);

	//helper variables for dialogue box control
	//text display should be 1 if a dialogue box is on-screen
	//interact should be 1 if the interaction button is currently held down
	//currNPC holds what npc is currently being talked to
	//change fadeLoadingScreen to 1 if you want to fade to a loading screen
	//loadingscreenIsDone will report true after it's done fading and 3 seconds have elapsed
	
	this.textdisplay = 0;
	this.interact = 0;
	this.currNPC = 0;
	this.fadeLoadingScreen = 0;
	this.loadingScreenIsDone = false;
	
	//Answer boxes, makes the dialogue trees!
	
	var answerboxen1 = [];
	answerboxen1.push(Images.getTexture("nothing.png"));
	answerboxen1.push(Images.getTexture("tubanswer.png"));
	
	this.answerbox1 = new PIXI.MovieClip(answerboxen1);
	this.answerbox1.position.x = 600;
	this.answerbox1.position.y = 400;
	this.answerbox1.fixed = true;
	
	stageWorld.addChild(this.answerbox1);
	
	var answerboxen2 = [];
	answerboxen2.push(Images.getTexture("nothing.png"));
	answerboxen2.push(Images.getTexture("tubanswer2.png"));
	
	this.answerbox2 = new PIXI.MovieClip(answerboxen2);
	this.answerbox2.position.x = 600;
	this.answerbox2.position.y = 500;
	this.answerbox2.fixed = true;
	
	stageWorld.addChild(this.answerbox2);
	
	//Loading screen! Fun facts!
	
	var FunFacts = [];
	FunFacts.push(Images.getTexture("FunFacts1.png"));
	this.loadingscreen = new PIXI.MovieClip(FunFacts);
	this.loadingscreen.alpha = 0;
	this.loadingscreen.loop = false;
	this.loadingscreen.fixed = true;
	
	stageWorld.addChild(this.loadingscreen);
	
	//Dialogue Tree Logic. TODO: Make this less hacky and hard-coded.
	
	this.answerbox1.interactive = true;
	this.answerbox1.mousedown = function () {
		if(TestWorldScreen.currNPC == 1){
			TestWorldScreen.dialoguebox.gotoAndStop(3);
			TestWorldScreen.answerbox1.gotoAndStop(0);
			TestWorldScreen.answerbox2.gotoAndStop(0);
			setTimeout(function(){
				TestWorldScreen.fadeLoadingScreen = 1;
			},5000);
		}
	};
	
	
	this.answerbox2.interactive = true;
	this.answerbox2.mousedown = function () {
		if(TestWorldScreen.currNPC == 1){
			TestWorldScreen.dialoguebox.gotoAndStop(4);
			TestWorldScreen.answerbox1.gotoAndStop(0);
			TestWorldScreen.answerbox2.gotoAndStop(0);
		}
	};
	
	
	// add fps text last to make sure it's on top of everything
	// (ow ow)
	stageWorld.addChild(this.text);
}

function twsUpdate(delta)
{

	var stageWorld = this.stage;
	var bunny = this.bunny; // i'm lazy
	var TJ = this.TJ;
	//bunny.rotation += delta*2*Math.PI/5;

	// run bunny around screen based on key presses
	if (Input.anyKeyDown(KEYS_UP)) {
		bunny.gotoAndStop(1);
		bunny.position.y -= PLAYER_SPEED * delta;
	}
	if (Input.anyKeyDown(KEYS_DOWN)) {
		bunny.gotoAndStop(0);
		bunny.position.y += PLAYER_SPEED * delta;
	}
	if (Input.anyKeyDown(KEYS_LEFT)) {
		bunny.gotoAndStop(2);
		bunny.position.x -= PLAYER_SPEED * delta;
	}
	if (Input.anyKeyDown(KEYS_RIGHT)) {
		bunny.gotoAndStop(3);
		bunny.position.x += PLAYER_SPEED * delta;
	}
	
	// if near an NPC, highlight them
	
	for(var i = 0; i < this.NPCList.length; i++){
		if(recTouch(bunny.getBounds(), this.NPCList[i].getBounds(), -30)){
			this.NPCList[i].gotoAndStop(1);
		}
		if(!recTouch(bunny.getBounds(), this.NPCList[i].getBounds(), -30)){
			this.NPCList[i].gotoAndStop(0);
		}
	}

	//DIALOGUE!
	//TODO: Make this less hardcoded and hacky.
	
	// press the spacebar near an NPC to start interacting (get 'em to say something).
	
	
	
	if (Input.anyKeyDown(KEYS_INTERACT) && this.textdisplay == 0 && this.interact == 0) {
	
		for(var i = 0; i < this.NPCList.length; i++){
			if(recTouch(bunny.getBounds(), this.NPCList[i].getBounds(), -30)){
				this.interact = 1;
				this.currNPC = i;
				this.dialoguebox.gotoAndStop(i);
				this.answerbox1.gotoAndStop(i);
				this.answerbox2.gotoAndStop(i);
			}
		}
	}
	
	if (this.interact == 1 && this.textdisplay == 0 && !Input.anyKeyDown(KEYS_INTERACT)){
		this.textdisplay = 1;
		this.interact =  0;
	}
	
	//console.log(this.currNPC);
	
	//Insert logic for dialogue trees here.
	//While interacting, choices are available to peruse.
	//So, space is to start talking, but everything else is mouse controlled.
	
	//Press space again to stop interacting
	
	if (Input.anyKeyDown(KEYS_INTERACT) && this.textdisplay == 1 && this.interact == 0) {
		this.dialoguebox.gotoAndStop(0);
		this.answerbox1.gotoAndStop(0);
		this.answerbox2.gotoAndStop(0);
		this.interact = 1;
	 }
	 
	 if (this.interact == 1 && this.textdisplay == 1 && !Input.anyKeyDown(KEYS_INTERACT)){
		this.textdisplay = 0;
		this.interact = 0;
		this.currNPC = 0;
		//If you don't wan to do an activity/minigame, just exit dialogue as normal.
		this.fadeLoadingScreen = 0;
	 }
	 
	 //Fade a loading screen
	 
	 //This is probably the hackiest thing I've done this semester.
	 if(this.fadeLoadingScreen == 1 && this.loadingscreen.alpha <= 6){
		this.loadingscreen.alpha+= 0.01;
		this.text.alpha -= 0.01;
	 }
	 
	 if(this.loadingscreen.alpha >= 4 && this.fadeLoadingScreen == 1){
			this.loadingScreenIsDone = true;
			this.fadeLoadingScreen = 0;
			//INSERT MINIGAME OR CHANGE SCREEN HERE or wherever it works, this.loadingScreenIsDone now returns true.
	 }
	 
	//console.log(this.loadingscreen.alpha);
	//console.log(this.fadeLoadingScreen);
	//console.log(this.loadingScreenIsDone);
	
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
			Sounds.play("coin.wav");
			stageWorld.removeChild(ob);
			i--;
		}
	}

	this.centerCameraPosition(bunny.position.x, bunny.position.y);

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
// not preferred, but i almost like it better?
// we shall see... -andy

TestMenuScreen = new Screen ({
	init: function()
	{
		Sounds.load("bark.wav");
		this.doge = Images.createSprite("doge.png");
		this.stage.addChild(this.doge);

		this.dogeX = 0;
		this.dogeY = 0;
		this.dogeTime = 1;
		this.doged = false;

		this.doge.position.x = -13370;
		this.doge.position.y = -13370;

		this.testWords = new PIXI.Text("CIVIL WAR PROJECT 2014", {
			font : "56px Arial",
			fill: "001166",
			wordWrap: true,
			wordWrapWidth: 800
		});
		this.testWords.position.x = 0;
		this.testWords.position.y = STAGE_H/3;
		this.stage.addChild(this.testWords);


		// just for fun.... ;)
		this.doges = ["wow","many game","such eduation","brother vs brother","amaze sgd",
			"war so civl","ken burns","wow","such game","many educate","nick lytle is the man","aeiou"];
		var doges = this.doges;

		for(var i = 0; i < doges.length; i++)
		{
			//this.onMouseDown( new PIXI.Point(Math.random()*STAGE_W/2,Math.random()*STAGE_H/2+STAGE_H/4) );
		}

	},
	update: function(delta)
	{
		this.dogeTime += delta;
		if(this.dogeTime >= 1)
		{
			if(this.doged){
				this.onMouseDown( new PIXI.Point( this.dogeX, this.dogeY+100 ) );
				Sounds.play("bark.wav");
			}
			this.doged = true;
			this.dogeTime -= 1;
			this.oldX = this.doge.position.x;
			this.oldY = this.doge.position.y;
			this.dogeX = Math.random()*STAGE_W - this.doge.width/2;
			this.dogeY = Math.random()*STAGE_H - this.doge.height/2;
		}

		var tx = this.dogeX;
		var ty = this.dogeY;
		var x = this.doge.position.x;
		var y = this.doge.position.y;
		this.doge.position.x += (tx-x)/4;
		this.doge.position.y += (ty-y)/4;
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