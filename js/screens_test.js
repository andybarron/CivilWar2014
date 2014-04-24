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
function graphnode(sprite,name,adjacent){
this.sprite = sprite;
this.name = name;
this.adjacent = adjacent;
this.touching = function(pos){
if(wasClicked(this.sprite.getBounds(), pos, 0)){
return true;
}
return false;
}
this.toString = function(){
return this.name;
}
this.setinvis = function(){
this.sprite.gotoAndStop(0);
}
this.setvis = function(){
this.sprite.gotoAndStop(1);
}
this.isAdj = function(node){
for(var key in adjacent){
if(adjacent[key] == node){
return true;
}
return false;
}
}
}
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
	for (var i = 0; i < 5; i++) {
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

	// attach him to the stageWorld is at the bottom, because the main character should probably be on top of everything
	
	//Load NPC's data from the XML file
	var AllOfTheNPCs = [];
	LoadNPCs(AllOfTheNPCs);
	
	//Add NPC's to the world
	for(var i = 0; i < AllOfTheNPCs.length;i++){
		AllOfTheNPCs[i]["MovieClip"] = new PIXI.MovieClip(AllOfTheNPCs[i].texture);
		
		var current = AllOfTheNPCs[i].MovieClip;
		
		current.anchor.x = 0.5;
		current.anchor.y = 0.5;
		current.position.x = AllOfTheNPCs[i].x;
		current.position.y = AllOfTheNPCs[i].y;
		current.scale = new PIXI.Point(AllOfTheNPCs[i].scale, AllOfTheNPCs[i].scale);
		stageWorld.addChild(current);
	}

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
	
	
	// Not Lee anymore, Background NPC 1
	
	var LeeTexture = [];
	LeeTexture.push(Images.getTexture("hat4.png"));
	//LeeTexture.push(Images.getTexture("lee_h.png"));
	this.Lee = new PIXI.MovieClip(LeeTexture);
	
	this.Lee.anchor.x = 0.5;
	this.Lee.anchor.y = 0.5;
	this.Lee.position.x = 100;
	this.Lee.position.y = 100;
	this.Lee.scale = new PIXI.Point(.2, .2);
	stageWorld.addChild(this.Lee);
	
	// Background NPC 2
	
	var bgnpc2 = [];
	bgnpc2.push(Images.getTexture("hat4.png"));
	//LeeTexture.push(Images.getTexture("lee_h.png"));
	this.backy2 = new PIXI.MovieClip(LeeTexture);
	
	this.backy2.anchor.x = 0.5;
	this.backy2.anchor.y = 0.5;
	this.backy2.position.x = 600;
	this.backy2.position.y = 100;
	this.backy2.scale = new PIXI.Point(.2, .2);
	stageWorld.addChild(this.backy2);
	
	// Newspaper (inanimate objects can be NPC's too!)
	
	var news = [];
	news.push(Images.getTexture("newspaper.png"));
	//LeeTexture.push(Images.getTexture("lee_h.png"));
	this.paper = new PIXI.MovieClip(news);
	
	this.paper.anchor.x = 0.5;
	this.paper.anchor.y = 0.5;
	this.paper.position.x = 100;
	this.paper.position.y = 300;
	this.paper.scale = new PIXI.Point(.2, .2);
	stageWorld.addChild(this.paper);
	
	// NPC List
	
	this.NPCList = [];
	this.NPCList.push(this.Blanky);
	this.NPCList.push(this.TJ);
	this.NPCList.push(this.Lee);
	this.NPCList.push(this.backy2); 
	this.NPCList.push(this.paper);
	
	
	
	//Proximity checker - I think this is outdated
	
	var TJbounds = this.TJ.getBounds();
	
	//add Dialogue Boxes
	var boxen = [];
   
	//blank
	boxen.push(Images.getTexture("BOX0.png"));
	//TJ's (HT's?) dialogue box
	boxen.push(Images.getTexture("BOX1.png"));
	//Lee no, wait, first background NPC
	boxen.push(Images.getTexture("BOX2.png"));
	//backy2's
	boxen.push(Images.getTexture("BOX3.png"));
	//newspaper's
	boxen.push(Images.getTexture("BOX4.png"));
	//Tubman's answers
	boxen.push(Images.getTexture("BOX5.png"));
	boxen.push(Images.getTexture("BOX6.png"));
	
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
	this.delay = 0;
	
	//Answer boxes, makes the dialogue trees!
	
	var answerboxen1 = [];
	answerboxen1.push(Images.getTexture("nothing.png"));
	answerboxen1.push(Images.getTexture("tubanswer.png"));
	
	this.answerbox1 = new PIXI.MovieClip(answerboxen1);
	this.answerbox1.position.x = 600;
	this.answerbox1.position.y = 400;
	this.answerbox1.fixed = true;
	
	stageWorld.addChild(this.answerbox1);
	this.answerbox1.buttonMode = true;
	
	var answerboxen2 = [];
	answerboxen2.push(Images.getTexture("nothing.png"));
	answerboxen2.push(Images.getTexture("tubanswer2.png"));
	
	this.answerbox2 = new PIXI.MovieClip(answerboxen2);
	this.answerbox2.position.x = 600;
	this.answerbox2.position.y = 500;
	this.answerbox2.fixed = true;
	
	stageWorld.addChild(this.answerbox2);
	this.answerbox2.buttonMode = true;
	
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
			TestWorldScreen.dialoguebox.gotoAndStop(5);
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
			TestWorldScreen.dialoguebox.gotoAndStop(6);
			TestWorldScreen.answerbox1.gotoAndStop(0);
			TestWorldScreen.answerbox2.gotoAndStop(0);
			TestWorldScreen.delay = 1;
		}
	};
	
	// Player character
	stageWorld.addChild(this.bunny);
	
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
				if(i == 1){//oh god why. no, no, no.
					this.answerbox1.gotoAndStop(i);
					this.answerbox2.gotoAndStop(i);
					}
				//If dialogue trees extend past 1 branch, this needs to change
				if(i > this.answerbox1.textures.length-1){
					this.delay = 1;
				}
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
		this.delay = 0;
		//If you don't want to do an activity/minigame, just exit dialogue as normal.
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
	
	
	//Delay function - in case people don't want to press the spacebar to end a conversation.
	
	if(this.delay >= 1){
		this.delay++;
	}
	
	if(this.delay >= 400){
		this.dialoguebox.gotoAndStop(0);
		this.answerbox1.gotoAndStop(0);
		this.answerbox2.gotoAndStop(0);
		this.textdisplay = 0;
		this.interact = 0;
		this.currNPC = 0;
		this.delay = 0;
	}
	
	//console.log(this.delay);
	
	// collision detection - remove every obstacle bunny that is touching
	// our debug character
	
	var pBounds = this.bunny.getBounds();

	/*for (var i = 0; i < stageWorld.children.length; i++) {
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
	*/
	this.centerCameraPosition(bunny.position.x, bunny.position.y);

	this.text.setText(DEBUG_MODE ? (Math.round(Game.fps) + " FPS") : "");
}

