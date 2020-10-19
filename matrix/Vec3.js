import {Vec} from "./index.js";

/*
 * 3 elements vector class.
 */
export class Vec3 extends Vec {
	static n = 3;
	
	/* Cross product */
	cross(v) {
		if(!(v instanceof this.constructor))
			throw new TypeError("Cannot cross product " + this.constructor.name + " with " + v.constructor.name);
		return new this.constructor( this.val[1]*v.val[2] - this.val[2]*v.val[1],
		                             this.val[2]*v.val[0] - this.val[0]*v.val[2],
		                             this.val[0]*v.val[1] - this.val[1]*v.val[0] );
	}
}
