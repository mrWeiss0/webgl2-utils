import {EventHandler} from "./index.js";

/*
 * Listens to the following mouse events:
 * `click`, `dblclick`, `auxclick`, `mousedown`, `mouseup`,
 * `mousemove`, `contextmenu`, `wheel`, `mouseenter`, `mouseleave`.
 *
 * The object stores the state of the pressed `buttons` and mouse position `x` and `y`,
 * corresponding to `MouseEvent.offsetX` and `MouseEvent.offsetY`.
 *
 * Property hideMenu can be set to true to prevent
 * context menu from showing on `contextmenu` event.
 */
export class MouseEventHandler extends EventHandler {
	/* Create a new instance listening on `target` */
	constructor(target) {
		super(target,
			"click", "dblclick", "auxclick", "mousedown", "mouseup",
			"mousemove", "contextmenu", "wheel", "mouseenter", "mouseleave");
		this.register(this);
		this._hideMenu = false;
		this._x = 0;
		this._y = 0;
		this._buttons = 0;
		this._pointerLock = false;
		this._onpointerlockchange = this._pointerlocklistener.bind(this);
	}
	
	/* The current mouse X coordinate relative to target */
	get x() {
		return this._x;
	}
	
	/* The current mouse Y coordinate relative to target */
	get y() {
		return this._y;
	}
	
	/* The currently pressed buttons represented as in `MouseEvent.buttons` */
	get buttons() {
		return this._buttons;
	}
	
	/*
	 * If true, the context menu won't show up when `contextmenu` events are fired.
	 * Observers are still notified of the event
	 */
	get hideMenu() {
		return this._hideMenu;
	}
	
	/* Set the hideMenu property */
	set hideMenu(hide) {
		this._hideMenu = !!hide;
	}

	get pointerLock() {
		return this._pointerLock;
	}

	enablePointerLock() {
		this._pointerLockEnabled = true;
		document.addEventListener("pointerlockchange", this._onpointerlockchange);
		document.addEventListener("pointerlockerror", this._onpointerlockerror);
	}

	disablePointerLock() {
		this._pointerLockEnabled = false;
		if(document.pointerLockElement === this.target)
			document.exitPointerLock();
		document.removeEventListener("pointerlockchange", this._onpointerlockchange);
		document.removeEventListener("pointerlockerror", this._onpointerlockerror);
	}
	
	/* Change the css property `cursor` of target */
	setCursor(cursor) {
		this.target.style.cursor = cursor;
	}
	
	/* Event listeners */

	click() {
		if(this._pointerLockEnabled)
			this.target.requestPointerLock();
	}
	
	mousedown(e) {
		this._buttons = e.buttons;
	}
	
	mouseup(e) {
		this._buttons = e.buttons;
	}
	
	mousemove(e) {
		[this._x, this._y] = [e.offsetX, e.offsetY];
	}
	
	contextmenu(e) {
		if(this.hideMenu)
			e.preventDefault();
	}
	
	mouseenter(e) {
		this._buttons = e.buttons;
	}
	
	mouseleave(e) {
		this._buttons = 0;
	}

	_pointerlocklistener() {
		if(document.pointerLockElement === this.target)
			this._pointerLock = true;
		else
			this._pointerLock = false;
	}

	_onpointerlockerror(e) {
		console.warn("Pointer lock not acquired");
	}
}
