/*
 * This class wraps a WebGLProgram
 * and stores its attributes and uniforms
 */
export class ProgramWrapper {
	/* Create a webgl program from the given webgl context and sets a name */
	constructor(glContext, name) {
		this._glProgram  = glContext.createProgram();
		if(!this._glProgram)
			throw new Error("Could not create program " + name);
		this._glContext  = glContext;
		this._name       = name;
		this._attributes = new Map();
		this._uniforms   = new Map();
	}
	
	/* Get the webgl context associated with the program */
	get glContext() {
		return this._glContext;
	}
	
	/* Get the WebGLProgram instance referenced by this object */
	get glProgram() {
		return this._glProgram;
	}
	
	/* Get the name of this program */
	get name() {
		return this._name;
	}
	
	/*
	 * Return an object for the requested attribute name
	 * containing the properties location, size and type
	 */
	getAttribute(name) {
		return this._attributes.get(name);
	}
	
	/*
	 * Return an object for the requested uniform name
	 * containing the properties location, size and type
	 */
	getUniform(name) {
		return this._uniforms.get(name);
	}
	
	/*
	 * Query the GPU for all the attributes
	 * of the current program and stores the data
	 */
	queryAttributes() {
		const glContext = this._glContext;
		const n = glContext.getProgramParameter(this.glProgram, glContext.ACTIVE_ATTRIBUTES);
		for(let i = 0; i < n; i++) {
			const info = glContext.getActiveAttrib(this.glProgram, i);
			this._attributes.set(info.name, {
				location: glContext.getAttribLocation(this.glProgram, info.name),
				size: info.size,
				type: info.type
			});
		}
	}
	
	/*
	 * Query the GPU for all the attributes
	 * of the current program and stores the data
	 */
	queryUniforms() {
		const glContext = this._glContext;
		const n = glContext.getProgramParameter(this.glProgram, glContext.ACTIVE_UNIFORMS);
		for(let i = 0; i < n; i++) {
			const info = glContext.getActiveUniform(this.glProgram, i);
			this._uniforms.set(info.name, {
				location: glContext.getUniformLocation(this.glProgram, info.name),
				size: info.size,
				type: info.type
			});
		}
	}
}
