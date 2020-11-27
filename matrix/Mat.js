import {AbstractMat, Vec} from "./index.js";

/*
 * Parent class for all matrix classes.
 * Values are stored column major, as in GLSL.
 *
 * Implements common methods and private
 * helper methods for subclasses.
 */
export class Mat extends AbstractMat {
	/*
	 * Create a matrix with the given values,
	 * similar to GLSL matN constructor.
	 * Values can be a column major list of
	 * scalars, vectors or arrays, or another matrix.
	 *
	 * If another matrix is given
	 * the values are copied to the output;
	 * any values not filled in are copied from the identity matrix.
	 *
	 * Passing a single value creates a diagonal Matrix.
	 */
	constructor(...val) {
		super(...val);
		const n = this.constructor.n;
		if(this.val.length == 1) {
			const v = this.val[0];
			this._val = new Array(this.constructor.n**2).fill(0);
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
	transposed() {
		const n = this.constructor.n;
		const t = new Array(n**2);
		for(let i = 0; i < n; i++)
			for(let j = 0; j < n; j++)
				t[i*n + j] = this.val[i + j*n];
		return new this.constructor(...t);
	}
	
	/* Return the inverse matrix */
	inverse() {
		const n = this.constructor.n;
		const adj = this.adjugate();
		if(!this.det)
			throw new Error("Matrix is not invertible");
		const idet = 1. / this.det;
		for(let i = 0; i < n**2; i++)
			adj._val[i] = adj.val[i] * idet;
		return adj;
	}
	
	/* Return the adjugate matrix */
	adjugate() {}
	
	/* Trace of the matrix */
	get trace() {
		if(this._trace == null) {
			const n = this.constructor.n;
			this._trace = 0;
			for(let i = 0; i < n; i++)
				this._trace += this.val[i*(n+1)];
		}
		return this._trace;
	}
	
	/* Determinant of the matrix */
	get det() {}
	
	/* Return the i-th column as a VecN */
	col(i) {}
	
	/* Return the `i`th column as an array */
	arrayCol(i) {
		const n = this.constructor.n;
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
	
	/* String representation of the matrix, row major order */
	toString() {
		const n = this.constructor.n;
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
	
	/* Internal matrix product method, return the resulting matrix */
	_mulm(m) {
		const n = this.constructor.n;
		const mult = new Array(n**2).fill(0);
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
		const n = this.constructor.n;
		const mult = new Array(n).fill(0);
		for(let i = 0; i < n; i++)
			for(let j = 0; j < n; j++)
				mult[i] += this.val[i + j*n] * v.val[j];
		return new v.constructor(...mult);
	}
}
