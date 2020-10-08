"use strict";

/*
 * Abstract Event Handler
 *
 * This class implements an Observable event handler for different event types.
 * Observers can register to an handler and must implement a method for each
 * type of event they want to observe, with the name of the event type.
 */
export class EventHandler {
	/*
	 * Creates an instance listening to events on `target`
	 */
	constructor(target, ...types) {
		this.types = types;
		this.target = target;
		this.observers = new Set();
		this.enabled = true;
		this._listen();
	}
	
	/* Register observer */
	register(ob) {
		this.observers.add(ob);
	}
	
	/* Unregister observer */
	unregister(ob) {
		this.observers.delete(ob);
	}
	
	/*
	 * Event listener method
	 * Calls the corresponding event type method
	 * of the observers if present.
	 */
	handleEvent(event) {
		if(this.enabled)
			for(let ob of this.observers) {
				if(ob[event.type] != null)
					ob[event.type](event);
			}
	}

	/* Add all event listeners for this handler */
	_listen() {
		for(let type of this.types)
			this.target.addEventListener(type, this);
	}

	/* Remove all event listeners for this handler */
	_unlisten() {
		for(let type of this.types)
			this.target.removeEventListener(type, this);
	}
}
