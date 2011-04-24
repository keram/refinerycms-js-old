/**
 * vseobecne rezhranie pre editor
 * (moze to byt wymeditor alebo hocijaky, dolezite aby implementoval tieto metody)
 * potom, default: wymeditor
 *
 * @author     keraM marek@keram.name http//keram.name
 * @copyright  Copyright (C) 2011
 * @license    MIT
 * @version   0.1
 * @class     Editor
 */
REFINERYCMS.editor = {
	config: {
		iframe_class: 'wym_iframe_body'
	},

	set_image_values: function (img_src, img_alt, img_title, geometry) {
		if (parent) {
			var wym_src = parent.document.getElementById('wym_src'),
				wym_alt = parent.document.getElementById('wym_alt'),
				wym_title = parent.document.getElementById('wym_title'),
				wym_size = parent.document.getElementById('wym_size');

			geometry = geometry || null;

			if (wym_src !== null && img_src !== null) {
				wym_src.value = img_src;
			}
			if (wym_alt !== null && img_alt !== null) {
				wym_alt.value = img_alt;
			}
			if (wym_title !== null && img_title !== null) {
				wym_title.value = img_title;
			}
			if (wym_size !== null && geometry !== null) {
				wym_size.value = geometry.replace(/[<>=]/g, '');
			}
		}
	},

	set_link_checked_value: function (val) {
		parent.document.getElementById('wym_target').value = val;
	},

	dialog_submit: function () {
		$(parent.document.getElementById('wym_dialog_submit')).click();
	},

	set_link_values: function (url, title, target) {
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

	is_dialog_active: function () {
		return $(document.body).hasClass(this.config.iframe_class);
	},

	// @todo
	// in page: hook into edtior to instruct it to select this new tab again once it has loaded.
	onload_functions: {
		push: function () {}
	},

	// in page: turn the new textarea into a editor.
	init: function () {}
};