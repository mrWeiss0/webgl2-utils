"use strict";

import {Mat, Mat2, Mat4, Vec3} from "./index.js";

export class Mat3 extends Mat {
	static n = 3;
	
	constructor(...val) {
		if (val[0] instanceof Mat3)
			super(...val[0].val);
		else if (val[0] instanceof Mat4) {
			let tmp = [];
			for(let i = 0; i < Mat3.n; i++)
				tmp = tmp.concat(val[0]._col(i).slice(0, Mat3.n));
			super(...tmp);
		}
		else if (val[0] instanceof Mat2) {
			let tmp = [];
			for(let i = 0; i < Mat2.n; i++) {
				tmp = tmp.concat(val[0]._col(i));
				tmp.push(0);
			}
			super(...tmp, 0, 0, 1);
		} else
			super(...val);
	}
	
	static transl(dx=0, dy=0) {
		return new this(  1,  0, 0,
		                  0,  1, 0,
		                 dx, dy, 1 );
	}

	static scale(sx=1, sy=sx) {
		return new this( sx,  0, 0,
		                  0, sy, 0,
		                  0,  0, 1 );
	}

	static rot(a) {
		let [c, s] = [Math.cos(a), Math.sin(a)];
		return new this(  c, s, 0,
		                 -s, c, 0,
		                  0, 0, 1 );
	}

	static shearX(h) {
		return new this( 1, h, 0,
		                 0, 1, 0,
		                 0, 0, 1 );
	}

	static shearY(h) {
		return new this( 1, 0, 0,
		                 h, 1, 0,
		                 0, 0, 1 );
	}
	
	col(i) {
		return new Vec3(this._col(i));
	}
	
	get det() {
		if(this._det == null) {
			let m = this.val;
			this._det = m[0] * (m[4] * m[8] - m[7] * m[5]) +
			            m[3] * (m[7] * m[2] - m[1] * m[8]) +
			            m[6] * (m[1] * m[5] - m[4] * m[2]);
		}
		return this._det;
	}
	
	invert() {
		let m = this.val;
		let adj = [ m[4] * m[8] - m[7] * m[5],
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
		return this._invert(adj);
	}
}
