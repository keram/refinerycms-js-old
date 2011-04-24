/**
 * Dialog object handling with editor images
 *
 * @author     keraM marek@keram.name http//keram.name
 * @copyright  Copyright (C) 2011
 * @version   0.1
 * @class     ImageDialog
 * @license    MIT
 */


/*global REFINERYCMS, window, $, parent, console */

'use strict';

REFINERYCMS.namespace('REFINERYCMS.dialog');

REFINERYCMS.dialog.ImageDialog = function (callback) {
	this.name = 'ImageDialog';
	this.version = '0.1';
	this.callback = callback || null;

	this.init();
};

REFINERYCMS.dialog.ImageDialog.prototype = {

	// @todo i18n
	validation_rules: {
		'image-url': [{op: ':filled', msg: 'Url must be filled'}, {op: ':url', msg: 'Is not valid url'}]
	},

	set_image: function (image) {
		var that = this,
			existing_image_size_area = $('#existing_image_size_area'),
			existing_image_area_content = $('#existing_image_area_content'),
			img = image || [];

		if (img.length > 0) {
			existing_image_area_content.find('li.selected').removeClass('selected');
			var existing_image_area_content_selected_a = existing_image_size_area.find('li.selected a');
			var geometry = existing_image_area_content_selected_a.attr('data-geometry'),
				size = existing_image_area_content_selected_a.attr('data-size'),
				resize = $("#wants_to_resize_image").is(':checked'),
				img_src = resize ? img.attr('data-' + size) : img.attr('data-original');

			img.parent().addClass('selected');
			REFINERYCMS.editor.set_image_values(img_src, img.attr('alt'), img.attr('title'), geometry);
		}
	},

	init_actions: function () {
		this.init_include_existing_image();
		this.init_include_url_image();
	},

	init_include_existing_image: function () {
		var that = this,
			selected_img = [],
			submit_button = $('#existing_image_submit_button'),
			existing_image_size_area = $('#existing_image_size_area'),
			existing_image_area_content = $('#existing_image_area_content'),
			wants_to_resize_image = $('#wants_to_resize_image');

		submit_button.click(function (e) {
			e.preventDefault();
			that.submit_loader_on();
			REFINERYCMS.editor.dialog_submit();
		});

		existing_image_size_area.find('a').click(function (e) {
			existing_image_size_area.find('li').removeClass('selected');
			$(this).parent().addClass('selected');
			wants_to_resize_image.attr('checked', 'checked');
			that.set_image(existing_image_area_content.find('li.selected img'));
			e.preventDefault();
		});

		wants_to_resize_image.change(function () {
			if ($(this).is(":checked")) {
				existing_image_size_area.find('li:first a').click();
			} else {
				existing_image_size_area.find('li').removeClass('selected');
				that.set_image(existing_image_area_content.find('li.selected img'));
			}
		});

		existing_image_area_content.find('img').click(function (e) {
			e.preventDefault();
			that.set_image($(this));
			return false;
		});

		//Select any currently selected, just uploaded, first ..
		selected_img = existing_image_area_content.find('li.selected img');
		selected_img = selected_img.length === 0 ? existing_image_area_content.find('img').first() : selected_img;

		if (selected_img.length > 0) {
			that.set_image(selected_img);
		}
	},

	init_include_url_image: function () {
		var that = this;
		$('#url_image_submit_button').click(function (e) {
			var url_image_input = $('#image-url'),
				alt_image_input = $('#image-url-alt'),
				url_image_val = url_image_input.val(),
				alt_image_val = alt_image_input.val(),
				valid = REFINERYCMS.form.validateControl(url_image_input.get(0), this.validation_rules['image-url'], false);

			e.preventDefault();

			if (valid) {
				REFINERYCMS.editor.set_image_values(url_image_val, alt_image_val, alt_image_val, null);
				REFINERYCMS.editor.dialog_submit();
			}
		});

	},

	init: function () {
		try {
			this.init_actions();
			this.init_tabs();
			// editor do this
			// this.init_close();
			this.initialised = true;
		} catch (e) {
			// @todo process Exception
		}
	}
};

REFINERYCMS.extendObject(REFINERYCMS.dialog.ImageDialog, REFINERYCMS.Dialog);