// method one of defining a Screen: separate functions.
// make sure the names don't conflict.
// this is preferred!

TestWorldScreen = new Screen ({
	init: twsInit,
	update: twsUpdate,
	onKeyDown: twsOnKeyDown
	// onMouseDown: someOtherFunction
	// remember, you need commas after every
	// key-value pair except the last one!
});

function twsInit()
{

}

function twsUpdate(delta)
{

}

function twsOnkeyDown(keyCode)
{
	
}