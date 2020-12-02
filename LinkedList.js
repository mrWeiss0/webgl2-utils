/*
 * Simple linked list node class
 * with next node accessor
 * and iterator method
 */
export class LinkedList {
	/* Create an unlinked node */
	constructor() {
		this._link = null;
	}
	
	/* Get the next node in the list */
	get next() {
		return this._link;
	}
	
	/* Set the next node in the list */
	set next(node) {
		if(!(node == null || node instanceof LinkedList))
			throw new Error(node.constructor.name + " is not a LinkedList node");
		this._link = node;
	}
	
	/* Iterate over the elements following this in the list */
	[Symbol.iterator] = function*() {
		for(let cur = this; cur != null; cur = cur.next)
			yield cur;
	}
}
