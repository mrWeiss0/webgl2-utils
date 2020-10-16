"use strict";

import {Mat, Mat2, Mat3, Vec3, Vec4} from "./index.js";

/*
 * 4x4 matrix class.
 *
 * Implements static methods for
 * 3D transform and projection matrices.
 */
export class Mat4 extends Mat {
	static n = 4;
	
	constructor(...val) {
		if (val[0] instanceof Mat4)
			super(...val[0].val);
		else if (val[0] instanceof Mat3)
			super(...Mat4._valFromMat3(val[0]));
		else if (val[0] instanceof Mat2)
			super(...Mat4._valFromMat2(val[0]));
		else
			super(...val);
	}
	
	/* 3D translation */
	static transl(dx=0, dy=0, dz=0) {
		if(dx instanceof Vec3) [dx, dy, dz] = dx.val;
		return new this(  1,  0,  0,  0,
		                  0,  1,  0,  0,
		                  0,  0,  1,  0,
		                 dx, dy, dz,  1 );
	}

	/* 3D scale */
	static scale(sx=1, sy=sx, sz=sy) {
		return new this( sx,  0,  0, 0,
		                  0, sy,  0, 0,
		                  0,  0, sz, 0,
		                  0,  0,  0, 1 );
	}

	/* 3D translation around X axis */
	static rotX(a) {
		let [c, s] = [Math.cos(a), Math.sin(a)];
		return new this(  1,  0,  0, 0,
		                  0,  c,  s, 0,
		                  0, -s,  c, 0,
		                  0,  0,  0, 1 );
	}

	/* 3D translation around Y axis */
	static rotY(a) {
		let [c, s] = [Math.cos(a), Math.sin(a)];
		return new this(  c,  0, -s, 0,
		                  0,  1,  0, 0,
		                  s,  0,  c, 0,
		                  0,  0,  0, 1 );
	}

	/* 3D translation around Z axis */
	static rotZ(a) {
		let [c, s] = [Math.cos(a), Math.sin(a)];
		return new this(  c,  s,  0, 0,
		                 -s,  c,  0, 0,
		                  0,  0,  1, 0,
		                  0,  0,  0, 1 );
	}

	/* 3D shear of the X axis */
	static shearX(hy, hz) {
		return new this(  1, hy, hz, 0,
		                  0,  1,  0, 0,
		                  0,  0,  1, 0,
		                  0,  0,  0, 1 );
	}

	/* 3D shear of the Y axis */
	static shearY(hx, hz) {
		return new this(  1,  0,  0, 0,
		                 hx,  1, hz, 0,
		                  0,  0,  1, 0,
		                  0,  0,  0, 1 );
	}

	/* 3D shear of the Z axis */
	static shearZ(hx, hy) {
		return new this(  1,  0,  0, 0,
		                  0,  1,  0, 0,
		                 hx, hy,  1, 0,
		                  0,  0,  0, 1 );
	}
	
	/*
	 * Return the orthogonal projection matrix
	 * from a camera space looking towards negative z-axis.
	 *
	 * `w`: half width
	 * `h`: half height
	 * `n`: near plane
	 * `f`: far  plane
	 */
	static ortho(w, h, n, f) {
		return new this( 1/w,   0,           0, 0,
		                   0, 1/h,           0, 0,
		                   0,   0,     2/(n-f), 0,
		                   0,   0, (n+f)/(n-f), 1 );
	}
	
	/*
	 * Return the perspective projection matrix
	 * from camera space looking towards negative z-axis.
	 *
	 * `w`: half width  at projection plane
	 * `h`: half height at projection plane
	 * `n`: near plane
	 * `f`: far  plane
	 * `d`: projection plane distance
	 */
	static persp(w, h, n, f, d = n) {
		/*return this.ortho(w, h, d-1/n, d-1/f)
			.mul(new this( d, 0, 0,  0,
			               0, d, 0,  0,
			               0, 0, d, -1,
			               0, 0, 1,  0 ));*/
		return new this( d/w,   0,           0,  0,
		                   0, d/h,           0,  0,
		                   0,   0, (n+f)/(n-f), -1,
		                   0,   0, 2*f*n/(n-f),  0 );
	}
	
	/*
	 * Return the perspective projection matrix
	 * from camera space looking towards negative z-axis,
	 * given vertical fov and aspect ratio.
	 *
	 * `fov`: vertical field of view in radians
	 * `a`:   aspect ratio
	 * `n`:   near plane
	 * `f`:   far  plane
	 */
	static perspFOV(fov, a, n, f) {
		let h = Math.tan(fov/2);
		return this.persp(a * h, h, n, f, 1);
	}
	
