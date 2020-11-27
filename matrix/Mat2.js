import {Mat, Vec2} from "./index.js";

/*
 * 2x2 matrix class.
 */
export class Mat2 extends Mat {
	static n = 2;
	
	constructor(...val) {
		if (val[0] instanceof Mat2)
			super(...val[0].val);
		else if (val[0] instanceof Mat)
			super(...Mat2._valFromMat(val[0]));
		else
			super(...val);
	}
	
	col(i) {
		return new Vec2(this.arrayCol(i));
	}
	
	get det() {
		if(this._det == null) {
			const [a, c, b, d] = this.val;
			this._det = a*d - b*c;
		}
		return this._det;
	}
	
	adjugate() {
		const [a, c, b, d] = this.val;
		return new this.constructor(d, -b, -c, a);
	}
	
	static _valFromMat(m) {
		const val = [];
		for(let i = 0; i < Mat2.n; i++)
			val.push(...m.arrayCol(i).slice(0, Mat2.n));
		return val;
	}
}
