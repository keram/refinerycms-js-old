/**
 * Dialog object handling with default functionality
 *
 * @author     keraM marek@keram.name http//keram.name
 * @copyright  Copyright (C) 2011
 * @license    MIT
 */

/*global REFINERYCMS, window, $, parent, console */

(function (cms, window) {
	'use strict';

	cms.namespace('REFINERYCMS.dialog');

	/**
	 * LinkDialog
	 *
	 * @author    marek
	 * @version   0.1
	 * @class     LinkDialog
	 */
	cms.dialog.LinkDialog = function (callback) {
		this.name = 'LinkDialog';
		this.version = '0.1';
		this.callback = callback || null;

		this.init();
	};

	cms.dialog.LinkDialog.prototype = {
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

		submit_link_choice: function () {
			$(parent.document.getElementById('wym_dialog_submit')).click();
		},

		resource_tab: function () {
			// ??
//			$('#submit_button').click(function (e) {
//				var resource_selected = $('#existing_resource_area_content li.linked a'),
//				resourceUrl = null,
//				relevant_href = null;
//
//				e.preventDefault();
//				if (resource_selected.length > 0) {
//					resourceUrl = parseURL(resource_selected.attr('href'));
//					relevant_href = resourceUrl.pathname;
//
//					// Add any alternate resource stores that need a absolute URL in the regex below
//					if (resourceUrl.hostname.match(/s3.amazonaws.com/)) {
//						relevant_href = resourceUrl.protocol + '//' + resourceUrl.host + relevant_href;
//					}
//
//					if (typeof (resource_picker.callback) == 'function') {
//						resource_picker.callback({
//							id: resource_selected.attr('id').replace('resource_', ''),
//							href: relevant_href,
//							html: resource_selected.html()
//						});
//					}
//				}
//			});
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
				that.set_wym_values(url, link.rel.replace(/\ ?<em>.+?<\/em>/, ''));
			});
		},

		web_tab: function () {
			var that = this,
				web_address_text = $('#web_address_text'),
				web_address_target_blank = $('#web_address_target_blank'),
				rules = this.validation_rules.web_address || {},
				validate = function (e) {
					var val = web_address_text.val(),
						valid = (!rules[this.id] || cms.form.validateControl(this, rules[this.id], true)) ? true : false,
						icon = valid ? 'success_icon' : 'failure_icon';

					if (typeof (rules[this.id]) !== 'undefined') {
						$('#' + this.id.replace('_text', '_test_result')).removeClass().addClass(icon).show();
					}
					if (valid) {
						that.set_wym_values(
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
				parent.document.getElementById('wym_target').value = this.checked ? '_blank' : '';
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
						valid = (!rules[this.id] || cms.form.validateControl(this, rules[this.id], true)) ? true : false,
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

						that.set_wym_values(mailto, mailto.replace('mailto:', ''));
					}
				};

			$('#email_address_text, #email_default_subject_text, #email_default_body_text').keyup(validate);
			$('#email_address_text, #email_default_subject_text, #email_default_body_text').change(validate);
		},

		set_wym_values: function (url, title, target) {
			if (parent) {
				var wym_href = parent.document.getElementById('wym_href'),
					wym_title = parent.document.getElementById('wym_title'),
					wym_target = parent.document.getElementById('wym_target');

				target = target || null;

				if (wym_href !== null && url !== null) {
					wym_href.value = url;
				}
				if (wym_title !== null && title !== null) {
					wym_title.value = title;
				}
				if (wym_target !== null && target !== null) {
					wym_target.value = target;
				}
			}
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
					that.submit_link_choice();
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

	cms.extendObject(cms.dialog.LinkDialog, cms.Dialog);
}(REFINERYCMS, window));
