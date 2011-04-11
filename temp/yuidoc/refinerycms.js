/**
 * The REFINERYCMS object is the single global object used by RefineryCMS.
 * 
 * @version    $Id$
 * @package    refinerycms-js
 * @copyright  Copyright (C) 2011
 * @author     keraM marek@keram.name http//keram.name
 * @license    MIT
 */

/**
 * The REFINERYCMS global namespace object.
 * 
 * @title      REFINERYCMS Global object
 * @class      REFINERYCMS
 * @module     refinerycms
 * @required   jquery-1.5.2
 * @namespace  
 * @static
 */
var REFINERYCMS = REFINERYCMS || {};

REFINERYCMS = {
	
    /**
	 * I love YUI namespaces
	 * 
	 * @see YUI.namespace
     * @method namespace
     * @param  {string*} arguments 1-n namespaces to create.
     * @return {object}  A reference to the last namespace object created.
     */
    namespace: function() {
		var a=arguments, o=null, i, j, d;
		for (i=0; i<a.length; i=i+1) {
			d=a[i].split(".");
			o=window;
			for (j=0; j<d.length; j=j+1) {
				o[d[j]]=o[d[j]] || {};
				o=o[d[j]];
			}
		}
		
		return o;
    },
	
	/**
	 * Extend Child object with Parent prototype
	 * 
	 * @param {object} Child
	 * @param {object} Parent
	 */
    extends: function(Child, Parent) {
		function Q() {};
		
		Q.prototype = Parent.prototype;

		var R = Child.prototype;
		Child.prototype = new Q;
		
		// adding back overriden methods and properties
		for (var key in R) {
			Child.prototype[key] = R[key];
		}

		Child.prototype.constructor = Child;
    }
}

