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
		this._modulo = null;
	}
	
	/* Get the i-th element of the vector */
	get(i) {
		if(i < 0 || i >= this.constructor.n)
			throw new Error("Invalid index for " + this.constructor.name);
		return this._val[i];
	}
	
	/* Set the i-th element of the vector */
	set(i, v) {
		if(i < 0 || i >= this.constructor.n)
			throw new Error("Invalid index for " + this.constructor.name);
		this._val[i] = +v;
		this._modulo = null;
	}
	
	/* Get the first element of the vector */
	get x() {
		return this.get(0);
	}
	
	get r() {
		return this.get(0);
	}
	
	get s() {
		return this.get(0);
	}
	
	/* Set the first element of the vector */
	set x(v) {
		this.set(0, v);
	}
	
	set r(v) {
		this.set(0, v);
	}
	
	set s(v) {
		this.set(0, v);
	}
	
	/* Get the second element of the vector */
	get y() {
		return this.get(1);
	}
	
	get g() {
		return this.get(1);
	}
	
	get t() {
		return this.get(1);
	}
	
	/* Set the second element of the vector */
	set y(v) {
		this.set(1, v);
	}
	
	set g(v) {
		this.set(1, v);
	}
	
	set t(v) {
		this.set(1, v);
	}
	
	/* Get the third element of the vector */
	get z() {
		return this.get(2);
	}
	
	get b() {
		return this.get(2);
	}
	
	get p() {
		return this.get(2);
	}
	
	/* Set the third element of the vector */
	set z(v) {
		this.set(2, v);
	}
	
	set b(v) {
		this.set(2, v);
	}
	
	set p(v) {
		this.set(2, v);
	}
	
	/* Get the fourth element of the vector */
	get w() {
		return this.get(3);
	}
	
	get a() {
		return this.get(3);
	}
	
	get q() {
		return this.get(3);
	}
	
	/* Set the fourth element of the vector */
	set w(v) {
		this.set(3, v);
	}
	
	set a(v) {
		this.set(3, v);
	}
	
	set q(v) {
		this.set(3, v);
	}
	
	/* Modulo of the vector */
	get modulo() {
		if(this._modulo == null)
			this._modulo = Math.sqrt(this.val.reduce((x, y) => x + y**2, 0));
		return this._modulo;
	}
	
	/* Return a new vector obtained normalizing the current vector */
	normalized() {
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
		let mult = 0;
		for(let i = 0; i < n; i++)
			mult += this.val[i] * v.val[i];
		return mult;
	}
}
