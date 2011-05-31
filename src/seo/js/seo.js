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

/*global REFINERYCMS, Object, Error, window, $, parent, console */

'use strict';

REFINERYCMS.namespace('REFINERYCMS.plugin.Seo');

REFINERYCMS.plugin.Seo = function (config) {
	this.init(config);
};

REFINERYCMS.plugin.Seo.validators = { };
REFINERYCMS.plugin.Seo.analyzers = { };
REFINERYCMS.plugin.Seo.decorator = { };

/**
 * @todo build translations
 */
REFINERYCMS.namespace('I18n.translations.cs.refinerycms.plugin.seo');
I18n.translations.cs.refinerycms.plugin.seo = {
	'seo_report' : 'SEO report',
	'run_validator' : 'Bez Forest!',
	'run_highlighter' : 'Zapni stromcek',
	'close_popup' : 'Zavri okno',
	'highlighted_keywords_on_page' : 'Zvyraznene klickove slova na stranke',
	'part' : {
		'title' : 'Nazev',
		'page_body' : 'Body'
	},
	'validators' : {
		'filled' : 'element musi byt vyplneny',
		'min_words_count' : 'minimalny pocet slov',
		'function_not_exists' : 'Valida\u010dní funkce {{fnc}} nenalezena.',
		'state_rule_false' : 'Pravidlo {{rule}} hlasi chybu v elemente {{elm}}.',
		'state_ok' : 'sicko v porátku',
		'meta_tag_keywords' : 'meta tag klicove slova',
		'meta_tag_description' : 'meta tag description',
		'browser_title' : 'titulok prehliadaca'
	}
};

/**
 * Class for handling everything between page and snippets
 */
