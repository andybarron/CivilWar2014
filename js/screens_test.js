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

var talkedTo = 0;

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
	//Sounds.load("coin.wav");
	// IMPORTANT:
	// anything that you want to access
	// after the init() method completes
	// (i.e. in the update function),
	// you must attach it to the screen
	// via "this.variableName = ...",
	// instead of "var variableName = ..."

	var stageWorld = this.stage;
	// just a nickname so we don't have to change so much stuff
	var bg = Images.createSprite("env/town_map.png");
	bg.position.x -= 100;
	bg.position.y -= 100;
	this.stage.addChild(bg);
	
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
	}
	
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
	
	// Player character
	stageWorld.addChild(this.bunny);
	
	// add fps text last to make sure it's on top of everything
	// (ow ow)

	//stageWorld.addChild(this.text);
	
	//new dialogue box
	
	this.namebox = new PIXI.Text("",{
			font : "24px Arial",
			fill : "white",
		});
	this.namebox.position.x = 20;
	this.namebox.position.y = 425;
	this.ui.addChild(this.namebox);
	
	this.dialoguetext = new PIXI.Text("", {
			font : "24px Arial",
			fill : "white",
			wordWrap : true,
			wordWrapWidth : 750
		});
	this.dialoguetext.position.x = 20;
	this.dialoguetext.position.y = 450;
	this.ui.addChild(this.dialoguetext);
	
	this.answer1 = new PIXI.Text("", {
			font : "24px Arial",
			fill : "white"
		});
		
	this.answer1text = "";
	
	this.answer1.position.x = 20;
	this.answer1.position.y = 550;
	this.ui.addChild(this.answer1);
	this.answer1.interactive = true;
	this.answer1.mousedown = function(){
		Answer1();
	};
	this.answer1.ButtonMode = true;
		
	this.answer2 = new PIXI.Text("",{
			font : "24px Arial",
			fill : "white"
		});
	
	this.answer2text = "";
	
	this.answer2.position.x = 420;
	this.answer2.position.y = 550;
	this.ui.addChild(this.answer2);
	this.answer2.interactive = true;
	this.answer2.mousedown = function(){
		Answer2();
	};
	this.answer2.ButtonMode = true;
	
	this.ui.addChild(this.text);
	
	//I have run out of brain. If there's a way to get text from a PIXI.text object, please tell me.
	function Answer1(){
	
		oldtext = TestWorldScreen.answer1text;
		TestWorldScreen.dialoguetext.setText(TestWorldScreen.currNPC.dialogue[TestWorldScreen.answer1text]);
		try{
		TestWorldScreen.answer1.setText(TestWorldScreen.currNPC.answer1[oldtext]);
		TestWorldScreen.answer2.setText(TestWorldScreen.currNPC.answer2[oldtext]);
		TestWorldScreen.answer1text = TestWorldScreen.currNPC.answer1[oldtext];
		TestWorldScreen.answer2text = TestWorldScreen.currNPC.answer2[oldtext];
		
		}catch(e){
		TestWorldScreen.answer1.setText("");
		TestWorldScreen.answer2.setText("");
		TestWorldScreen.answer1text = "";
		TestWorldScreen.answer2text = "";
		TestWorldScreen.delay++;
		}
		
	
		
	}
	
	function Answer2(){
	
		oldtext = TestWorldScreen.answer2text;
		TestWorldScreen.dialoguetext.setText(TestWorldScreen.currNPC.dialogue[oldtext]);
		
		try{
		TestWorldScreen.answer1.setText(TestWorldScreen.currNPC.answer1[oldtext]);
		TestWorldScreen.answer2.setText(TestWorldScreen.currNPC.answer2[oldtext]);
		TestWorldScreen.answer1text = TestWorldScreen.currNPC.answer1[oldtext];
		TestWorldScreen.answer2text = TestWorldScreen.currNPC.answer2[oldtext];
		}catch(e){
		TestWorldScreen.answer1.setText("");
		TestWorldScreen.answer2.setText("");
		TestWorldScreen.answer1text = "";
		TestWorldScreen.answer2text = "";
		TestWorldScreen.delay++;
		}
	}
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
	
		for(var i = 0; i < this.AllOfTheNPCs.length; i++){
			if(recTouch(bunny.getBounds(),this.AllOfTheNPCs[i].MovieClip.getBounds(), -30)){
				this.interact = 1;
				this.currNPC = this.AllOfTheNPCs[i];
				//BRING UP INTRO DIALOGUE
				//TODO: Override this depending on conditionals

				this.namebox.setText(this.currNPC.name);
				this.dialoguetext.setText(this.AllOfTheNPCs[i].dialogue.intro);
				
				//console.log(this.AllOfTheNPCs[i].answer1.intro);
				
				try{
				this.answer1.setText(this.AllOfTheNPCs[i].answer1.intro);
				this.answer1text = this.AllOfTheNPCs[i].answer1.intro;
				
				this.answer2.setText(this.AllOfTheNPCs[i].answer2.intro);
				this.answer2text = this.AllOfTheNPCs[i].answer2.intro;
				}catch(e){
					this.delay++;
				}
				
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
		DialogueClear();
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
	//this.stage.children.sort(spriteZSort);

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

function DialogueClear(){
TestWorldScreen.dialoguetext.setText("");
TestWorldScreen.answer1.setText("");
TestWorldScreen.answer2.setText("");
TestWorldScreen.namebox.setText("");
}

// method two of defining a Screen: inlining everything
// i was going to make a comment about how this is
// not preferred, but i almost like it better?
// we shall see... -andy

TestMenuScreen = new Screen ({
	init: function()
	{
		this.testWords = new PIXI.Text("CIVIL WAR PROJECT 2014, Press up to go to the Start screen, ESC to go back to the game", {
			font : "56px Arial",
			fill: "001166",
			wordWrap: true,
			wordWrapWidth: 800
		});
		this.testWords.position.x = 0;
		this.testWords.position.y = 0;
		this.stage.addChild(this.testWords);
		
		
		this.testWords = new PIXI.Text("Created by: University of Virginia students Alexander Kaplan, Andy Barron, Anne Owen, Becca Stein, Craig Hunter, Danielle Senft, David Amin, Delphine Trinh, Divya Bhaskara, Erin Winters, Himica Kumar, Hunter Dewing, Jessica Ya, Nicholas Lytle, Nicole Zurita, Samuel Knox, Samuel Ogbe, Tracy Alers, Uday Varkhadkar, Zane Laughlin, Zheng Qin. ", {
			font : "25px Arial",
			fill: "001166",
			wordWrap: true,
			wordWrapWidth: 800
		});
		this.testWords.position.x = 0;
		this.testWords.position.y = 2*STAGE_H/3;
		this.stage.addChild(this.testWords);


	},
	update: function(delta)
	{

		// var interactions = 0;
		// for(var i = 0; i < talkedTo.length; i++)
		// {
		// 	interactions += talkedTo[i];
		// }
		this.inters = new PIXI.Text(talkedTo, {
			font : "56px Arial",
			fill: "001166",
			wordWrap: true,
			wordWrapWidth: 800
		});
		this.inters.position.x = 0;
		this.inters.position.y = STAGE_H/2;
		this.stage.addChild(this.inters);
	},
	onKeyDown: function(keyCode)
	{
		if (arrayContains(KEYS_EXIT,keyCode))
		{
			Game.setScreen(TestWorldScreen);
		}

		if (arrayContains(KEYS_UP,keyCode))
		{ 
			Game.setScreen(TestStartScreen);
		}
	},


});

SampleMiniGame = new Screen({
init: function()
	{
		/*
		There's an issue where on occasion the necessary assets don't load. This is bigger than just this code, but if it doesn't seem to be working when you make the change, check the console log.
		Need to implement win nodes in a better way than hard-coding them
		*/
		var backMap = PIXI.Texture.fromImage("map.png");
		var back = new PIXI.Sprite(backMap);
		this.stage.addChild(back);
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
		this.playernode = 10;
		this.enemynode = 11;
		this.moves = 100;
	//this.graph[this.playernode].setvis();
	
	strData = "50,475,\"San Antonio, Texas\",\"2,3\",2\n70,425,\"Austin, Texas\",\"1,3,4\",0\n100,445,\"Houston, Texas\",\"1,2,4\",0\n150,410,\"Alexandria, Louisiana\",\"2,3,5,7\",0\n200,430,\"Baton Rouge, Louisiana\",\"4,6,7,11\",0\n210,455,\"New Orleans, Louisiana\",\"5,\",5\n205,375,\"Jackson, Mississippi\",\"4,5,8,10\",0\n185,320,\"Little Rock, Arkansas \n Many slaves living near Little Rock followed the Union army to freedom as the Civil War progressed.\",\"7,9,15,16\",1\n270,345,\"Birmingham, Alabama \n Seth Concklin was a conductor of the Underground Railroad who moved all around the South helping fugitive slaves escape. In Alabama, he freed a free man’s wife and children\",\"8,10,16,17\",1\n270,375,\"Montgomery, Alabama\",\"7,9,11,17\",0\n275,420,\"Tallahassee, Florida\",\"5,10,12\",0\n365,430,\"St. Augustine, Florida \n Fort Mose was the first legally sanctioned residence of free black people in the United States.\",\"11,13,18\",0\n375,475,\"Lakeland, Florida\",\"12,14\",0\n400,515,\"Everglades, Florida\",\"13,\",6\n175,270,\"Springfield, Missouri\",\"8,19\",0\n260,300,\"Nashville, Tennessee\",\"8,9,20\",0\n310,360,\"Atlanta, Georgia\",\"9,10,18,22\",0\n365,375,\"Savannah, Georgia \n Holes in the floor at the First African Baptist Church in Savannah, GA provided air to fugitive slaves hiding in the tunnels below.\",\"12,17,23\",0\n185,260,\"Saint Louis, Missouri \n Mary Meachum was a free black St. Louis woman who helped slabs flee to Canada.\",\"15,27,30\",0\n270,265,\"Louisville, Kentucky \n Samuel Shockey’s Kentucky home had a trap door where fugitive slaves were hidden.\",\"16,21,34\",0\n355,275,\"Roanoke, Virginia\",\"20,22,24,35,36\",1\n360,335,\"Columbia, South Carolina\",\"17,21,23\",0\n395,345,\"Charleston, South Carolina\",\"18,22,25,43\",4\n405,295,\"Raleigh, North Carolina \n The famous abolitionist Levi coffin was born in North Carolina.\",\"21,22,25,36\",0\n430,310,\"Jacksonville, North Carolina \n The Dismal Swamp was perhaps the largest runaway colony for fugitive slaves in the entire United States. Many fugitive slaves passed through this safe haven on their way north.\",\"23,24\",0\n155,185,\"Salem, Iowa \n Jordan let John Brown stay at his farm on his last trip north before his attack on Harper’s Ferry.\",\"27,28\",0\n205,220,\"Springfield, Illinois \n John Hossack hid as many as thirteen slaves in his house. He was convicted of violating the Fugitive Slave Act for his efforts.\",\"19,26,29,30\",0\n205,140,\"Madison, Wisconsin \n Milton House was a stop on the Underground Railroad because of its proximity to a popular stagecoach line.\",\"26,29\",2\n225,190,\"Chicago, Illinois \n Levi Coffin and his wife Catherine were Quakers who sheltered over 3000 people. Because of this, Levi earned the name “President of the Underground Railroad.”\",\"27,28,30\",0\n250,235,\"Indianapolis, Indiana \n Many trustees from Eleutherian College helped fugitive slaves escape. The college itself admitted black students as early as 1856.\",\"27,29,19,34\",0\n310,195,\"Cincinnati, Ohio \n Samuel and Sally Wilson were Presbyterians who came to Cincinnati for the educational opportunities. Their home served as a stop on the Underground Railroad for at least three years.\",\"33,37,32\",0\n280,150,\"Detroit, Michigan \n The Detroit Second Baptist Church was established by 13 former slaves who left the First Baptist Church due to its discriminatory acts. It later became a safe house for fugitive slaves.\",\"27,29,33\",2\n305,220,\"Columbus, Ohio \n John Rankin was an abolitionist working in Ohio. He put a lantern in his window when it was safe for fugitives to cross the Ohio River.\",\"31,35,34\",0\n295,240,\"Oberlin, Ohio \n Cleveland was one of the last stops on the journey to Canada for fugitive slaves.\",\"30,20,33,35\",0\n355,230,\"Charleston, West Virginia \n The Jefferson County Courthouse was the cite of John Brown’s Trial after his infamous raid on Harper’s Ferry. \",\"33,34,37,21\",0\n405,248,\"Richmond, Virginia \n Fort Monroe (also known as the freedom fortress) was a military installation not occupied by the South during the Civil War where many captured slaves of war were protected. \",\"21,24,38\",0\n370,190,\"Pittsburgh, Pennsylvania \n The Gibson House where famous physician Dr. William Gibson resided, has been rumored to be a station on the Underground railroad.  Now, a restaurant is in the building! \",\"31,35,39,38\",0\n420,215,\"Bethesda, Maryland \n Former slave Josiah Henson lived here for thirty years.  He was the model for the character “Uncle Tom” in “Uncle Tom’s Cabin”. \",\"36,37,39\",0\n430,195,\"Philadelphia, Pennsylvania \n The Johnson House in Germantown was the home of the Johnson family, abolitionists who helped many escaped slaves find freedom. \",\"37,38,42,40\",0\n435,140,\"Rochester, New York \n “The North Star”, Frederick Douglass’s famous abolitionist newspaper was published here. \",\"39,42,43,44,41\",2\n385,135,\"Albany, New York \n Stephen and Harriet Myers were the “point people” in Albany for slaves traveling through the Underground Railroad. \",\"27,29,42\",0\n450,175,\"New York, New York \n David Ruggles was a major stationmaster in New York City who helped many including Frederick Douglass escape slavery. \",\"39,40,43\",0\n485,130,\"Boston, Massachusetts \n William Lloyd Garrison’s famous abolitionist newspaper, “The Liberator” was published here in Boston. \",\"40,42,23,44\",0\n465,95,\"Montpelier, Vermont \n Chauncy Knapp, Secretary of State of Vermont (1836-1840) was very active in the hiding and shuffling of slaves on the Underground Railroad. \",\"27,29,45\",2";
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
	
	//shameless stealing ends here
	
	for(var key in arrData){
	//alert(arrData[key][2]);
	var tempnode = new graphnode(new PIXI.MovieClip(markTexture), arrData[key][2],[]);
	this.stage.addChild(tempnode.sprite);
	tempnode.sprite.position.x = arrData[key][0];
	tempnode.sprite.position.y = arrData[key][1];
	this.graph.push(tempnode);
	}
	for(var adj in arrData){
	//alert(arrData[adj][3]);
	var adjArr = arrData[adj][3].split(',');
	for(var adjNode in adjArr){
	this.graph[adj].adjacent.push(this.graph[parseInt(adjArr[adjNode]) - 1]);
	}
	}
	this.graph[this.playernode].setvis();
	this.graph[0].setescape();
	this.graph[27].setescape();
	this.graph[31].setescape();
	this.graph[39].setescape();
	this.graph[43].setescape();
	this.playerturn = true;
	this.switchtimer = 120;
	},
	update: function(delta)
	{
	if(this.switchtimer < 1){
		this.switchtimer = 120;
		if(this.playerturn){
		this.graph[this.enemynode].setinvis();
		this.graph[this.playernode].setvis();
		}else{
		this.graph[this.playernode].setinvis();
		this.graph[this.enemynode].setenemy();
		}
		}else{
		this.switchtimer = this.switchtimer - 1;
		}
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
		if(this.playerturn){
		//this.graph[this.playernode].setvis();
		for(var i = 0; i < this.graph.length; i++){
		//console.log("checking node " + i);
		if(this.graph[i].touching(point) && this.graph[this.playernode].isAdj(this.graph[i]) && this.moves > 0){
		this.playerturn = false;
		console.log("MOVING TO NODE " + i);
		this.graph[this.playernode].setinvis();
		this.graph[i].setvis();
		this.playernode = i;
		this.moves = this.moves - 1;
		}
		}
		if (this.playernode == 0 || this.playernode == 27 || this.playernode == 31 || this.playernode == 39 || this.playernode == 43 ){
		alert("you win!");
		this.graph[this.playernode].setinvis();
		Game.setScreen(TestWorldScreen);
		this.playernode = 0;
		}
		if (this.enemynode == this.playernode){
		alert("you lose!");
		this.graph[this.playernode].setinvis();
		Game.setScreen(TestWorldScreen);
		this.playernode = 0;
		}
		}else{
		for(var i = 0; i < this.graph.length; i++){
		//console.log("checking node " + i);
		if(this.graph[i].touching(point) && this.graph[this.enemynode].isAdj(this.graph[i]) && i != 0 && i != 27 && i != 31 && i != 39 && i != 43){
		this.playerturn = true;
		console.log("MOVING ENEMY TO NODE " + i);
		this.graph[this.enemynode].setinvis();
		this.graph[i].setenemy();
		this.enemynode = i;
		//this.moves = this.moves - 1;
		}
		}
		if (this.enemynode == this.playernode){
		alert("you lose!");
		this.graph[this.playernode].setinvis();
		Game.setScreen(TestWorldScreen);
		this.playernode = 0;
		}
		}
	}
});

TestStartScreen = new Screen ({
	init: function()
	{
	

		this.testWords = new PIXI.Text("Welcome to the Civil War! Click anywhere to get started.", {
			font : "56px Arial",
			fill: "001166",
			wordWrap: true,
			wordWrapWidth: 800
		});
		this.testWords.position.x = 0;
		this.testWords.position.y = STAGE_H/3;
		this.stage.addChild(this.testWords);


		var textureButton = [];
		textureButton.push(Images.getTexture("playbutton.png"));
		this.button = new PIXI.MovieClip(textureButton);
		
		this.button.anchor.x = 0.5;
		this.button.anchor.y = 0.5;
		this.button.position.x = 100;
		this.button.position.y = 100;
		this.button.scale = new PIXI.Point(.2, .2);
		this.stage.addChild(this.button);
		

		this.button.interactive = true;
		this.button.mousedown = function () {
			Game.setScreen(TestWorldScreen);
		}


	},
	onKeyDown: function(keyCode)
	{
		if (arrayContains(KEYS_INTERACT,keyCode))
		{
			Game.setScreen(TestWorldScreen);
		}
	},
	onMouseDown: function(point)
	{
			Game.setScreen(TestWorldScreen);
		
	}

});