"use strict";

import {Vec} from "./index.js";

export class Vec3 extends Vec {
	static n = 3;
	
	/* Cross product */
	cross(m) {
		if(!(m instanceof this.constructor))
			throw new TypeError("Cannot cross product " + this.constructor.name + " with " + m.constructor.name);
		return new this.constructor( this.val[1]*m.val[2] - this.val[2]*m.val[1],
		                             this.val[2]*m.val[0] - this.val[0]*m.val[2],
		                             this.val[0]*m.val[1] - this.val[1]*m.val[0] );
	}
}