REFINERYCMS.plugin.Seo.prototype = {
	title: 'seo_report',
	instance: null,
	keywords: [],
	text: '',
	text_words: [],
	text_sentences: [],
	elements: {},

	stop_on_first_error: true,

	validation_rules: {
		meta_tag_keywords: {
			'filled': true,
			'min_length': 10,
//			'min_word_length': 3,
			'max_length': 100,
			'min_words_count': 1,
			'max_words_count': 5
		}
	},

	sanitize_word: function (word) {
		var str = word || '',
			t = '',
			i = str.length,
			unsafe_chars = 'áäčďéěíĺľňóô öŕšťúů üýřžÁÄČĎÉĚÍĹĽŇÓÔ ÖŔŠŤÚŮ ÜÝŘŽ',
			safe_chars = 'aacdeeillnoo orstuu uyrzAACDEEILLNOO ORSTUU UYRZ';

		while (i--) {
			if (unsafe_chars.indexOf(str.charAt(i)) !== -1) {
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
		return this.get_text_words().length;
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
//
//	set_validation_rules: function (rules) {
//		this.validation_rules = rules || this.validation_rules;
//	},

	set_stop_on_first_error: function (stop) {
		this.stop_on_first_error = stop;
	},

	set_text_words: function () {
		var words = this.text.split(' '),
			i = words.length,
			word = '',
			tmp_words = [];

		while (i--) {
			word = this.sanitize_word(words[i]);
			if (word) {
				tmp_words[tmp_words.length] = word;
			}
		}

		this.text_words = tmp_words.reverse();
	},

	set_text_sentences: function () {
		var text = this.text,
			res = [],
			split_by = function (str, splitter) {
				str.split(splitter);
			};

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
	
	/**
	 * @todo decorate result
	 * @todo ignorovanie diakritiky v texte
	 */
	get_highlighted_keywords: function (text, keywords) {
		var t = text || this.get_text(),
			k = keywords || this.get_keywords(),
			rg = null,
			r = '';
		
		k.sort(function (a, b) {
			if ( a.length < b.length ) {
				return -1;
			}
			if ( a.length > b.length ) {
				return 1;
			}
			
			return 0;
		});
		
//		for (i = k.length; i--;) {
//			rg = new RegExp('(' + k[i] + ')', 'ig');
//			t = t.replace(rg, '<span class="keyword-highlighted">$1</span>');
//		}
//				
		for (i = k.length; i--;) {
			rg = new RegExp('(' + k[i] + ')', 'ig');
			t = t.replace(rg, '%%HIGHLIGHT%%$1%%\/HIGHLIGHT%%');
		}
		
//		t = t.replace('%%highlight%%', '<span class="higlight-keyword">');
		t = t.replace(/%%HIGHLIGHT%%/g, '<span class="keyword-highlighted">');
		t = t.replace(/%%\/HIGHLIGHT%%/g, '</span>');
		
		r = t;
		
		return r;
	},

	get_element: function (elm_key) {
		if (!this.elements[elm_key]) {
			this.elements[elm_key] = $('#' + elm_key);
		}

		return this.elements[elm_key];
	},

	set_element: function (elm, key, rules) {
		this.elements[key] = elm;

		if (typeof (rules) !== 'undefined') {
			this.validation_rules[key] = rules;
		}
	},

	validate: function () {
		var that = this,
			validator = REFINERYCMS.plugin.Seo.validators,
			result = [],
			elm = null,
			elm_key = null,
			rule = null;

		for (elm_key in that.validation_rules) {
			elm = that.get_element(elm_key);
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

	analyse: function () {
		var that = this,
			analyzer = REFINERYCMS.plugin.Seo.analyzers,
			result = [];
		
		analyzer.run();
		result = analyzer.getReport();
		
		return result;
	},
	
	/**
	 * @todo
	 */
	highlight: function () {
		var hcfg = {},
			texts = [],
			hd = REFINERYCMS.plugin.Seo.higlightDecorator;
		
		// required
		title_text = {'label' : I18n.t('refinerycms.plugin.seo.part.title', {defaultValue : 'Title'}), 'body' : this.get_highlighted_keywords($('#page_title').val()) };
		page_body = {'label' : I18n.t('refinerycms.plugin.seo.part.page_body', {defaultValue : 'Page body'}), 'body' : this.get_highlighted_keywords($('#page_parts_attributes_0_body').val()) };
		
		texts = [title_text, page_body];

		// optional
		if ($('#page_parts_attributes_1_body').length > 0  &&  $('#page_parts_attributes_1_body').val() !== '') {
			page_sidebar = {'label' : 'Page sidebar', 'body' : this.get_highlighted_keywords($('#page_parts_attributes_1_body').val()) };
			texts.push(page_sidebar);
		}
		
		if ($('#page_browser_title').length > 0 && $('#page_browser_title').val() !== '') {
			browser_title_text = {'label' : 'Browser title', 'body' : this.get_highlighted_keywords($('#page_browser_title').val()) };
			texts.push(browser_title_text);
		}
		
		if ($('#page_meta_description').length > 0 && $('#page_meta_description').val() !== '') {
			meta_desc_text = {'label' : 'Meta description', 'body' : this.get_highlighted_keywords($('#page_meta_description').val()) };
			texts.push(meta_desc_text);
		}
		
		hcfg.texts = texts;
		hcfg.holder = $('#page_container');
		
		return hd.render(hcfg);
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
		this.set_text_words();2
		this.set_stop_on_first_error(config.stop_on_first_error || this.stop_on_first_error);
	}
};

REFINERYCMS.plugin.Seo.validators = {

	testElm: function (element, rule, args) {
		var result = false,
			elm = $(element),
			fnc = this[REFINERYCMS.String.camelize(rule)];

		if (typeof (fnc) === 'undefined') {
			throw new Error(I18n.t('refinerycms.plugin.seo.validators.function_not_exists', {
				defaultValue: "Function for Validation rule {{fnc}} not exists.", 
				fnc: REFINERYCMS.String.camelize(rule)
			}));
		}

		if (typeof (fnc) === 'function') {
			result = fnc(args, elm.val());
		}

		return result;
	},

	maxWordsCount: function (arg, val) {
		return val.split(',').length <= arg;
	},

	minWordsCount: function (arg, val) {
		return !!val && val.split(',').length >= arg;
	},

	filled: function (arg, val) {
		return val !== '' && val !== false && val !== null;
	},

	minLength: function (arg, val) {
		return val.length >= arg;
	},

	minWordLength: function (arg, val, separator) {
		var s = separator || ', ';
		var arr = val.split(s);
		
		if (arr.length > 0) {
			for (var i = arr.length; i--;) {
				if (arr[i].length <= arg) {
					return false;
				}
			}
		}
		
		return true;
	},

	maxLength: function (arg, val) {
		return val.length <= arg;
	},

	length: function (arg, val) {
		arg = REFINERYCMS.plugin.Seo.validators.isArray(arg) ? arg: [arg, arg];
		return (arg[0] === null || val.length >= arg[0]) && (arg[1] === null || val.length <= arg[1]);
	},

	isArray: function (arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	}
};


REFINERYCMS.plugin.Seo.analyzers = {
	
	keywordsInTitle: function () {
		
	},
	
	keywordsInDescription: function () {
		
	},
	
	keywordsInText: function () {
		
	},
	
	getReport: function () {
		var result = [];
		
		return result;
	},
	
	run: function () {
		
	}
}

REFINERYCMS.plugin.Seo.decorator = {
	validation_data: [],
	analysis_data: [],
	holder: '',
	report: '',
	rendered: false,
	report_id: 'seo-report',

	getHeader: function () {
		var header = $('#' + this.report_id).find('.header');
		if (header.length > 0) {
			return header;
		}

		header = $('<div />', {
			'class': 'header'
		});

		header.append(
			$('<h2 />', {'text': I18n.t('refinerycms.plugin.seo.seo_report', {defaultValue : 'Seo report'})})
		);

		header.append(
			$('<a />', {
				'id': 'run-seo-validator',
				'text': I18n.t('refinerycms.plugin.seo.run_validator', {defaultValue : 'Validate'}),
				'class': 'button'
			})
		);

		header.append(
			$('<a />', {
				'id': 'run-seo-highlighter',
				'text': I18n.t('refinerycms.plugin.seo.run_highlighter', {defaultValue : 'Highlight keywords'}),
				'class': 'button'
			})
		);

		return header;
	},

	getWrapper: function () {
		var wrapper = $('#' + this.report_id);
		if (wrapper.length > 0) {
			return wrapper;
		}

		return $('<div />', {
			'id': this.report_id
		});
	},

	getContent: function () {
		var content = $('#' + this.report_id).find('.content');
		if (content.length > 0) {
			content.html(this.buildContent());
			return content;
		}

		return $('<div />', {
			'class': 'content',
			'html': this.buildContent()
		});
	},

	getFooter: function () {
		var footer = $('#' + this.report_id).find('.footer');
		if (footer.length > 0) {
			return footer;
		}


		return $('<div />', {
			'class': 'footer',
			'html': '&nbsp;'
		});
	},


	buildAnalysisContent: function () {
		var that = this,
			ul = '',
			error_found = false,
			analysis_holder = $('<div />', {'class': 'analysis-content'});

		return analysis_holder;
	},

	buildValidationContent: function () {
		var that = this,
			ul = '',
			error_found = false,
			elm_key = null,
			rule = null,
			validation_holder = $('<div />', {'class': 'validation-content'});

		for (elm_key in this.validation_data) {
			ul = $('<ul />');
			error_found = false;

			for (rule in this.validation_data[elm_key]) {
	//				console.log('r ' + rule + ' k ' + elm_key + ' ' + this.data[elm_key][rule]);
				if (!this.validation_data[elm_key][rule]) {
					error_found = true;
					
					$('<li />', {
						'class': 'error',
						'text': I18n.t('refinerycms.plugin.seo.validators.state_rule_false', {
							defaultValue: "State of check rule {{rule}} in  {{elm}} is false.", 
							rule: I18n.t('refinerycms.plugin.seo.validators.' + rule, {defaultValue : rule }), 
							elm:  I18n.t('refinerycms.plugin.seo.validators.' + elm_key, {defaultValue : elm_key})
						})
					}).appendTo(ul);
				}
			}

			if (!error_found) {
				$('<li />', {
					'class': 'success',
					'text': I18n.t('refinerycms.plugin.seo.validators.' + elm_key) + ': ' + I18n.t('refinerycms.plugin.seo.validators.state_ok','ok')
				}).appendTo(ul);
			}

			validation_holder.append(ul);
		}

		return validation_holder;
	},

	buildContent: function () {
		var tmp_holder = $('<div />');

		tmp_holder.append(this.buildValidationContent());
		tmp_holder.append(this.buildAnalysisContent());

		return tmp_holder;
	},

	destroy: function () {
		this.report.find('a').unbind('click');
		this.report.remove();
		this.report = '';
	},

	render: function (cfg) {
		cfg = cfg || {};
		var that = this;

		this.validation_data = cfg.validation_data || [];

		this.holder = cfg.holder || $('#more_options');

		if (this.holder.length > 0) {
			this.report = this.getWrapper();
			// when is rendered only rewrite content data

			if (!this.rendered) {
				this.report.append(this.getHeader());
				this.report.append(this.getContent());
//				this.report.append(this.getFooter());

				this.holder.prepend(this.report);
				this.rendered = true;
			} else {
				if (cfg.fade) {
					this.report.fadeOut('normal', function () {
						that.getContent();
						that.report.fadeIn();
					});
				} else {
					this.getContent();
				}
			}
		}
	}
};

REFINERYCMS.plugin.Seo.higlightDecorator = {
	texts: [],
	holder: '',
	report: '',
	rendered: false,
	report_id: 'seo-keywords-highlight-popup',

	getHeader: function () {
		var that = this,
			header = $('#' + this.report_id).find('.header');
		if (header.length > 0) {
			return header;
		}

		header = $('<div />', {
			'class': 'header'
		});

		header.append(
			$('<h2 />', {'text': I18n.t('refinerycms.plugin.seo.highlighted_keywords_on_page', {defaultValue : 'Highlighted keywords on page'})})
		);
		
		var close_button = $('<a />', {
			'text' : I18n.t('refinerycms.plugin.seo.close_popup', {defaultValue : 'Close popup'}),
			'class' : 'button close_dialog',
			'href' : '#test'
		});
		
		close_button.bind('click', function () {
			that.report.hide();
		});
		
		header.append(
			close_button
		);
			
		return header;
	},

	getWrapper: function () {
		var wrapper = $('#' + this.report_id);
		if (wrapper.length > 0) {
			return wrapper;
		}
		
		return $('<div />', {
			'id': this.report_id
		});
	},

	getContent: function () {
		var content = $('#' + this.report_id).find('.content');
		if (content.length > 0) {
			content.html(this.buildContent());
			return content;
		}
		
		return $('<div />', {
			'class': 'content',
			'html': this.buildContent()
		});
	},

	getFooter: function () {
		return $('<div />', {
			'class': 'footer',
			'html': '&nbsp;'
		});
	},

	buildHighlightContent: function () {
		var that = this,
			block,
			higlight_holder = $('<div />', {'class': 'higlight-content'});
		
		$.each(this.texts, function () {	
			block = $('<div />', {
				'html' : $('<h3 />', {'html': this.label})
			});
			
			block.append($('<div />', {'html' : this.body}));

			higlight_holder.append(block);
		});

		return higlight_holder;
	},

	buildContent: function () {
		var tmp_holder = $('<div />');

		tmp_holder.append(this.buildHighlightContent());

		return tmp_holder;
	},

	destroy: function () {
		this.report.find('a').unbind('click');
		this.report.remove();
		this.report = '';
	},

	render: function (cfg) {
		cfg = cfg || {};
		var that = this;

		this.texts = cfg.texts || [];

		this.holder = cfg.holder || $('body');

		if (this.holder.length > 0) {
			this.report = this.getWrapper();
			// when is rendered only rewrite content data

			if (!this.rendered) {
				this.report.append(this.getHeader());
				this.report.append(this.getContent());
				this.holder.prepend(this.report);
				this.report.show();
				this.rendered = true;
			} else {
				if (cfg.fade) {
					this.report.fadeOut('normal', function () {
						that.getContent();
						that.report.fadeIn();
					});
				} else {
					this.getContent();
				}
				
				this.report.show();
			}
		}
	}
};

