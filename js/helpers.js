function exists(thing)
{
	return (thing !== null) && (typeof thing !== "undefined");
}

function getData(obj)
{
	return Object.keys(obj).sort();
}

function trimFilename(input)
{
	return input.substr(0, input.lastIndexOf('.')) || input;
}

function debugInput()
{
	if(exists(DEBUG_INPUT) && DEBUG_INPUT == true)
	{
		debug.apply(null,arguments);
	}
}

function debug()
{
	if(exists(DEBUG_MODE) && DEBUG_MODE == true && exists(console) && exists(console.log))
	{
		for(var i = 0; i < arguments.length; i++) {
			console.log(arguments[i]);
		}
	}
}

function getRandomInt (max) { //max is EXCLUSIVE?!
	max --;
	var min = 0;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function arrayGetRandom(array)
{
	return array[getRandomInt(array.length)];
}

function arrayRemove(array,element)
{
	for( var i = 0; i < array.length; i ++ )
	{
		var found = array[i];
		if(found === element)
		{
			array.splice(i,1);
			return true;
		}
	}
	return false;
}

function arrayContains(array,element)
{
	return array.indexOf(element) != -1;
}

function recTouch(a,b,error) // error > 0 is easier to hit (bigger)
{
	if(!exists(error))
	{
		error = 0;
	}

	var L1 = a.x - error;
	var L2 = b.x;

	var R1 = a.x + a.width + error;
	var R2 = b.x + b.width;

	var B1 = a.y - error;
	var B2 = b.y;

	var T1 = a.y + a.height + error;
	var T2 = b.y + b.height;

	if(R1<L2 || R2<L1 || T1<B2 || T2<B1)
	{
		return false;
	}
	else
	{
		return true;
	}
}

// var a = new PIXI.Rectangle(0.0,0.0,10.0,20.0);
// var b = new PIXI.Rectangle(7.0,3.0,20.0,10.0);
function rectangleOverlapOrNull(r1,r2,err)
{
	var error = validateObject(err,0.0);
	var modified = (error != 0.0);
	var a = !modified ? r1 : r1.clone();
	var b = !modified ? r2 : r2.clone();
	if (modified) {
		var dif = -error/2.0;
		a.x += dif;
		b.x += dif;
		a.y += dif;
		b.y += dif;
		a.width -= dif;
		b.width -= dif;
		a.height -= dif;
		b.height -= dif;
	}
	var overlapX = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x,b.x));
	var overlapY = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y,b.y));
	var overlap = null;
	if (Math.min(overlapX,overlapY) != 0.0) {
		overlap = new PIXI.Rectangle();
		overlap.width = overlapX;
		overlap.height = overlapY;
		overlap.x = Math.min(a.x + a.width,b.x + b.width) - overlap.width;
		overlap.y = Math.min(a.y + a.height, b.y + b.height) - overlap.height;
	}
	return overlap;
}

// character: person to be pushed
// object: immovable obstacle
// (OPTIONAL) err: positive for larger hitboxes, negative for smaller
function resolveCollisionObject(character,object,err)
{
	var error = validateObject(err,0.0);
}

// e1: first entity
// e2: second entity
// (OPTIONAL) weight: 0.0 only moves e1; 1.0 only moves e2; 0.5 moves both equally
// (OPTIONAL) err: positive for larger hitboxes, negative for smaller
function resolveCollisionWeighted(e1,e2,weight,err)
{
	var w = validateObject(weight,0.5); // TODO clamp [0.0,1.0]
	var error = validateObject(err,0.0);
	var w1 = 1.0 - w;
	var w2 = w;
	var r1 = e1.getBounds();
	var r2 = e2.getBounds();
	var overlap = rectangleOverlapOrNull(r1,r2,error);
	if (overlap != null) {
		if (overlap.width < overlap.height) {
			if ( r1.x + r1.width/2.0 < r2.x + r2.width / 2.0 ) {
				w1 *= -1.0;
			} else {
				w2 *= -1.0;
			}
			e1.position.x += w1*overlap.width/2.0;
			e2.position.x += w2*overlap.width/2.0;
		} else {
			if ( r1.y + r1.height/2.0 < r2.y + r2.height / 2.0 ) {
				w1 *= -1.0;
			} else {
				w2 *= -1.0;
			}
			e1.position.y += w1*overlap.height/2.0;
			e2.position.y += w2*overlap.height/2.0;
		}
		return true;
	} else {
		return false;
	}
}

function wasClicked(a,b,error) // error > 0 is easier to hit (bigger)
{
	if(!exists(error))
	{
		error = 0;
	}

	var L1 = a.x - error;
	var L2 = b.x;

	var R1 = a.x + a.width + error;
	//var R2 = b.x + b.width;

	var B1 = a.y - error;
	var B2 = b.y;

	var T1 = a.y + a.height + error;
	//var T2 = b.y + b.height;

	if(L2>L1 && L2<R1 && B2>B1 && B2<T1)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function spriteZSort(a,b)
{
	if(a.position.y < b.position.y)
	{
		return -1;
	}
	else if (a.position.y > b.position.y)
	{
		return 1;
	}
	else return 0;
}

function validateObject(o,defaultValue)
{
	return exists(o) ? o : defaultValue;
}

function validateFunction(fn)
{
	return exists(fn) ? fn : doNothing;
}

function doNothing()
{
	// an empty function
	// a command to do nothing
	// such sweet irony
}

function inProximity(x1, y1, x2, y2){
	if( Math.abs(x2-x1) < 100 && Math.abs(y2-y1) < 100){
		return true;
	}else
		return false;
}