	/*
	 * Return the rotation matrix
	 * for the given euler angles
	 * for z-up coordinates (XYZ order)
	 */
	static euler(roll, pitch, yaw) {
		return this.rotZ(yaw)
			.mul(this.rotY(pitch))
			.mul(this.rotX(roll));
	}
	
	/*
	 * Return the transformation matrix for
	 * point `c` looking at point `o`.
	 * Invert this matrix to get the corresponding
	 * view matrix.
	 *
	 * c:   source point
	 * o:   look at point
	 * upv: upvector
	 */
	static lookAt(c, o, upv = new Vec3(0, 1, 0)) {
		if(Array.isArray(c)) c = new Vec3(c);
		if(Array.isArray(o)) o = new Vec3(o);
		if(Array.isArray(upv)) upv = new Vec3(upv);
		let vz = c.sub(o).normalize();
		if(!vz.modulo)
			vz = new Vec3(0, 0, 1);
		let vx = upv.cross(vz).normalize();
		if(!vx.modulo)
			vx = new Vec3(1, 0, 0);
		let vy = vz.cross(vx);
		return new this( vx, 0,
		                 vy, 0,
		                 vz, 0,
		                  c, 1 );
	}

	col(i) {
		return new Vec4(this.arrayCol(i));
	}
	
	get det() {
		if(this._det == null) {
			let m = this.val;
			this._det = m[ 0] * (  m[ 5] * m[10] * m[15]
			                     - m[ 5] * m[14] * m[11]
			                     - m[ 6] * m[ 9] * m[15]
			                     + m[ 6] * m[13] * m[11]
			                     + m[ 7] * m[ 9] * m[14]
			                     - m[ 7] * m[13] * m[10]) +
			            m[ 4] * (- m[ 1] * m[10] * m[15]
			                     + m[ 1] * m[14] * m[11]
			                     + m[ 2] * m[ 9] * m[15]
			                     - m[ 2] * m[13] * m[11]
			                     - m[ 3] * m[ 9] * m[14]
			                     + m[ 3] * m[13] * m[10]) +
			            m[ 8] * (  m[ 1] * m[ 6] * m[15]
			                     - m[ 1] * m[14] * m[ 7]
			                     - m[ 2] * m[ 5] * m[15]
			                     + m[ 2] * m[13] * m[ 7]
			                     + m[ 3] * m[ 5] * m[14]
			                     - m[ 3] * m[13] * m[ 6]) +
			            m[12] * (- m[ 1] * m[ 6] * m[11]
			                     + m[ 1] * m[10] * m[ 7]
			                     + m[ 2] * m[ 5] * m[11]
			                     - m[ 2] * m[ 9] * m[ 7]
			                     - m[ 3] * m[ 5] * m[10]
			                     + m[ 3] * m[ 9] * m[ 6]);
		}
		return this._det;
	}
	
