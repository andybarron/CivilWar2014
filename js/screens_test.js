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
this.setenemy = function(){
this.sprite.gotoAndStop(2);
}
this.setescape = function(){
this.sprite.gotoAndStop(3);
}
this.isAdj = function(node){
for(var key in adjacent){
if(adjacent[key] == node){
return true;
}
}
return false;
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

	// add some random grass
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
	this.AllOfTheNPCs = [];
	LoadNPCs(this.AllOfTheNPCs);
	
	//Add NPC's to the world
	for(var i = 0; i < this.AllOfTheNPCs.length;i++){
		this.AllOfTheNPCs[i]["MovieClip"] = new PIXI.MovieClip(this.AllOfTheNPCs[i].texture);
		
		var current = this.AllOfTheNPCs[i].MovieClip;
		
		current.anchor.x = 0.5;
		current.anchor.y = 0.5;
		current.position.x = this.AllOfTheNPCs[i].x;
		current.position.y = this.AllOfTheNPCs[i].y;
		current.scale = new PIXI.Point(this.AllOfTheNPCs[i].scale, this.AllOfTheNPCs[i].scale);
		stageWorld.addChild(current);
		
		//console.log(this.AllOfTheNPCs[i].dialogue.Yes);
	}

	/*
	
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
	
	*/

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
	/*
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
	*/
	
	// Player character
	stageWorld.addChild(this.bunny);
	
	// add fps text last to make sure it's on top of everything
	// (ow ow)

	//stageWorld.addChild(this.text);
	
	//new dialogue box
	this.dialoguetext1 = new PIXI.Text("", {
			font : "24px Arial",
			fill : "white"
		});
	this.dialoguetext1.position.x = 20;
	this.dialoguetext1.position.y = 475;
	//this.dialoguetext1.fixed = true;
	this.ui.addChild(this.dialoguetext1);
	this.dialoguetext1.setText("");
	
	this.dialoguetext2 = new PIXI.Text("", {
			font : "24px Arial",
			fill : "white"
		});
	this.dialoguetext2.position.x = 20;
	this.dialoguetext2.position.y = 500;
	//this.dialoguetext2.fixed = true;
	this.ui.addChild(this.dialoguetext2);
	this.dialoguetext2.setText("");
	
	this.dialoguetext3 = new PIXI.Text("", {
			font : "24px Arial",
			fill : "white"
		});
	this.dialoguetext3.position.x = 20;
	this.dialoguetext3.position.y = 525;
	//this.dialoguetext3.fixed = true;
	this.ui.addChild(this.dialoguetext3);
	this.dialoguetext3.setText("");
	
	this.dialoguetext4 = new PIXI.Text("", {
			font : "24px Arial",
			fill : "white"
		});
	this.dialoguetext4.position.x = 20;
	this.dialoguetext4.position.y = 550;
	//this.dialoguetext4.fixed = true;
	this.ui.addChild(this.dialoguetext4);
	this.dialoguetext4.setText("");
	
	this.ui.addChild(this.text);
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
	
	//OLD NPC's - delete this soon
	/*
	for(var i = 0; i < this.NPCList.length; i++){
		if(recTouch(bunny.getBounds(), this.NPCList[i].getBounds(), -30)){
			this.NPCList[i].gotoAndStop(1);
		}
		if(!recTouch(bunny.getBounds(), this.NPCList[i].getBounds(), -30)){
			this.NPCList[i].gotoAndStop(0);
		}
	}
	*/
	
	//NEW NPC's
	for(var i = 0; i < this.AllOfTheNPCs.length;i++){
		if(recTouch(bunny.getBounds(), this.AllOfTheNPCs[i].MovieClip.getBounds(),-30)){
			this.AllOfTheNPCs[i].MovieClip.gotoAndStop(1);
		}
		if(!recTouch(bunny.getBounds(), this.AllOfTheNPCs[i].MovieClip.getBounds(),-30)){
			this.AllOfTheNPCs[i].MovieClip.gotoAndStop(0);
		}
	}

	//DIALOGUE!
	//TODO: Make this less hardcoded and hacky.
	
	// press the spacebar near an NPC to start interacting (get 'em to say something).
	
	
	
	if (Input.anyKeyDown(KEYS_INTERACT) && this.textdisplay == 0 && this.interact == 0) {
	
		//OLD - delete this soon
		/*
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
		*/
		//NEW
		
		for(var i = 0; i < this.AllOfTheNPCs.length; i++){
			if(recTouch(bunny.getBounds(),this.AllOfTheNPCs[i].MovieClip.getBounds(), -30)){
				this.interact = 1;
				this.currNPC = i;
				//BRING UP INTRO DIALOGUE
				//TODO: Override this depending on conditionals
				//this.dialoguetext.setText(this.AllOfTheNPCs[i].dialogue.intro);
				
				DialogueDisplay(this.AllOfTheNPCs[i].dialogue.intro);
				
			}
		}
	}
	
	if (this.interact == 1 && this.textdisplay == 0 && !Input.anyKeyDown(KEYS_INTERACT)){
		this.textdisplay = 1;
		this.interact =  0;
	}
	
	//While interacting, choices are available to peruse.
	//So, space is to start talking, but everything else is mouse controlled.
	
	//Press space again to stop interacting
	
	if (Input.anyKeyDown(KEYS_INTERACT) && this.textdisplay == 1 && this.interact == 0) {
		/*
		this.dialoguebox.gotoAndStop(0);
		this.answerbox1.gotoAndStop(0);
		this.answerbox2.gotoAndStop(0);
		*/
		DialogueClear();
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
	 /*
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
	*/
	
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
	

	for(var c1 = 0; c1 < this.stage.children.length; c1++) {
		var ob1 = this.stage.children[c1];
		if (exists(ob1.collision) && ob1.collision == true) {
			for(var c2 = 0; c2 < this.stage.children.length; c2++) {
				var ob2 = this.stage.children[c2];
				if (c1 != c2 && exists(ob2.collision) && ob2.collision == true) {
					resolveCollisionWeighted(
						ob1,
						ob2,
						0.5,
						-10
					);
				}
			}
		}
	}
	this.stage.children.sort(spriteZSort);

	this.centerCameraPosition(bunny.position.x, bunny.position.y);

	this.text.setText(DEBUG_MODE ? (Math.round(Game.fps) + " FPS") : "");
}

function twsOnKeyDown(keyCode)
{
	// switch screens on ESC press
	if (arrayContains(KEYS_EXIT,keyCode))
	{
		//Game.setScreen(TestMenuScreen);
		Game.setScreen(SampleMiniGame);
	}
}

function DialogueDisplay(Text){

	//65 char per line
	
	var textpart1=" ", textpart2=" ", textpart3=" ", textpart4=" ", final1=" ", final2=" ", final3=" ", final4=" ";
	
	textpart1 = Text.substr(0,66);
	textpart2 = Text.substr(66, 131);
	textpart3 = Text.substr(132, 196);
	textpart4 = Text.substr(197, 250);
	
	//ONE LINE HERE
	var temp = textpart1.split(" ");
	for(var i = 0; i < temp.length-1;i++){
		final1 += temp[i];
		final1 += " ";
	}
	if(textpart2 == ""){
		final1 += temp[temp.length-1];
		TestWorldScreen.dialoguetext1.setText(final1);
		return;
	}
	TestWorldScreen.dialoguetext1.setText(final1);
	
	//SECOND LINE HERE
	final2 += temp[temp.length-1];
	
	var temp2 = textpart2.split(" ");
	for(var i = 0; i < temp2.length-1;i++){
		final2 += temp2[i];
		final2 += " ";
	}
	if(textpart3 == ""){
		final2 += temp2[temp2.length-1];
		TestWorldScreen.dialoguetext2.setText(final2);
		return;
	}
	TestWorldScreen.dialoguetext2.setText(final2);
	
	//Third Line Here
	final3 += temp2[temp2.length-1];

	var temp3 = textpart3.split(" ");
	for(var i = 0; i < temp3.length-1;i++){
		final3 += temp3[i];
		final3 += " ";
	}
	if(textpart4 == ""){
		final3 += temp3[temp3.length-1];
		TestWorldScreen.dialoguetext3.setText(final3);
		return;
	}
	TestWorldScreen.dialoguetext3.setText(final3);
	
	//Fourf Line Here
	final4 += temp3[temp3.length-1]
	
	if(temp4 == "")
	final4 += temp4;
	
	TestWorldScreen.dialoguetext4.setText(final4);
	
}

function DialogueClear(){
TestWorldScreen.dialoguetext1.setText("");
TestWorldScreen.dialoguetext2.setText("");
TestWorldScreen.dialoguetext3.setText("");
TestWorldScreen.dialoguetext4.setText("");
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
		/*
		First off, let me apologize for this. Everything to create the graph is hardcoded. It's ugly. I'm sorry. I really am. But this is due in a few hours, so I'm gonna leave it. Feel free to build a better system, honestly, do.
		-David
		*/
		var markTexture = [];
	markTexture.push(Images.getTexture("node.png"));
	markTexture.push(Images.getTexture("node_player.png"));
	markTexture.push(Images.getTexture("node_enemy.png"));
	markTexture.push(Images.getTexture("node_escape.png"));
	
	/*this.marker = new graphnode(new PIXI.MovieClip(markTexture), "start",[]);
	this.mark2 = new graphnode(new PIXI.MovieClip(markTexture), "end",[this.marker]);
	this.mark3 = new graphnode(new PIXI.MovieClip(markTexture), "bonus",[this.marker,this.mark2]);
	this.mark4 = new graphnode(new PIXI.MovieClip(markTexture), "namesarenotimportantrightnow",[this.marker,this.mark2, this.mark3]);
	this.marker.adjacent.push(this.mark2);
	this.marker.adjacent.push(this.mark3);
	this.marker.adjacent.push(this.mark4);
	this.mark2.adjacent.push(this.mark3);
	this.mark2.adjacent.push(this.mark4);
	this.mark3.adjacent.push(this.mark4);
		this.stage.addChild(this.marker.sprite);
		this.stage.addChild(this.mark2.sprite);
		this.stage.addChild(this.mark3.sprite);
		this.stage.addChild(this.mark4.sprite);
		this.marker.sprite.position.x = 100;
		this.marker.sprite.position.y = 30;
		this.mark2.sprite.position.x = 200;
		this.mark3.sprite.position.x = 300;
		this.mark4.sprite.position.x = 400;
		this.mark3.sprite.position.y = 50;
		this.mark3.setescape();*/
		this.graph = [];
		this.playernode = 0;
		this.enemynode = 1;
		this.moves = 100;
	//this.graph[this.playernode].setvis();
	
	strData = "50,475,\"San Antonio, Texas\",\"2,3\",2\n70,425,\"Austin, Texas\",\"1,3,4\",0\n100,445,\"Houston, Texas\",\"1,2,4,5\",0\n150,410,\"Alexandria, Louisiana\",\"2,3,5,7\",0\n200,430,\"Baton Rouge, Louisiana\",\"3,4,6,7,11\",0\n210,455,\"New Orleans, Louisiana\",\"5,\",5\n205,375,\"Jackson, Mississippi\",\"4,5,8,10\",0\n185,320,\"Little Rock, Arkansas\",\"7,9,15,16\",1\n270,345,\"Birmingham, Alabama\",\"8,10,16,17\",1\n270,375,\"Montgomery, Alabama\",\"7,9,11,17\",0\n275,420,\"Tallahassee, Florida\",\"5,10,12\",0\n365,430,\"St. Augustine, Florida\",\"11,13,18\",0\n375,475,\"Lakeland, Florida\",\"12,14\",0\n400,515,\"Everglades, Florida\",\"13,\",6\n175,270,\"Springfield, Missouri\",\"8,19\",0\n260,300,\"Nashville, Tennessee\",\"8,9,20\",0\n310,360,\"Atlanta, Georgia\",\"9,10,18,22\",0\n365,375,\"Savannah, Georgia\",\"12,17,23\",0\n185,260,\"Saint Louis, Missouri\",\"15,27\",0\n270,265,\"Louisiville, Kentucky\",\"16,21,31\",0\n355,275,\"Roanoke, Virginia\",\"20,22,24,35,36\",1\n360,335,\"Columbia, South Carolina\",\"17,21,23\",0\n395,345,\"Charleston, South Carolina\",\"18,22,25,42\",4\n405,295,\"Raleigh, North Carolina\",\"21,25\",0\n430,310,\"Jacksonville, North Carolina\",\"23,24\",0\n155,185,\"Des Moines, Iowa\",\"27,29\",0\n205,220,\"Springfield, Illinois\",\"19,26,29,30\",0\n210,145,\"Madison, Wisconsin\",\"26,29\",2\n225,190,\"Chicago, Illinois\",\"27,28,30\",0\n250,235,\"Indianapolis, Indiana\",\"27,29,31\",0\n310,195,\"Cincinnati, Ohio\",\"27,29,32\",0\n210,145,\"Detroit, Michigan\",\"27,29,33\",2\n305,220,\"Columbus, Ohio\",\"27,29,34\",0\n295,240,\"Cleveland, Ohio\",\"27,29,35\",0\n355,230,\"Charleston, West Virginia\",\"27,29,36\",0\n405,248,\"Richmond, Virginia\",\"27,29,37\",0\n370,190,\"Pittsburgh, Pennysylvania\",\"27,29,38\",0\n420,215,\"Annapolis, Maryland\",\"27,29,39\",0\n430,195,\"Philadelphia, Pennysylvania\",\"27,29,40\",0\n435,140,\"Rochester, New York\",\"27,29,41\",2\n385,135,\"Albany, New York\",\"27,29,42\",0\n450,175,\"New York, New York\",\"27,29,43\",0\n485,130,\"Boston, Massachusetts\",\"27,29,44\",0\n465,95,\"Montpelier, Vermont\",\"27,29,45\",2";
	//all this code shamelessly stolen from http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data
    	// Check to see if the delimiter is defined. If not,
    	// then default to comma.
		strDelimiter = null;
    	strDelimiter = (strDelimiter || ",");

    	// Create a regular expression to parse the CSV values.
    	var objPattern = new RegExp(
    		(
    			// Delimiters.
    			"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

    			// Quoted fields.
    			"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

    			// Standard fields.
    			"([^\"\\" + strDelimiter + "\\r\\n]*))"
    		),
    		"gi"
    		);


    	// Create an array to hold our data. Give the array
    	// a default empty first row.
    	var arrData = [[]];

    	// Create an array to hold our individual pattern
    	// matching groups.
    	var arrMatches = null;


    	// Keep looping over the regular expression matches
    	// until we can no longer find a match.
    	while (arrMatches = objPattern.exec( strData )){

    		// Get the delimiter that was found.
    		var strMatchedDelimiter = arrMatches[ 1 ];

    		// Check to see if the given delimiter has a length
    		// (is not the start of string) and if it matches
    		// field delimiter. If id does not, then we know
    		// that this delimiter is a row delimiter.
    		if (
    			strMatchedDelimiter.length &&
    			(strMatchedDelimiter != strDelimiter)
    			){

    			// Since we have reached a new row of data,
    			// add an empty row to our data array.
    			arrData.push( [] );

    		}


    		// Now that we have our delimiter out of the way,
    		// let's check to see which kind of value we
    		// captured (quoted or unquoted).
    		if (arrMatches[ 2 ]){

    			// We found a quoted value. When we capture
    			// this value, unescape any double quotes.
    			var strMatchedValue = arrMatches[ 2 ].replace(
    				new RegExp( "\"\"", "g" ),
    				"\""
    				);

    		} else {

    			// We found a non-quoted value.
    			var strMatchedValue = arrMatches[ 3 ];

    		}


    		// Now that we have our value string, let's add
    		// it to the data array.
    		arrData[ arrData.length - 1 ].push( strMatchedValue );
    	}
	
	for(var key in arrData){
	//alert(arrData[key][2]);
	var tempnode = new graphnode(new PIXI.MovieClip(markTexture), arrData[key][2],[]);
	this.stage.addChild(tempnode.sprite);
	tempnode.sprite.position.x = arrData[key][0];
	tempnode.sprite.position.y = arrData[key][1];
	this.graph.push(tempnode);
	}
	
	
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
		if (this.playernode == 2){
		alert("you win!");
		this.graph[this.playernode].setinvis();
		Game.setScreen(TestWorldScreen);
		this.playernode = 0;
		}
	}
    
});