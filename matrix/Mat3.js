import {Mat, Mat2, Mat4, Vec3} from "./index.js";

/*
 * 3x3 matrix class.
 *
 * Implements static methods for basic
 * 2D transform matrices.
 */
export class Mat3 extends Mat {
	static n = 3;
	
	constructor(...val) {
		if (val[0] instanceof Mat3)
			super(...val[0].val);
		else if (val[0] instanceof Mat4)
			super(...Mat3._valFromMat4(val[0]));
		else if (val[0] instanceof Mat2)
			super(...Mat3._valFromMat2(val[0]));
		else
			super(...val);
	}
	
	/* 2D translation */
	static transl(dx=0, dy=0) {
		return new this(  1,  0, 0,
		                  0,  1, 0,
		                 dx, dy, 1 );
	}

	/* 2D scale */
	static scale(sx=1, sy=sx) {
		return new this( sx,  0, 0,
		                  0, sy, 0,
		                  0,  0, 1 );
	}

	/* 2D rotation */
	static rot(a) {
		const [c, s] = [Math.cos(a), Math.sin(a)];
		return new this(  c, s, 0,
		                 -s, c, 0,
		                  0, 0, 1 );
	}

	/* 2D shear of the X axis */
	static shearX(h) {
		return new this( 1, h, 0,
		                 0, 1, 0,
		                 0, 0, 1 );
	}

	/* 2D shear of the Y axis */
	static shearY(h) {
		return new this( 1, 0, 0,
		                 h, 1, 0,
		                 0, 0, 1 );
	}
	
	col(i) {
		return new Vec3(this.arrayCol(i));
	}
	
	get det() {
		if(this._det == null) {
			const m = this.val;
			this._det = m[0] * (m[4] * m[8] - m[7] * m[5]) +
			            m[3] * (m[7] * m[2] - m[1] * m[8]) +
			            m[6] * (m[1] * m[5] - m[4] * m[2]);
		}
		return this._det;
	}
	
	adjugate() {
		const m = this.val;
		const adj = [ m[4] * m[8] - m[7] * m[5],
		              m[7] * m[2] - m[1] * m[8],
		              m[1] * m[5] - m[4] * m[2],
		              m[6] * m[5] - m[3] * m[8],
		              m[0] * m[8] - m[6] * m[2],
		              m[3] * m[2] - m[0] * m[5],
		              m[3] * m[7] - m[6] * m[4],
		              m[6] * m[1] - m[0] * m[7],
		              m[0] * m[4] - m[3] * m[1] ];
		if(this._det == null)
			this._det = m[0] * adj[0] +
			            m[3] * adj[1] +
			            m[6] * adj[2];
		return new this.constructor(adj);
	}
	
	static _valFromMat4(m) {
		const val = [];
		for(let i = 0; i < Mat3.n; i++)
			val.push(...m.arrayCol(i).slice(0, Mat3.n));
		return val;
	}
	
	static _valFromMat2(m) {
		const val = [];
		for(let i = 0; i < Mat2.n; i++)
			val.push(...m.arrayCol(i), 0);
		val.push(0, 0, 1);
		return val;
	}
}
