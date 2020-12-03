import {ProgramLoader} from "./program/index.js"
import {MouseEventHandler, KeyboardEventHandler} from "./event/index.js"

/*
 * Abstract class App
 *
 * Subclasses must implement update() and draw() methods
 */
export class App {
	/*
	 * Creates an instance of App and
	 * gets the webGL rendering context
	 * associated with the canvas
	 */
	constructor(canvas, timeStep = 0) {
		this.glContext   = canvas.getContext("webgl2");
		if(!this.glContext)
			throw new Error("No WebGL2 context");
		this.timeStep    = timeStep;
		this._programs   = new Map();
		this._lag        = 0;
		this._t_old      = 0;
		this._running    = false;
		this._loopBinded = this._loop.bind(this);
		this._mouse      = null;
		this._keyboard   = null;
	}
	
	/* Get the current canvas */
	get canvas() {
		return this.glContext.canvas;
	}
	
	/* Get the time ahead of update.
	 *
	 * If time step is non zero, when draw is called
	 * lag is the residual time of the frame
	 * lower than the time step hence not updated.
	 * If time step is variable (`timeStep == 0`)
	 * when draw is called lag is always 0.
	 */
	get lag() {
		return this._lag;
	}
	
	/* Get the time step */
	get timeStep() {
		return this._timeStep;
	}
	
	/* Set the time step to a non negative value */
	set timeStep(dt) {
		const ndt = +dt;
		if(!(ndt >= 0))
			throw new Error("Time step must be a non negative number in milliseconds");
		this._timeStep = ndt;
	}
	
	/* Get the instance of ProgramWrapper from the name */
	getProgram(name) {
		return this._programs.get(name);
	}
	
	/* Create a ProgramLoader instance for the current app */
	getProgramLoader() {
		return new ProgramLoader(this);
	}
	
	/* Initialize the mouse event listener for the current canvas */
	initMouse() {
		if(this._mouse == null)
			this._mouse = new MouseEventHandler(this.canvas);
	}
	
	/* Get the mouse event handler if present */
	get mouse() {
		return this._mouse;
	}
	
	/* Initialize the keyboard event listener for the current canvas */
	initKeyboard() {
		if(this._keyboard == null)
			this._keyboard = new KeyboardEventHandler(this.canvas);
	}
	
	/* Get the keyboard event handler if present */
	get keyboard() {
		return this._keyboard;
	}
	
	/* Initialize and run the loop */
	run() {
		if(this._running)
			return;
		this._t_old = performance.now();
		this._lag = 0;
		this._running = true;
		requestAnimationFrame(this._loopBinded);
	}
	
	/* Stop the loop */
	stop() {
		this._running = false;
	}

	/* Resize the canvas */
	resize(width, height, hdpi=true) {
		let pixr = hdpi && window.devicePixelRatio || 1;
		
		this.canvas.width  = Math.floor(width  * pixr);
		this.canvas.height = Math.floor(height * pixr);
	}
	
	/*
	 * Logic update function
	 * Called every `timeStep` milliseconds
	 * with fixed time step if it is non zero,
	 * otherwise it is called every frame
	 * with a variable time step.
	 *
	 * `dt` : time elapsed since last update
	 */
	update(dt) {}
	
	/* Rendering function called once per frame */
	draw() {}
	
	/*
	 * Internal loop function
	 */
	_loop(time) {
		const dt     = time - this._t_old;
		this._t_old  = time;
		this._lag   += dt;
		
		if(this.timeStep)
			while(this._lag >= this._timeStep) {
				this.update(this._timeStep);
				this._lag -= this._timeStep;
			}
		else {
			this.update(this._lag);
			this._lag = 0;
		}
		
		this.draw();
		
		if(this._running)
			requestAnimationFrame(this._loopBinded);
	}
}
