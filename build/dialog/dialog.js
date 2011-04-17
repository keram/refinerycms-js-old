
	/**
	 * Dialog object handling with default functionality
	 *
	 * @author     keraM marek@keram.name http//keram.name
	 * @copyright  Copyright (C) 2011
	 * @license    MIT
	 * @version   0.1
	 * @class     Dialog
	 */
	
	REFINERYCMS.Dialog = function () {
		throw new Error(this.name + '_is_not_instantiable');
	};

	REFINERYCMS.Dialog.prototype = {
		name: 'Dialog',
		version: '0.1',
		callback: null,
		active_area: null,
		initialised: false,

		validation_rules: [],

		init_tabs: function () {
			var that = this,
				radios = $('#dialog_menu_left input:radio'),
				error = $('#errorExplanation'),
				selected = radios.parent().filter('.selected_radio').find('input:radio').first() || radios.first();

			// if error exists, then switch to responsible tab
			if (error.length > 0) {
				var dialog_area = error.closest('div.dialog_area');
				if (dialog_area.length > 0) {
					selected = $('#' + dialog_area.attr('id').replace('_area', '_radio')).find('input:radio').first();
				}
			}

			selected.attr('checked', 'true');
			that.switch_area(selected);
			
			radios.click(function () {
				that.switch_area($(this));
			});
		},

		/**
		 * @abstract
		 */
		disable_submit: function () { },

		/**
		 * @abstract
		 */
		enable_submit: function () { },

		submit_loader_off: function () {
			$('img.save-loader').remove();
		},

		submit_loader_on: function () {			
			$('<img src="/images/refinery/ajax-loader.gif" width="16" height="16" class="save-loader" />').appendTo($('div.form-actions-left'));
		},

		switch_area: function (area) {
			var elm = $(area);
			$('#dialog_menu_left .selected_radio').removeClass('selected_radio');
			elm.parent().addClass('selected_radio');
			$('#dialog_main .dialog_area').hide();
			$('#' + elm.val() + '_area').show();
			this.active_area = elm.val();
		},

		validate_active_tab: function () {
			var valid = true,
				elm_id = null,
				elm = null;

			if (this.validation_rules && this.validation_rules[this.active_area]) {
				for (elm_id in this.validation_rules[this.active_area]) {

					elm = document.getElementById(elm_id);
					if (elm) {
						valid = REFINERYCMS.form.validateControl(elm, this.validation_rules[this.active_area][elm_id], true);
					}
					if (!valid) {
						break;
					}
				}
			}

			return valid;
		},

		iframed: function () {
			return (parent && parent.document && parent.document.location.href !== document.location.href && $.isFunction(parent.$));
		},

		close: function () {
			var the_body, the_dialog;
			// if there's a wymeditor involved don't try to close the dialog as wymeditor will.
			// but we need this? (keram)
			if (!$(document.body).hasClass('wym_iframe_body')) {
				the_body = this.iframed() ? $(parent.document.body) : $(document.body);
				the_dialog = the_body.find('.ui-dialog-content');

				the_body.removeClass('hide-overflow');
				the_dialog.filter(':data(dialog)').dialog('close');
				the_dialog.remove();
			}

			return false;
		},

		// i dont know if this is needed
		init_close: function () {
			var that = this;
			$('.close_dialog').click(function (e) {
				e.preventDefault();
				that.close();
			});
		},

		init: function () {}
	};
