"use strict";

import {Mat, Vec2} from "./index.js";

export class Mat2 extends Mat {
	static n = 2;
	
	constructor(...val) {
		if (val[0] instanceof Mat2)
			super(...val[0].val);
		else if (val[0] instanceof Mat) {
			let tmp = [];
			for(let i = 0; i < Mat2.n; i++)
				tmp = tmp.concat(val[0]._col(i).slice(0, Mat2.n));
			super(...tmp);
		} else
			super(...val);
	}
	
	col(i) {
		return new Vec2(this._col(i));
	}
	
	get det() {
		if(this._det == null) {
			let [a, c, b, d] = this.val;
			this._det = a*d - b*c;
		}
		return this._det;
	}
	
	invert() {
		let [a, c, b, d] = this.val;
		let adj = [ d, -b,
		           -c,  a ];
		return this._invert(adj);
	}
}
