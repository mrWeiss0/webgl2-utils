"use strict";
/*
 * Quaternion class, extends Vec4
 * overriding multiplication method with
 * the quaternion product.
 */
class Quat extends Vec4 {
	/*
	 * Return a Quaternion that represents
	 * the rotation of `angle` around `axis`.
	 *
	 * `axis` can be an Array or a Vec3
	 * with the components of the axis direction.
	 */
	static fromAngleAxis(a, axis) {
		if(axis instanceof Vec3) axis = axis.val;
		let m = Math.sqrt(axis.reduce((x, y) => x + y**2, 0));
		let q = m ? [          Math.cos(a/2),
		              axis[0]/m * Math.sin(a/2),
		              axis[1]/m * Math.sin(a/2),
		              axis[2]/m * Math.sin(a/2) ] :
		            [1, 0, 0, 0];
		return new this(...q);
	}
	
	/*
	 * Return the product of two Quaternions
	 */
	mul(q) {
		if(!(q instanceof this.constructor))
			throw new TypeError("Cannot multiply " + this.constructor.name + " with " + q.constructor.name);
		let [[a1, b1, c1, d1], [a2, b2, c2, d2]] = [this.val, q.val];
		return new this.constructor( a1*a2 - b1*b2 - c1*c2 - d1*d2,
		                             a1*b2 + b1*a2 + c1*d2 - d1*c2,
		                             a1*c2 - b1*d2 + c1*a2 + d1*b2,
		                             a1*d2 + b1*c2 - c1*b2 + d1*a2 );
	}
	
	/*
	 * Return the matrix form of the rotation
	 */
	toMatrix() {
		let [a, b, c, d] = this.val;
		let s = this.val.reduce((x, y) => x + y**2, 0);
		s = s === 0 ? 0 : 2 / s;
		return new Mat4( 1 - s*(c*c + d*d),     s*(b*c + a*d),     s*(b*d - a*c), 0,
		                     s*(b*c - a*d), 1 - s*(b*b + d*d),     s*(c*d + a*b), 0,
		                     s*(b*d + a*c),     s*(c*d - a*b), 1 - s*(b*b + c*c), 0,
		                                 0,                 0,                 0, 1 );
	}
}
