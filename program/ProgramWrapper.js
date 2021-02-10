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
		this._uniformBks = new Map();
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

	/* Use this program for rendering */
	use() {
		this._glContext.useProgram(this._glProgram);
	}
	
	/*
	 * Return the location for the requested attribute name
	 */
	getAttributeLocation(name) {
		const loc = this._attributes.get(name);
		if(loc == null)
			return -1;
		return loc;
	}
	
	/*
	 * Return the location for the requested uniform name
	 */
	getUniformLocation(name) {
		const loc = this._uniforms.get(name);
		return loc;
	}

	/*
	 * Return the index for the requested uniform block name
	 */
	getUniformBlockIndex(name) {
		const idx = this._uniformBks.get(name);
		if(idx == null)
			return this.glContext.INVALID_INDEX;
		return idx;
	}

	/*
	 * Call gl.uniformBlockBinding to bind uniform block to given index
	*/
	uniformBlockBinding(name, index) {
		const block = this.getUniformBlockIndex(name);
		this._glContext.uniformBlockBinding(this._glProgram, block, index);
	}

	/*
	 * Query the GPU for all the attributes
	 * of the current program and stores their location
	 */
	queryAttributes() {
		const glContext = this._glContext;
		const n = glContext.getProgramParameter(this.glProgram, glContext.ACTIVE_ATTRIBUTES);
		for(let i = 0; i < n; i++) {
			const info = glContext.getActiveAttrib(this.glProgram, i);
			this._attributes.set(info.name, glContext.getAttribLocation(this.glProgram, info.name));
		}
	}
	
	/*
	 * Query the GPU for all the uniforms
	 * of the current program and stores their location
	 */
	queryUniforms() {
		const glContext = this._glContext;
		const n = glContext.getProgramParameter(this.glProgram, glContext.ACTIVE_UNIFORMS);
		for(let i = 0; i < n; i++) {
			const info = glContext.getActiveUniform(this.glProgram, i);
			this._uniforms.set(info.name, glContext.getUniformLocation(this.glProgram, info.name));
		}
	}
	
	/*
	 * Query the GPU for all the uniform blocks
	 * of the current program and stores their index
	 */
	queryUniformBlocks() {
		const glContext = this._glContext;
		const n = glContext.getProgramParameter(this.glProgram, glContext.ACTIVE_UNIFORM_BLOCKS);
		for(let i = 0; i < n; i++) {
			const name = glContext.getActiveUniformBlockName(this.glProgram, i);
			this._uniformBks.set(name, i);
		}
	}
}
