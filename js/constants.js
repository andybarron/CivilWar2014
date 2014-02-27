// enable debug logging
DEBUG_MODE = true;

// enable input debug logging
DEBUG_INPUT = false;

// input constants -
// make sure to name these after their
// intended purpose, NOT which keys they
// are on the keyboard; that info
// goes in a comment!
KEYS_UP = [38,87]; // W, UpArrow
KEYS_DOWN = [40, 83]; // S, DownArrow
KEYS_LEFT = [37, 65]; // A, LeftArrow
KEYS_RIGHT = [39, 68]; // D, RightArrow
KEYS_INTERACT = [32]; // Space
KEYS_EXIT = [27]; // Escape

// how quickly the player moves
PLAYER_SPEED = 250;

// asset info
ASSET_PATH = "assets/";
IMAGE_PATH = ASSET_PATH+"img/";
SOUND_PATH = ASSET_PATH+"snd/";

// size of game
STAGE_W = 800;
STAGE_H = 600;

// maximum time per frame
MAX_DELTA = 1.0/30;

// default screen bg color
DEFAULT_BACKGROUND_COLOR = 0xBEEFEE;