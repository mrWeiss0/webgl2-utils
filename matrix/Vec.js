import {AbstractMat, Mat} from "./index.js";

/*
 * Parent class for all vector classes.
 *
 * Implements common methods and private
 * helper methods for subclasses.
 */
export class Vec extends AbstractMat {
	/*
	 * Create a vector with the given values,
	 * similar to GLSL matN constructor.
	 * Values can be a list of scalars, vectors or arrays.
	 *
	 * A single value creates a vector filled with that value.
	 */
	constructor(...val) {
		super(...val);
		if(this.val.length == 1)
			this._val = new Array(this.constructor.n).fill(this.val[0]);
		else if(this.val.length < this.constructor.n)
			throw new Error("Too few components to create " + this.constructor.name);
		else if(this.val.length > this.constructor.n)
			throw new Error("Too many components to create " + this.constructor.name);
	}
	
	/* Modulo of the vector */
	get modulo() {
		if(this._modulo == null)
			this._modulo = Math.sqrt(this.val.reduce((x, y) => x + y**2, 0));
		return this._modulo;
	}
	
	/* Return a new vector obtained normalizing the current vector */
	normalize() {
		const m = this.modulo;
		if(m == 0 || m == 1)
			return this;
		return new this.constructor(...this.val.map((e) => e / m));
	}
	
	mul(m) {
		if(m instanceof this.constructor)
			return this._mulv(m);
		if(m instanceof Mat && m.constructor.n == this.constructor.n)
			return this._mulm(m);
		throw new TypeError("Cannot multiply " + this.constructor.name + " with " + m.constructor.name);
	}
	
	/* String representation of the vector */
	toString() {
		return "[ " + this.val.map(x => x.toPrecision(3)).join(", ") + " ]";
	}
	
	/* Internal vector per matrix method, return the resulting vector */
	_mulm(m) {
		const n = this.constructor.n;
		const mult = new Array(n).fill(0);
		for(let i = 0; i < n; i++)
			for(let j = 0; j < n; j++)
				mult[i] += this.val[j] * m.val[i*n + j];
		return new this.constructor(...mult);
	}
	
	/* Internal vector dot product method, return the resulting scalar */
	_mulv(v) {
		const n = this.constructor.n;
		const mult = 0;
		for(let i = 0; i < n; i++)
			mult += this.val[i] * v.val[i];
		return mult;
	}
}
