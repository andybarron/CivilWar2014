function Screen(cfg)
{

	this.init = validateFunction(cfg.init);
	this.update = validateFunction(cfg.update);
	this.onKeyDown = validateFunction(cfg.onKeyDown);
	this.onMouseDown = validateFunction(cfg.onMouseDown);

	this.backgroundColor = validateObject(cfg.backgroundColor,DEFAULT_BACKGROUND_COLOR);

	this.stage = new PIXI.DisplayObjectContainer();
	this.ui = new PIXI.DisplayObjectContainer();

	this.init();

}

// TODO add a second UI stage per screen
// for now... that'll do, pig, that'll do

// setting "child.fixed = true" will prevent objects
// from scrolling with the camera

// consider a second overlay for fixed children/objects

// DON'T manually set position of the stage outside
// of these methods, since, well, it's backwards.
// because reasons.

Screen.prototype.setCameraPosition = function(x,y) {
	var oldPos = this.getCameraPosition();
	var oldX = oldPos.x;
	var oldY = oldPos.y;

	this.translateCameraPosition(x-oldX,y-oldY);
}

Screen.prototype.translateCameraPosition = function(dx,dy) {
	this.stage.position.x -= dx;
	this.stage.position.y -= dy;
	for(var i = 0; i < this.stage.children.length; i++) {
		var child = this.stage.children[i];
		if (exists(child.fixed) && child.fixed == true) {
			child.position.x += dx;
			child.position.y += dy;
		}
	}
}

Screen.prototype.getCameraPosition = function() {
	var backwards = this.stage.position;
	return {x: -backwards.x, y: -backwards.y};
}

Screen.prototype.centerCameraPosition = function(x,y) {
	this.setCameraPosition(x-STAGE_W/2.0,y-STAGE_H/2.0);
}


function Input () {}

Input.on = false;
Input.keys = {};
Input.mouse = { x:0, y:0, down:false };

Input.keyPressListeners = [];
Input.mousePressListeners = [];

Input.keyAnchor = document;
Input.mouseAnchor = document;

Input.init = function(options)
{

	if(Input.on == true)
	{
		throw "Input already initialized!";
		return false;
	}

	if(exists(options))
	{
		if(exists(options.mouseAnchor))
			Input.mouseAnchor = options.mouseAnchor;

		if(exists(options.keyAnchor))
			Input.keyAnchor = options.keyAnchor;
	}

	var keyObj = Input.keyAnchor;
	var mouseObj = Input.mouseAnchor;

	$(keyObj).keydown(Input.keyPress);
	$(keyObj).keyup(Input.keyRelease);
	$(mouseObj).mousedown(Input.mousePress);
	$(mouseObj).mouseup(Input.mouseRelease);
	$(mouseObj).mousemove(Input.mouseMove);

	// if we want to disable context menu
	// this may or may not enable right-click functionality
	// $(mouseObject).bind('contextmenu', function(e) { return false; });

	return true;
}

Input.keyPress = function(e) {
	var code = e.which;

	if ( Input.isKeyUp(code) ) 
	{
		Input.keys[code] = true;
		debugInput("key press " + code);

		for(var i = 0; i < Input.keyPressListeners.length; i++)
		{
			Input.keyPressListeners[i].call(null,code);
		}
	}

};

Input.keyRelease = function(e) {
	var code = e.which;

	if ( Input.isKeyDown(code) ) 
	{
		delete Input.keys[code];
		debugInput("key release " + code);
	}
};

Input.mouseMove = function(e){
	Input.mouse.x = e.offsetX;
	Input.mouse.y = e.offsetY;
	// debug("mouse move (" + Input.mouse.x + "," + Input.mouse.y +")");
}

Input.mousePress = function(e) {
	if ( e.which != 1 ) return;

	var coords = {x: e.offsetX, y: e.offsetY};

	debugInput("mouse press (" + coords.x + "," + coords.y + ")");

	for(var i = 0; i < Input.mousePressListeners.length; i++)
	{
		Input.mousePressListeners[i].call(null,coords);
	}

	Input.mouse.down = true;
}

Input.mouseRelease = function(e) {
	if ( e.which != 1 ) return;

	var coords = {x: e.offsetX, y: e.offsetY};

	debugInput("mouse release (" + coords.x + "," + coords.y + ")");

	// for(var i = 0; i < Input.mousePressListeners.length; i++)
	// {
	// 	Input.mousePressListeners[i].call(null,coords);
	// }

	Input.mouse.down = false;
}

Input.isKeyDown = function(code)
{
	return exists(Input.keys[code]);
}

Input.anyKeyDown = function(codes)
{
	for(var i = 0; i < codes.length; i++)
	{
		if (Input.isKeyDown(codes[i]))
		{
			return true
		}
	}
	return false;
}

Input.isKeyUp = function(code)
{
	return !Input.isKeyDown(code);
}

Input.areKeysUp = function(codes)
{
	return !Input.areKeysUp(codes);
}

function Sounds () {}

Sounds.files = {};
Sounds.loadListeners = {};

Sounds.load = function() {
	for (var i = 0; i < arguments.length; i++)
	{
		var sndFilename = arguments[i];
		var sndName = trimFilename(sndFilename);
		var snd = new Audio(ASSET_PATH+'snd/'+sndFilename);
		snd.dataName = sndName;

		// make sounds accessible by filename
		// with and without extension
		Sounds.files[sndName] = snd;
		Sounds.files[sndFilename] = snd;

		debug('loading sound: ' + sndName);
		snd.addEventListener('canplaythrough', function()
		{
			debug('loaded sound: ' + this.dataName);
			var lis = Sounds.loadListeners[this.dataName];
			if(exists(lis))
			{
				debug('calling sound load listener(s) for sound: ' + this.dataName);
				for(var j = 0; j < lis.length; j++)
				{
					lis[j].call(null);
				}
			}
		}, false);
	}
}

// only really necessary for long looping
// sounds i.e. music
Sounds.addLoadListener = function(name, fn)
{
	if(!exists(Sounds.loadListeners[name]))
	{
		Sounds.loadListeners[name] = [];
	}
	Sounds.loadListeners[name].push(fn);
}

Sounds.play = function(name)
{
	var sound = Sounds.files[name];
	if(exists(sound))
	{
		(new Audio(sound.src)).play();
	}
	else
	{
		debug('Sound not found: ' + name);
	}
}

// TODO this is currently inconsistent;
// consider alternatives. streaming?
Sounds.loop = function(name)
{
	debug('requesting sound loop: ' + name)
	var sound = Sounds.files[name];
	if(exists(sound))
	{
		var ls = new Audio(sound.src);
		ls.loop = true;
		ls.play();

		// ls.addEventListener('ended', function() 
		// {
		// 	debug('looping sound: ' + name);
		// 	debug(getData(this));
		// 	this.currentTime = 0;
		// }, false);
		// ls.play();

		// TODO store it somewhere so we can stop it later
	}
	else
	{
		debug('Sound not found: ' + name);
	}
}

function Images () {}

Images.getTexture = function(filename)
{
	// TODO some kind of texture atlasing, etc......
	return PIXI.Texture.fromImage(IMAGE_PATH + filename, false, PIXI.scaleModes.NEAREST);
}

Images.createSprite = function(tex)
{
	return new PIXI.Sprite(tex instanceof PIXI.Texture ? tex : Images.getTexture(tex));
}