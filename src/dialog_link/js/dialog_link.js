/**
 * Dialog object handling with default functionality
 *
 * @author     keraM marek@keram.name http//keram.name
 * @copyright  Copyright (C) 2011
 * @version   0.1
 * @class     LinkDialog
 * @license    MIT
 */

/*global REFINERYCMS, window, $, parent, console */

'use strict';

REFINERYCMS.namespace('REFINERYCMS.dialog');

REFINERYCMS.dialog.LinkDialog = function (callback) {
	this.name = 'LinkDialog';
	this.version = '0.1';
	this.callback = callback || null;

	this.init();
};

REFINERYCMS.dialog.LinkDialog.prototype = {
	// @todo i18n
	validation_rules: {
		'your_page': {},
		'email_address': {
			'email_address_text': [
				{
					'op': ':filled',
					'msg': 'Email must be filled'
				},
				{
					'op': ':email',
					'msg': 'Email is not valid'
				}
			]
		},
		'web_address': {
			'web_address_text' : [
				{
					'op': ':filled',
					'msg': 'Location must be filled'
				},
				{
					'op': ':url',
					'msg': 'Location is not valid'
				}
			]
		},
		'resource_address': {}
	},

	//parse a URL to form an object of properties
	parse_url: function (url) {
		//save the unmodified url to href property
		//so that the object we get back contains
		//all the same properties as the built-in location object
		var loc = {
			'href' : url
		};

		//split the URL by single-slashes to get the component parts
		var parts = url.replace('//', '/').split('/');

		//store the protocol and host
		loc.protocol = parts[0];
		loc.host = parts[1];

		//extract any port number from the host
		//from which we derive the port and hostname
		parts[1] = parts[1].split(':');
		loc.hostname = parts[1][0];
		loc.port = parts[1].length > 1 ? parts[1][1] : '';

		//splice and join the remainder to get the pathname
		parts.splice(0, 2);
		// ensure we don't destroy absolute urls like /system/images/whatever.jpg
		loc.pathname = (loc.href[0] == '/' ? ("/" + loc.host) : '');
		loc.pathname += '/' + parts.join('/');

		//extract any hash and remove from the pathname
		loc.pathname = loc.pathname.split('#');
		loc.hash = loc.pathname.length > 1 ? '#' + loc.pathname[1] : '';
		loc.pathname = loc.pathname[0];

		//extract any search query and remove from the pathname
		loc.pathname = loc.pathname.split('?');
		loc.search = loc.pathname.length > 1 ? '?' + loc.pathname[1] : '';
		loc.pathname = loc.pathname[0];

		var options = url.split('?')[1];
		loc.options = options;

		//return the final object
		return loc;
	},

	resource_tab: function () {
		var that = this;
		$('#resources_list').delegate('li', 'click', function (e) {
			var elm = $(this),
				resource_selected = elm.children('a'),
				resource_url = that.parse_url(resource_selected.attr('href'));
				relevant_href = resource_url.pathname;

				// Add any alternate resource stores that need a absolute URL in the regex below
				if (resource_url.hostname.match(/s3.amazonaws.com/)) {
					relevant_href = resource_url.protocol + '//' + resource_url.host + relevant_href;
				}
				$('li.linked').removeClass('linked');
				elm.addClass('linked');
				REFINERYCMS.editor.set_link_values(relevant_href, resource_selected.attr('rel'), '');
		});	
	},

	//Same for resources tab
	page_tab: function () {
		var that = this;

		$('#pages_list').delegate('li', 'click', function (e) {
			var elm = $(this),
				link = elm.children('a.page_link').get(0),
				port = (window.location.port.length > 0 ? (':' + window.location.port) : ''),
				url = link.href.replace(window.location.protocol + '//' + window.location.hostname + port, '');

			e.preventDefault();
			$('li.linked').removeClass('linked');
			elm.addClass('linked');
			REFINERYCMS.editor.set_link_values(url, link.rel.replace(/\ ?<em>.+?<\/em>/, ''));
		});
	},

	web_tab: function () {
		var that = this,
			web_address_text = $('#web_address_text'),
			web_address_target_blank = $('#web_address_target_blank'),
			rules = this.validation_rules.web_address || {},
			validate = function (e) {
				var val = web_address_text.val(),
					valid = (!rules[this.id] || REFINERYCMS.form.validateControl(this, rules[this.id], true)) ? true : false,
					icon = valid ? 'success_icon' : 'failure_icon';

				if (typeof (rules[this.id]) !== 'undefined') {
					$('#' + this.id.replace('_text', '_test_result')).removeClass().addClass(icon).show();
				}
				if (valid) {
					REFINERYCMS.editor.set_link_values(
						val,
						val,
						(web_address_target_blank.checked ? '_blank' : '')
					);

					if (typeof (rules[this.id]) !== 'undefined') {
						var test_result_elm = $('#' + this.id.replace('_text', '_test_result'));
						if (test_result_elm.length === 0) {
							$(this).after('<span id="' + this.id.replace('_text', '_test_result') + '"></span>');
							test_result_elm = $('#' + this.id.replace('_text', '_test_result'));
						}
						test_result_elm.removeClass().addClass(icon).show();
					}
				}
			};

		web_address_text.keyup(validate);
		web_address_text.change(validate);

		web_address_target_blank.click(function () {
			REFINERYCMS.editor.set_link_checked_value(this.checked ? '_blank' : '');
		});
	},

	email_tab: function () {
		var that = this,
			rules = this.validation_rules.email_address || {},
			validate = function (e) {
				var default_subject = $('#email_default_subject_text').val(),
					default_body = $('#email_default_body_text').val(),
					mailto = 'mailto:' + $('#email_address_text').val(),
					modifier = '?',
					valid = (!rules[this.id] || REFINERYCMS.form.validateControl(this, rules[this.id], true)) ? true : false,
					icon = valid ? 'success_icon' : 'failure_icon';

				if (typeof (rules[this.id]) !== 'undefined') {
					var test_result_elm = $('#' + this.id.replace('_text', '_test_result'));
					test_result_elm.removeClass().addClass(icon).show();
				}

				if (valid) {
					if (default_subject.length > 0) {
						mailto += modifier + 'subject=' + default_subject;
						modifier = '&';
					}

					if (default_body.length > 0) {
						mailto += modifier + 'body=' + default_body;
						modifier = '&';
					}

					REFINERYCMS.editor.set_link_values(mailto, mailto.replace('mailto:', ''));
				}
			};

		$('#email_address_text, #email_default_subject_text, #email_default_body_text').keyup(validate);
		$('#email_address_text, #email_default_subject_text, #email_default_body_text').change(validate);
	},

	disable_submit: function () {
		this.submit_button.attr('disabled', true).addClass('disabled');
	},

	enable_submit: function () {
		this.submit_button.attr('disabled', false).removeClass('disabled');
	},

	init_submit_button: function () {
		var that = this;

		this.submit_button.click(function (e) {
			that.submit_loader_off();
			if (that.validate_active_tab()) {
				that.submit_loader_on();
				REFINERYCMS.editor.dialog_submit();
			}
		});
	},

	init: function () {
		try {
			this.submit_button = $('#submit_button');
			this.page_tab();
			this.web_tab();
			this.email_tab();
			this.resource_tab();
			this.init_tabs();
			this.init_submit_button();
			this.initialised = true;
		} catch (e) {
			// @todo
			console.log(e);
		}
	}
};

REFINERYCMS.extendObject(REFINERYCMS.dialog.LinkDialog, REFINERYCMS.Dialog);
