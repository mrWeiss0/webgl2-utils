import {loadFile} from "../index.js";
import {ProgramWrapper} from "./index.js";

/*
 * This class loads the shaders and creates the programs
 */
export class ProgramLoader {
	/* Create an instance that references the given app */
	constructor(app) {
		this.app      = app;
		this.shaders  = new Map();
		this.programs = [];
	}
	
	/*
	 * Create and compile a shader loading the
	 * source code from url.
	 * Fails if the shader name is already taken
	 */
	loadShader(filename, type, path="") {
		const url = path + filename;
		if(this.shaders.has(url))
			throw new Error("Shader " + url + " already present.");
		const pr = loadFile(url)
			.then(response => response.text())
			.then(text => this._createShaderSource(text, type));
		this.shaders.set(url, pr);
		return pr;
	}
	
	/*
	 * Create and compile a shader with the given source code.
	 * Fails if the shader name is already taken
	 */
	addShaderSource(src, type, name) {
		if(this.shaders.has(name))
			throw new Error("Shader " + name + " already present.");
		const pr = this._createShaderSource(src, type);
		this.shaders.set(name, pr);
		return pr;
	}
	
	/*
	 * Create a program in the app object,
	 * attach the shaders with the given names,
	 * link the program and detach the sahders.
	 * Fails if the specified name is already taken in the app object
	 * or if a shader needed is not present
	 */
	addProgram(name, shaderNames, path="") {
		const glContext = this.app.glContext;
		if(this.app._programs.has(name))
			throw new Error("Program " + name + " already present.");
		const pr = this._createProgram(name, shaderNames, path);
		this.programs.push(pr);
		return pr;
	}
	
	/*
	 * Load a json from url and uses it to load shaders and programs.
	 * calling loadFromObject method
	 */
	async loadFromJSON(url) {
		const response = await loadFile(url);
		const json = await response.json();
		return await this.loadFromObject(json);
	}
	
	/*
	 * Load shaders and programs from an object with the following structure:
	 * {
	 *   path     : "path/to/shaders",
	 *   shaders  : [ { type : "VERTEX_SHADER", file : "vertex.glsl" }, ... ],
	 *   programs : [ { name : "myProg", shaders : ["vertex.glsl", "fragment.glsl"] }, ... ]
	 * }
	 *
	 * Returns a promise that resolves to an array of the programs loaded
	 * Fails if a shader can't be loaded
	 */
	async loadFromObject(obj) {
		for(const {file, type} of obj.shaders)
			this.loadShader(file, type, obj.path);
		const programs = await Promise.all(obj.programs.map(({ name, shaders }) => this.addProgram(name, shaders, obj.path)));
		this.app.glContext.flush();
		return programs;
	}
	
	/* Call deleteShader for every shader previously loaded */
	async deleteShaders() {
		for(const shader of await Promise.all(this.shaders.values()))
			this.app.glContext.deleteShader(shader);
		this.shaders.clear();
	}
	
	/*
	 * Check all shaders for compile errors
	 * Log the shader info log in the console.
	 * Return the number of compile errors.
	 * Useful only for debug
	 */
	async checkShaders() {
		const glContext = this.app.glContext;
		let errn = 0;
		for(const [name, pr] of this.shaders) {
			const shader = await pr;
			const infoLog = glContext.getShaderInfoLog(shader);
			const error = !glContext.getShaderParameter(shader, glContext.COMPILE_STATUS);
			if(error)
				errn++;
			if(infoLog) {
				const s = name + "\n" + infoLog;
				if(error)
					console.error(s);
				else
					console.log(s);
			}
		}
		return errn;
	}
	
	/*
	 * Check all programs of this loader for link errors
	 * Log the program info log in the console.
	 * Return the number of link errors.
	 * Useful only for debug
	 */
	async checkPrograms() {
		const glContext = this.app.glContext;
		let errn = 0;
		for(const program of await Promise.all(this.programs)) {
			const infoLog = glContext.getProgramInfoLog(program.glProgram);
			const error = !glContext.getProgramParameter(program.glProgram, glContext.LINK_STATUS);
			if(error)
				errn++;
			if(infoLog) {
				const s = program.name + "\n" + infoLog;
				if(error)
					console.error(s);
				else
					console.log(s);
			}
		}
		return errn;
	}
	
	/*
	 * Validate all programs of this loader and check for errors
	 * Log the program info log in the console.
	 * Return the number of errors.
	 * Useful only for debug
	 */
	async validatePrograms() {
		const glContext = this.app.glContext;
		const programs = await Promise.all(this.programs);
		for(const program of programs)
			glContext.validateProgram(program.glProgram);
		let errn = 0;
		for(const program of programs) {
			const infoLog = glContext.getProgramInfoLog(program.glProgram);
			const error = !glContext.getProgramParameter(program.glProgram, glContext.VALIDATE_STATUS);
			if(error)
				errn++;
			if(infoLog) {
				const s = program.name + "\n" + infoLog;
				if(error)
					console.error(s);
				else
					console.log(s);
			}
		}
		return errn;
	}
	
	async _createProgram(name, shaderNames, path) {
		const glContext = this.app.glContext;
		const program = new ProgramWrapper(glContext, name);
		const shaders = await Promise.all(Array.from(shaderNames, shname => {
			const pr = this.shaders.get(path + shname);
			if(pr == null)
				throw new Error("In program " + name + ": missing shader " + shname);
			return pr;
		}));
		this.app._programs.set(name, program);
		for(const shader of shaders)
			glContext.attachShader(program.glProgram, shader);
		glContext.linkProgram(program.glProgram);
		for(const shader of shaders)
			glContext.detachShader(program.glProgram, shader);
		return program;
	}

	/*
	 * Create a WebGLShader of the given type,
	 * upload the source code to the GPU and compile
	 */
	async _createShaderSource(src, type) {
		const glContext = this.app.glContext;
		if(typeof type === "string")
			type = glContext[type];
		const shader = glContext.createShader(type);
		if(!shader)
			throw new Error("Could not create shader ");
		glContext.shaderSource(shader, src);
		glContext.compileShader(shader);
		return shader;
	}
}

