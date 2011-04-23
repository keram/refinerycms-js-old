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
	lang: 'en',

	strings: [],
	
	// @todo move to i18n object
	translate: function (string) {
		var t = this.getTranslations(),
			args_length = arguments.length,
			rgxp_tpl = /{[a-zA-Z0-9_]+}/g;

		if (typeof t[string] === 'undefined') {
			return string;
		}

		if (typeof t[string] === 'function') {
			return t[string].call(arguments);
		}

		if (args_length > 1 && typeof t[string] === 'string') {
			var tmp_str = t[string],
				tmp_matches = tmp_str.match(rgxp_tpl),
				tmp_match = '';
				
			if (tmp_matches.length > 0) {
				// najdeme v prekladoch
				for (var j = 0; j < tmp_matches.length; j++) {
					tmp_match = tmp_matches[j].substring(1, tmp_matches[j].length - 1);
					if (typeof (t[tmp_match]) !== 'undefined') {
						tmp_str = tmp_str.replace('{' + tmp_match + '}', t[tmp_match]);
					}
				}

				// najdeme v argumentoch
				for (var i = 1; i < args_length; i++) {
					tmp_str = tmp_str.replace(rgxp_tpl, arguments[i]);
				}
			}
			
			return tmp_str;
		}

		return t[string];
	},

	getTranslations: function () {
		if (this.strings.length === 0) {
			var strings = [];
			if (typeof(this.translations[this.lang]) !== 'undefined') {
				var translations = this.translations[this.lang];
				for (string in translations) {
					strings[string] = translations[string];
				}
			}
			this.strings = strings;
		}

		return this.strings;
	},

	/**
	 * I love YUI namespaces
	 *
	 * @see YUI.namespace
	 * @method namespace
	 * @param  {string*} arguments 1-n namespaces to create.
	 * @global window
	 * @return {object}  A reference to the last namespace object created.
	 */
	namespace: function () {
		var a = arguments, o = null, i, j, d;
		for (i = 0; i < a.length; i = i + 1) {
			d = a[i].split(".");

			o = window;
			for (j = 0; j < d.length; j = j + 1) {
				o[d[j]] = o[d[j]] || {};
				o = o[d[j]];
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
	extendObject: function (Child, Parent) {
		var R = Child.prototype,
			key = null;
		
		function Q() {}
		
		Q.prototype = Parent.prototype;
		
		Child.prototype = new Q();
		
		// adding back overriden methods and properties
		for (key in R) {
			if (R.hasOwnProperty(key)) {
				Child.prototype[key] = R[key];
			}
		}

		Child.prototype.constructor = Child;
	}
};

REFINERYCMS.translations = {
	'sk' : {
		'prev' : 'Predchádzajúci',
		'next' : 'Následujúci',
		'from' : 'Od',
		'to' : 'Do',
		'l_quote' : '\u201E',
		'r_quote' : '\u201C'
	},
	'cs' : {
		'prev' : 'P\u0159edchozí',
		'next' : 'Následující',
		'from' : 'Od',
		'to' : 'Do',
		'l_quote' : '\u201E',
		'r_quote' : '\u201C'
	},
	'en' : {
		'tpl': 'jurko {l_quote}{zbojnik}',
		'fnc': function() {return 2},
		'prev' : 'Prev',
		'next' : 'Next',
		'from' : 'From',
		'to' : 'To',
		'l_quote' : '\u201C',
		'r_quote' : '\u201D'
	}
};