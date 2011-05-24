/**
* The REFINERYCMS form object for client side validating forms in REFINERYCMS.
* Based on REFINERYCMS.formForms https://github.com/REFINERYCMS.form/REFINERYCMS.form/raw/master/client-side/forms/REFINERYCMS.formForms.js
*
*
* @version    $Id$
* @package    refinerycms-js
* @copyright  Copyright (C) 2011
* @author     keraM marek@keram.name http//keram.name
* @class      form
* @license    MIT
*/

// @todo to string helpers
if (typeof (camelize) == 'undefined' ) {
	function camelize(s) {
		return s.replace(/[_|-]+(\S)?/g, function(m, chr) {
			return chr ? chr.toUpperCase() : '';
		});
	}
}

REFINERYCMS.namespace('REFINERYCMS.plugin.Seo');

REFINERYCMS.plugin.Seo = function (config) {
	var cls = this.getInstance();
	cls.init(config);
}

REFINERYCMS.plugin.Seo.analyzer = { };
REFINERYCMS.plugin.Seo.validators = { };
REFINERYCMS.plugin.Seo.decorator = { };

/**
 * Class for handling everything between page and snippets
 */
REFINERYCMS.plugin.Seo.prototype = {
	instance: null,
	keywords: [],
	text: '',
	text_words: [],
	text_sentences: [],
	elements: {},
	
	stop_on_first_error: true,

	validation_rules: {
		meta_tag_keywords : {
			'filled' : true,
			'min_length': 10,
			'max_length': 100,
			'min_words_count' : 1,
			'max_words_count' : 5
		}
	},

	getInstance: function () {
		if (this.instance === null) {
			this.instance = this;
		}
		
		return this.instance;
	},

	sanitize_word: function (word) {
		var str = word || '',
		t = '',
		unsafe_chars = 'áäčďéěíĺľňóô öŕšťúů üýřžÁÄČĎÉĚÍĹĽŇÓÔ ÖŔŠŤÚŮ ÜÝŘŽ';
		safe_chars = 'aacdeeillnoo orstuu uyrzAACDEEILLNOO ORSTUU UYRZ';

		for(var i = str.length; i--;)
		{
			if (unsafe_chars.indexOf(str.charAt(i)) != -1) {
				t += safe_chars.charAt(safe_chars.indexOf(str.charAt(i)));
				continue;
			}

			t += str.charAt(i);
		}

		str = str.replace(/[.,_$\\\/!?{}\(\(]/, '');

		return str;
	},

	sanitize_text: function (text) {
		var txt = $.trim(text);
		txt = txt.replace(/ /g, '%space%');
		txt = txt.replace(/\s/g, '');
		txt = txt.replace(/%space%/g, ' ');

		return txt;
	},

	count_text_words: function () {
		var words = this.get_text_words();

		return words.length;
	},

	count_keywords: function () {
		return this.keywords.length;
	},

	set_keywords: function (k) {
		this.keywords = k;
	},

	set_text: function (t) {
		this.text = this.sanitize_text(t);
	},

	set_validation_rules: function (rules) {
		this.validation_rules = rules || this.validation_rules;
	},
	
	set_stop_on_first_error: function (stop) {
		this.stop_on_first_error = stop;
	},

	set_text_words: function () {
		var words = this.text.split(' '),
		word_regexp = /^[a-zA-Z0-9]?[a-zA-Z0-9\-]*/,
		test = false,
		word = '',
		tmp_words = [];

		for (var i = words.length; i--;) {
			word = this.sanitize_word(words[i]);
			if (word) {
				tmp_words[tmp_words.length] = word;
			}
		}

		this.text_words = tmp_words.reverse();
	},

	set_text_sentences: function () {
		var text = this.text;
		var res = [];

		var split_by = function (str, splitter) {
			str.split(splitter);
		}

		this.text_sentences = '';
	},

	get_keywords: function () {
		return this.keywords;
	},

	get_text: function () {
		return this.text;
	},

	get_text_words: function () {
		return this.text_words;
	},

	get_text_sentences: function () {
		return this.text_sentences;
	},
	
	getElement: function(elm_key) {
		if (!this.elements[elm_key]) {
			this.elements[elm_key] = $('#' + elm_key);
		}
		
		return this.elements[elm_key];
	},
	
	setElement: function (elm, key, rules) {
		this.elements[key] = elm;
		
		if (typeof (rules) !== 'undefined') {
			this.validation_rules[key] = rules;
		}
	},

	validate: function () {
		var that = this;
			validator = REFINERYCMS.plugin.Seo.validators,
			result = [],
			elm = null;
		
		for (elm_key in that.validation_rules) {
			elm = that.getElement(elm_key);
			if (elm.length > 0) {
				result[elm_key] = [];
				for (rule in that.validation_rules[elm_key]) {
					result[elm_key][rule] = validator.testElm(elm, rule, that.validation_rules[elm_key][rule]);

					if (!result[elm_key][rule] && that.stop_on_first_error) {
						break;
					}
				}
			}
		}
		
		return result;
	},
	
	render: function (config) {
		var decorator = REFINERYCMS.plugin.Seo.decorator;
		
		// put content to decorator
		decorator.render(config);
	},

	/**
	 * Initialization
	 * @param config Object
	 */
	init: function (config) {
		config = config || {};
		
		this.set_keywords(config.keywords || []);
		this.set_text(config.text || '');
		this.set_text_words();
		this.set_validation_rules(config.validation_rules || this.validation_rules);
		this.set_stop_on_first_error(config.stop_on_first_error || this.stop_on_first_error);
	}
};

REFINERYCMS.plugin.Seo.validators = {
	
	testElm: function (element, rule, args) {
		var result = false,
			elm = $(element),
			fnc = this[camelize(rule)];
			
		if (typeof (fnc) == 'undefined') {
			throw Error('Function for Validation rule "' + camelize(rule) + '" not extist');
			return false;
		}
		
		if (typeof (fnc) === 'function') {
			result = fnc(args, elm.val());
		}
		
		return result;
	},

	maxWordsCount: function(arg, val) {
		return val.split(',').length <= arg;
	},

	minWordsCount: function(arg, val) {
		return !!val && val.split(',').length >= arg;
	},

	filled: function(arg, val) {
		return val !== '' && val !== false && val !== null;
	},

	minLength: function(arg, val) {
		return val.length >= arg;
	},

	maxLength: function(arg, val) {
		return val.length <= arg;
	},

	length: function(arg, val) {
		arg = REFINERYCMS.plugin.Seo.validators.isArray(arg) ? arg : [arg, arg];
		return (arg[0] === null || val.length >= arg[0]) && (arg[1] === null || val.length <= arg[1]);
	},

	isArray: function (arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	}
};

REFINERYCMS.plugin.Seo.decorator = {
	title : 'Seo report',
	data : [],
	holder : '',
	report : '',
	rendered : false,
	report_id : 'seo-report',
	
	messages : {
		'meta_tag_keywords' : {
			'filled' : 'Meta tag keywords must be filled.'
		},
		'ok' : 'ok'
	},
	
	getHeader: function () {
		var header = $('#' + this.report_id).find('.header');
		if (header.length > 0) {
			return header;
		}
		
		return $('<div />', {
			'class' : 'header',
			'html' : $('<h2 />', {'text' : this.title})
		});
	},
	
	getWrapper: function () {
		var wrapper = $('#' + this.report_id);
		if (wrapper.length > 0) {
			return wrapper;
		}
		
		return $('<div />', {
			'id' : this.report_id
		});
	},
	
	getContent: function () {
		var content = $('#' + this.report_id).find('.content');
		if (content.length > 0) {
			
			content.html(this.buildContent());
			return content;
		}
		
		return $('<div />', {
			'class' : 'content',
			'html' : this.buildContent()
		});
	},
	
	getFooter: function () {
		var footer = $('#' + this.report_id).find('.footer');
		if (footer.length > 0) {
			return footer;
		}
		
		var btn = $('<a />', {
			'text' : 'Run',
			'class' : 'button'
		});
		
		return $('<div />', {
			'class' : 'footer',
			'html' : btn
		});
	},
	
	buildContent: function () {
		var that = this,
			msg = '',
			tmp_holder = $('<div />');
		
		for (elm_key in this.data) {
			var ul = $('<ul />');
				error_found = false;
			for (rule in this.data[elm_key]) {
//				console.log('r ' + rule + ' k ' + elm_key + ' ' + this.data[elm_key][rule]);
				if (!this.data[elm_key][rule]) {
					error_found = true;
					that.messages[elm_key] = that.messages[elm_key] || {};
					msg = that.messages[elm_key][rule] || 'State of check rule "' + rule + '" in "' + elm_key + '" is false.';
					$('<li />', {
						'class' : 'error',
						'text' : msg
					}).appendTo(ul);
				}
			}
			
			if (!error_found) {
				$('<li />', {
					'class' : 'success',
					'text' : elm_key + ': ' + that.messages['ok']
				}).appendTo(ul);
			}
			
			tmp_holder.append(ul);
		}
		
		return tmp_holder;
	},
	
	destroy: function () {
		this.report.find('a').unbind('click');
		this.report.remove();
		this.report = '';
	},
	
	render: function (cfg) {
		cfg = cfg || {};
		this.data = cfg.data || [];
				
		this.holder = cfg.holder || $('#more_options');

		if (this.holder.length > 0) {
			this.report = this.getWrapper();
			// when is rendered only rewrite content data
			
			if (!this.rendered) {
				this.report.append(this.getHeader());
				this.report.append(this.getContent());
				this.report.append(this.getFooter());

				this.holder.append(this.report);
				this.rendered = true;
			} else {
				this.getContent();
			}
		}
	}
}