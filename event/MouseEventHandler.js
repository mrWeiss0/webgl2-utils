"use strict";

import {EventHandler} from "./index.js";

/*
 * Mouse Event Handler
 *
 * Implements methods for mouse events.
 * The object stores the state of the pressed `buttons`
 * and mouse position `x` and `y`, corresponding to
 * `MouseEvent.offsetX` and `MouseEvent.offsetY`.
 * Property `hideMenu` can be set to true to prevent
 * context menu showing on contextmenu event.
 */
export class MouseEventHandler extends EventHandler {
	constructor(target) {
		super(target, "click", "dblclick", "auxclick", "mousedown", "mouseup", "mousemove", "contextmenu", "wheel", "mouseenter", "mouseleave");
		this.register(this);
		this._hideMenu = false;
		this._x = 0;
		this._y = 0;
		this._buttons = 0;
	}
	
	get x() {
		return this._x;
	}
	
	get y() {
		return this._y;
	}
	
	get buttons() {
		return this._buttons;
	}
	
	get hideMenu() {
		return this._hideMenu;
	}
	
	set hideMenu(hide) {
		this._hideMenu = !!hide;
	}
	
	/* Change the target css property `cursor` */
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
