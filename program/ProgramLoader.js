import {loadFile} from "../utils.js";
import {ProgramWrapper} from "./index.js";

/*
 * This class loads the shaders and creates the programs
 */
export class ProgramLoader {
	/* Create an instance that references the given app */
	constructor(app) {
		this.app      = app;
		this.shader   = new Map();
		this.programs = [];
	}
	
	/*
	 * Create and compile a shader loading the
	 * source code from url.
	 * Fails if the shader name is already taken
	 */
	async loadShader(url, type, name=url) {
		this._checkShaderName(name);
		// Lock shader name
		this.shader.set(name, null);
		try {
			const src = await loadFile(url).then(response => response.text());
			this._createShaderSource(src, type, name);
		} catch(e) {
			this.shader.delete(name);
			throw e;
		}
	}
	
	/*
	 * Create and compile a shader with the given source code.
	 * Fails if the shader name is already taken
	 */
	addShaderSource(src, type, name) {
		this._checkShaderName(name);
		this._createShaderSource(src, type, name);
	}
	
	/*
	 * Create a program in the app object,
	 * attach the shaders with the given names,
	 * link the program and detach the sahders.
	 * Fails if the specified name is already taken in the app object
	 * or if a shader needed is not present
	 */
	addProgram(name, shaderNames) {
		const glContext = this.app.glContext;
		if(this.app._programs.has(name))
			throw new Error("Program " + name + " already present.");
		const program = new ProgramWrapper(glContext);
		
		const shaders = new Array(shaderNames.length);
		for(let i = 0; i < shaderNames.length; i++) {
			const shaderName = shaderNames[i];
			const shader = this.shader.get(shaderName);
			if(!shader)
				throw new Error("Program " + name + ": shader " + shaderName + " does not exist.");
			shaders[i] = shader;
		}
		
		for(const shader of shaders)
			glContext.attachShader(program.glProgram, shader);
		glContext.linkProgram(program.glProgram);
		for(const shader of shaders)
			glContext.detachShader(program.glProgram, shader);
		
		this.app._programs.set(name, program);
		this.programs.push(program);
		return program;
	}
	
	/*
	 * Load a json from url and uses it to load shaders and programs.
	 * calling loadFromObject method
	 */
	async loadFromJSON(url) {
		const json = await loadFile(url).then(response => response.json());
		this.addProgramsFromObject(json);
	}
	
	/*
	 * Load shaders and programs from an object with the following structure:
	 * {
	 *   shaders  : [ {type : "VERTEX_SHADER", url : "vertex.glsl" }, ... ]
	 *   programs : [ { name : "myProg", shaders : ["vertex.glsl", "fragment.glsl"] }, ... ]
	 * }
	 *
	 * Fails if a shader can't be loaded
	 */
	async loadFromObject(obj) {
		await Promise.all(obj.shaders.map(({url, type}) => this.loadShader(url, type)));
		for(const {name, shaders} of obj.programs)
			this.addProgram(name, shaders);
	}
	
	/* Call deleteShader for every shader previously loaded */
	deleteShaders() {
		for(const shader of this.shader.values())
			this.app.glContext.deleteShader(shader);
		this.shader.clear();
	}
	
	/*
	 * Check all shaders for compile errors
	 * Log the shader info log in the console.
	 * Return the number of compile errors.
	 * Useful only for debug
	 */
	checkShaders() {
		const glContext = this.app.glContext;
		let errn = 0;
		for(const [name, shader] of this.shader) {
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
	checkPrograms() {
		const glContext = this.app.glContext;
		let errn = 0;
		for(const program of this.programs) {
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
	validatePrograms() {
		const glContext = this.app.glContext;
		for(const program of this.programs)
			glContext.validateProgram(program.glProgram);
		let errn = 0;
		for(const program of this.programs) {
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
	
	/* Trow an error if the specified shader name is already present in this loader */
	_checkShaderName(name) {
		if(this.shader.has(name))
			throw new Error("Shader " + name + " already present.");
	}
	
	/*
	 * Create a WebGLShader of the given type,
	 * upload the source code to the GPU and compile
	 */
	_createShaderSource(src, type, name) {
		const glContext = this.app.glContext;
		if(typeof type === "string")
			type = glContext[type];
		const shader = glContext.createShader(type);
		if(!shader)
			throw new Error("Could not create shader " + name);
		glContext.shaderSource(shader, src);
		glContext.compileShader(shader);
		this.shader.set(name, shader);
		return shader;
	}
}

