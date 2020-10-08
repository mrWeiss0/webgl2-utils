"use strict";

import {Vec} from "./index.js";

/*
 * This class is the abstract parent of the
 * matrix and vector classes and implements
 * the common methods.
 *
 * Static attribute `n` in subclasses is
 * the dimension of the matrix or vector
 * and is used for method implementations
 */
export class _Mat {
	static n = 0;
	
	/*
	 * Create an instance with the values
	 * given as a sequence of Scalars, Arrays or Vectors
	 */
	constructor(...val) {
		this._val = (Array.isArray(val[0]) ? val[0] : val)
			.flatMap(m => {
				if(m == null) return 0;
				if(typeof m === "number") return m;
				if(m instanceof Vec) return m.val;
				throw new TypeError("Cannot create " + this.constructor.name + " with " + m.constructor.name);
			});
	}
	
	/* Get the matrix values as a linear array column major order */
	get val() {
		return this._val;
	}
	
	/* Component wise add */
	add(m) {
		if(!(m instanceof this.constructor))
			throw new TypeError("Cannot add " + this.constructor.name + " with " + m.constructor.name);
		return new this.constructor(...this.val.map((e, i) => e + m.val[i]));
	}
	
	/* Component wise sub */
	sub(m) {
		if(!(m instanceof this.constructor))
			throw new TypeError("Cannot subtract " + this.constructor.name + " with " + m.constructor.name);
		return new this.constructor(...this.val.map((e, i) => e - m.val[i]));
	}
	
	/* Component wise product and product per scalar */
	prod(m) {
		if(typeof m === "number")
			return new this.constructor(...this.val.map((e, i) => e * m));
		if(!(m instanceof this.constructor))
			throw new TypeError("Cannot product " + this.constructor.name + " with " + m.constructor.name);
		return new this.constructor(...this.val.map((e, i) => e * m.val[i]));
	}
	
	/* Return the matrix product of two matrices, matrix per vector, or vector dot product */
	mul() {}
}