function twsOnKeyDown(keyCode)
{
	// switch screens on ESC press
	if (arrayContains(KEYS_EXIT,keyCode))
	{
		Game.setScreen(TestMenuScreen);
		//Game.setScreen(SampleMiniGame);
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
		this.doge.position.y = -90010;

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
			"war so civl","ken burns","wow","such game","many educate","nick lytle is the man","aeiou","egg of easter"];
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
SampleMiniGame = new Screen({
init: function()
	{
		//this.doge = Images.createSprite("doge.png");
		//this.stage.addChild(this.doge);

		//this.doge.position.x = -13370;
		//this.doge.position.y = -13370;

		/*this.testWords = new PIXI.Text("CIVIL WAR PROJECT 2014", {
			font : "56px Arial",
			fill: "001166",
			wordWrap: true,
			wordWrapWidth: 800
		});*/
		//this.testWords.position.x = 0;
		//this.testWords.position.y = STAGE_H/3;
		//this.stage.addChild(this.testWords);

this.testWords = new PIXI.Text("CIVIL WAR PROJECT 2014", {
			font : "56px Arial",
			fill: "001166",
			wordWrap: true,
			wordWrapWidth: 800
		});
		this.testWords.position.x = 0;
		this.testWords.position.y = STAGE_H/3;
		this.stage.addChild(this.testWords);
		// gonna need to add the map, then add the overlays at the correct positions
		// could either add the right objects at the right time, or just play with visibility if thats a thing
		//new PIXI.Sprite(textureGreen);
		//var textureMarker = PIXI.Texture.fromImage("lee.png");
		//this.marker = new PIXI.Sprite(textureMarker);
		//this.marker = Images.createSprite("lee.png");
		//this.marker.mousedown = function(){
		//alert("This is my alert!");
		//};
		//this.marker.mousedown = function () {
		//alert("This is an alert!");
		//};
		var markTexture = [];
	markTexture.push(Images.getTexture("lee.png"));
	markTexture.push(Images.getTexture("lee_h.png"));
	this.marker = new graphnode(new PIXI.MovieClip(markTexture), "start",[]);
	this.mark2 = new graphnode(new PIXI.MovieClip(markTexture), "end",[this.marker]);
	this.marker.adjacent.push(this.mark2);
		this.stage.addChild(this.marker.sprite);
		this.stage.addChild(this.mark2.sprite);
		this.marker.sprite.position.x = 100;
		this.marker.sprite.position.y = 30;
		this.mark2.sprite.position.x = 200;
		this.graph = [this.marker,this.mark2];
		this.playernode = 0;
		this.moves = 10;
	},
	update: function(delta)
	{
		//gonna need to ensure the player's position is updated
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
		//need to check graph for valid move, sleep for a few seconds while disabling input to make it look like comp is "thinking"
		//then process comp move and execute it
		for(var i = 0; i < this.graph.length; i++){
		if(this.graph[i].touching(point) && this.graph[this.playernode].isAdj(this.graph[i]) && this.moves > 0){
		this.graph[this.playernode].setinvis();
		this.graph[i].setvis();
		this.playernode = i;
		this.moves = this.moves - 1;
		}
		}
	}
});