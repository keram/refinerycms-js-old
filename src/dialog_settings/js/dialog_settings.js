/**
 * Dialog object handling with default functionality
 *
 * @author     keraM marek@keram.name http//keram.name
 * @copyright  Copyright (C) 2011
 * @version    0.1
 * @class      SettingsDialog
 * @license    MIT
 */

/*global REFINERYCMS, window, $, parent, console */

'use strict';

REFINERYCMS.namespace('REFINERYCMS.dialog');

REFINERYCMS.dialog.SettingsDialog = function (callback) {
	this.name = 'SettingsDialog';
	this.version = '0.1';
	this.callback = callback || null;

	this.init();
};

REFINERYCMS.dialog.SettingsDialog.prototype = {
	// @todo i18n
	validation_rules: {
		'refinery_setting_name': [
			{
				'op': ':filled',
				'msg': 'Email must be filled'
			}
		],
		'refinery_setting_value': [	]
	},

	init: function () {
		try {
			this.submit_button = $('#submit_button');
			this.init_submit_loader();
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
