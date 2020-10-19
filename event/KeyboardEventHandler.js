import {EventHandler} from "./index.js";

/*
 * Listens to the following keyboard events: `keydown`, `keyup`, `blur`.
 * Target must be able to get keyboard focus, for example having `tabIndex >= 0`.
 *
 * The object stores the state of the pressed keys accessible with the `key` method.
 */
export class KeyboardEventHandler extends EventHandler {
	/* Create a new instance listening on `target` */
	constructor(target) {
		super(target, "keydown", "keyup", "blur");
		this.register(this);
		this._keys = new Map();
	}
	
	/*
	 * Returns true if the specified key is currently pressed.
	 * Keys are identified by the key code as in standard `KeyboardEvent.code`
	 */
	key(code) {
		return this._keys.get(code) || false;
	}
	
	/* Event listeners */
	
	keydown(e) {
		this._keys.set(e.code, true);
	}
	
	keyup(e) {
		this._keys.set(e.code, false);
	}
	
	blur(e) {
		this._keys.clear();
	}
}
