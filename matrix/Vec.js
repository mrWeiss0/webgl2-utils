"use strict";

/*
 * Abstract parent class for all vector classes.
 *
 * Implements common methods and private
 * helper methods for subclasses.
 */
class Vec extends _Mat {
	/*
	 * Create a vector with the given values,
	 * similar to GLSL matN constructor.
	 * Values can be a list of Scalars, Vectors or Arrays.
	 *
	 * A single value creates a vector filled with that value.
	 */
	constructor(...val) {
		super(...val);
		if(this.val.length == 1)
			this.val = new Array(this.constructor.n).fill(this.val[0]);
		else if(this.val.length < this.constructor.n)
			throw new Error("Too few components to create " + this.constructor.name);
		else if(this.val.length > this.constructor.n)
			throw new Error("Too many components to create " + this.constructor.name);
	}
	
	/* Return the modulo of the vector */
	get modulo() {
		if(this._modulo == null)
			this._modulo = Math.sqrt(this.val.reduce((x, y) => x + y**2, 0));
		return this._modulo;
	}
	
	/* Return the normalized vector */
	normalize() {
		let m = this.modulo;
		return new this.constructor(...this.val.map((e) => e / m));
	}
	
	mul(m) {
		if(m instanceof this.constructor)
			return this._mulv(m);
		if(m instanceof Mat && m.constructor.n == this.constructor.n)
			return this._mulm(m);
		throw new TypeError("Cannot multiply " + this.constructor.name + " with " + m.constructor.name);
	}
	
	/* Internal vector per matrix method, return the resulting vector */
	_mulm(m) {
		let n = this.constructor.n;
		let mult = new Array(n).fill(0);
		for(let i = 0; i < n; i++)
			for(let j = 0; j < n; j++)
				mult[i] += this.val[j] * m.val[i*n + j];
		return new this.constructor(...mult);
	}
	
	/* Internal vector dot product method, return the resulting scalar */
	_mulv(v) {
		let n = this.constructor.n;
		let mult = 0;
		for(let i = 0; i < n; i++)
			mult += this.val[i] * v.val[i];
		return mult;
	}
	
	toString() {
		return "[ " + this.val.map(x => x.toPrecision(3)).join(", ") + " ]";
	}
}