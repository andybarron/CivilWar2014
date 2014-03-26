function Screen(cfg)
{

	this.init = validateFunction(cfg.init);
	this.update = validateFunction(cfg.update);
	this.onKeyDown = validateFunction(cfg.onKeyDown);
	this.onMouseDown = validateFunction(cfg.onMouseDown);

	this.backgroundColor = validateObject(cfg.backgroundColor,DEFAULT_BACKGROUND_COLOR);

	this.stage = new PIXI.DisplayObjectContainer();

	this.init();
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