	adjugate() {
		let m = this.val;
		let adj = [   m[ 5] * m[10] * m[15]
		            - m[ 5] * m[14] * m[11]
		            - m[ 6] * m[ 9] * m[15]
		            + m[ 6] * m[13] * m[11]
		            + m[ 7] * m[ 9] * m[14]
		            - m[ 7] * m[13] * m[10],
		            - m[ 1] * m[10] * m[15]
		            + m[ 1] * m[14] * m[11]
		            + m[ 2] * m[ 9] * m[15]
		            - m[ 2] * m[13] * m[11]
		            - m[ 3] * m[ 9] * m[14]
		            + m[ 3] * m[13] * m[10],
		              m[ 1] * m[ 6] * m[15]
		            - m[ 1] * m[14] * m[ 7]
		            - m[ 2] * m[ 5] * m[15]
		            + m[ 2] * m[13] * m[ 7]
		            + m[ 3] * m[ 5] * m[14]
		            - m[ 3] * m[13] * m[ 6],
		            - m[ 1] * m[ 6] * m[11]
		            + m[ 1] * m[10] * m[ 7]
		            + m[ 2] * m[ 5] * m[11]
		            - m[ 2] * m[ 9] * m[ 7]
		            - m[ 3] * m[ 5] * m[10]
		            + m[ 3] * m[ 9] * m[ 6],
		            - m[ 4] * m[10] * m[15]
		            + m[ 4] * m[14] * m[11]
		            + m[ 6] * m[ 8] * m[15]
		            - m[ 6] * m[12] * m[11]
		            - m[ 7] * m[ 8] * m[14]
		            + m[ 7] * m[12] * m[10],
		              m[ 0] * m[10] * m[15]
		            - m[ 0] * m[14] * m[11]
		            - m[ 2] * m[ 8] * m[15]
		            + m[ 2] * m[12] * m[11]
		            + m[ 3] * m[ 8] * m[14]
		            - m[ 3] * m[12] * m[10],
		            - m[ 0] * m[ 6] * m[15]
		            + m[ 0] * m[14] * m[ 7]
		            + m[ 2] * m[ 4] * m[15]
		            - m[ 2] * m[12] * m[ 7]
		            - m[ 3] * m[ 4] * m[14]
		            + m[ 3] * m[12] * m[ 6],
		              m[ 0] * m[ 6] * m[11]
		            - m[ 0] * m[10] * m[ 7]
		            - m[ 2] * m[ 4] * m[11]
		            + m[ 2] * m[ 8] * m[ 7]
		            + m[ 3] * m[ 4] * m[10]
		            - m[ 3] * m[ 8] * m[ 6],
		              m[ 4] * m[ 9] * m[15]
		            - m[ 4] * m[13] * m[11]
		            - m[ 5] * m[ 8] * m[15]
		            + m[ 5] * m[12] * m[11]
		            + m[ 7] * m[ 8] * m[13]
		            - m[ 7] * m[12] * m[ 9],
		            - m[ 0] * m[ 9] * m[15]
		            + m[ 0] * m[13] * m[11]
		            + m[ 1] * m[ 8] * m[15]
		            - m[ 1] * m[12] * m[11]
		            - m[ 3] * m[ 8] * m[13]
		            + m[ 3] * m[12] * m[ 9],
		              m[ 0] * m[ 5] * m[15]
		            - m[ 0] * m[13] * m[ 7]
		            - m[ 1] * m[ 4] * m[15]
		            + m[ 1] * m[12] * m[ 7]
		            + m[ 3] * m[ 4] * m[13]
		            - m[ 3] * m[12] * m[ 5],
		            - m[ 0] * m[ 5] * m[11]
		            + m[ 0] * m[ 9] * m[ 7]
		            + m[ 1] * m[ 4] * m[11]
		            - m[ 1] * m[ 8] * m[ 7]
		            - m[ 3] * m[ 4] * m[ 9]
		            + m[ 3] * m[ 8] * m[ 5],
		            - m[ 4] * m[ 9] * m[14]
		            + m[ 4] * m[13] * m[10]
		            + m[ 5] * m[ 8] * m[14]
		            - m[ 5] * m[12] * m[10]
		            - m[ 6] * m[ 8] * m[13]
		            + m[ 6] * m[12] * m[ 9],
		              m[ 0] * m[ 9] * m[14]
		            - m[ 0] * m[13] * m[10]
		            - m[ 1] * m[ 8] * m[14]
		            + m[ 1] * m[12] * m[10]
		            + m[ 2] * m[ 8] * m[13]
		            - m[ 2] * m[12] * m[ 9],
		            - m[ 0] * m[ 5] * m[14]
		            + m[ 0] * m[13] * m[ 6]
		            + m[ 1] * m[ 4] * m[14]
		            - m[ 1] * m[12] * m[ 6]
		            - m[ 2] * m[ 4] * m[13]
		            + m[ 2] * m[12] * m[ 5],
		              m[ 0] * m[ 5] * m[10]
		            - m[ 0] * m[ 9] * m[ 6]
		            - m[ 1] * m[ 4] * m[10]
		            + m[ 1] * m[ 8] * m[ 6]
		            + m[ 2] * m[ 4] * m[ 9]
		            - m[ 2] * m[ 8] * m[ 5] ];
		if(this._det == null)
			this._det = m[ 0] * adj[ 0] +
			            m[ 4] * adj[ 1] +
			            m[ 8] * adj[ 2] +
			            m[12] * adj[ 3];
		return new this.constructor(adj);
	}
	
	static _valFromMat3(m) {
		let val = [];
		for(let i = 0; i < Mat3.n; i++) {
			val = val.concat(m.arrayCol(i));
			val.push(0);
		}
		val.push(0, 0, 0, 1);
		return val;
	}
	
	static _valFromMat2(m) {
		let val = [];
		for(let i = 0; i < Mat2.n; i++) {
			val = val.concat(m.arrayCol(i));
			val.push(0, 0);
		}
		val.push(0, 0, 1, 0, 0, 0, 0, 1);
		return val;
	}
}
