"use strict";

/*
 * Abstract parent class for all matrix classes.
 * Values are stored column major, as in GLSL.
 *
 * Implements common methods and private
 * helper methods for subclasses.
 */
class Mat extends _Mat {
	/*
	 * Create a matrix with the given values,
	 * similar to GLSL matN constructor.
	 * Values can be a column major list of
	 * Scalars, Vectors or Arrays, or another Matrix.
	 *
	 * If another Matrix is given
	 * the values are copied to the output;
	 * any values not filled in are the identity matrix.
	 *
	 * A single value creates a diagonal Matrix.
	 */
	constructor(...val) {
		super(...val);
		let n = this.constructor.n;
		if(this.val.length == 1) {
			let v = this.val[0];
			this.val = new Array(this.constructor.n**2).fill(0);
			for(let i = 0; i < n; i++)
				this.val[i*(n+1)] = v;
		} else if(this.val.length < this.constructor.n**2)
			throw new Error("Too few components to create " + this.constructor.name);
		else if(this.val.length > this.constructor.n**2)
			throw new Error("Too many components to create " + this.constructor.name);
	}
	
	/* Identity matrix */
	static get identity() {
		return new this(1);
	}
	
	/* Return the transposed matrix */
	transpose() {
		let n = this.constructor.n;
		let t = new Array(n**2);
		for(let i = 0; i < n; i++)
			for(let j = 0; j < n; j++)
				t[i*n + j] = this.val[i + j*n];
		return new this.constructor(...t);
	}
	
	/* Return the trace of the matrix */
	get trace() {
		if(this._trace == null) {
			let n = this.constructor.n;
			this._trace = 0;
			for(let i = 0; i < n; i++)
				this._trace += this.val[i*(n+1)];
		}
		return this._trace;
	}
	
	/* Return the determinant of the matrix */
	get det() {}
	
	/* Return the inverse matrix */
	invert() {}
	
	/* Return the `i`th column as Vector */
	col(i) {}
	
	/* Return the `i`th column as Array */
	_col(i) {
		let n = this.constructor.n;
		if(i >= n)
			throw new RangeError("Invalid column index for " + this.constructor.name);
		return this.val.slice(i*n, (i+1)*n);
	}
	
	mul(m) {
		if(m instanceof this.constructor)
			return this._mulm(m);
		if(m instanceof Vec && m.constructor.n == this.constructor.n)
			return this._mulv(m);
		throw new TypeError("Cannot multiply " + this.constructor.name + " with " + m.constructor.name);
	}
	
	/* Internal matrix product method, return the resulting matrix */
	_mulm(m) {
		let n = this.constructor.n;
		let mult = new Array(n**2).fill(0);
		for(let i = 0; i < n; i++) {
			let r = i * n;
			for(let j = 0; j < n; j++)
				for(let k = 0; k < n; k++)
					mult[i*n + j] += this.val[j + k*n] * m.val[r + k];
		}
		return new this.constructor(...mult);
	}
	
	/* Internal matrix per vector method, return the resulting vector */
	_mulv(v) {
		let n = this.constructor.n;
		let mult = new Array(n).fill(0);
		for(let i = 0; i < n; i++)
			for(let j = 0; j < n; j++)
				mult[i] += this.val[i + j*n] * v.val[j];
		return new v.constructor(...mult);
	}
	
	/* Helper method for inverse matrix */
	_invert(adj) {
		if(!this.det)
			throw new Error("Matrix is not invertible");
		let idet = 1. / this.det;
		for(let i = 0; i < adj.length; i++)
			adj[i] = adj[i] * idet;
		return new this.constructor(...adj);
	};
	
	toString() {
		let n = this.constructor.n;
		let str = "[";
		for(let i = 0; i < n; i++) {
			if(i) str += "\n ";
			for(let j = 0; j < n; j++) {
				if(j) str += ",";
				str += " " + this.val[i + j*n].toPrecision(3);
			}
		}
		str += " ]";
		return str;
	}
}
