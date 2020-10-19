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
	
	/* Change the css property `cursor` of target */
	setCursor(cursor) {
		this.target.style.cursor = cursor;
	}
	
	/* Event listeners */
	
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
}
