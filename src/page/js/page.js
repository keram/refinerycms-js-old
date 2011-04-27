/**
*
* @todo Description
* @version    $Id$
* @package    refinerycms-js
* @copyright  Copyright (C) 2011
* @author     keraM marek@keram.name http//keram.name
* @license    MIT
*/

REFINERYCMS.page = {
	initialised: false,
	tabs: null,

	show_options: function () {
		$('#toggle_advanced_options').click(function(e) {
			e.preventDefault();
			$('#more_options').animate({
				opacity: 'toggle',
				height: 'toggle'
			}, 250);

			$('html,body').animate({
				scrollTop: $('#toggle_advanced_options').parent().offset().top
			}, 250);
		});
	},

	title_type: function () {
		$('#page_custom_title').parents('.field').find('input:radio').change(function() {
			$('#custom_title_text, #custom_title_image').hide();
			$('#custom_title_' + this.value).show();
		});
	},

	page_part_editor: function () {
		var that = this,
			new_page_part_title = $('#new_page_part_title'),
			new_page_part_editor = $('#new_page_part_editor'),
			new_page_part_index = $('#new_page_part_index'),
			page_part_editors = $('#page_part_editors'),
			add_page_part = $('#add_page_part'),
			new_page_part_save = $('#new_page_part_save'),
			submit_continue_button = $('#submit_continue_button'),
			new_page_part_cancel = $('#new_page_part_cancel'),
			delete_page_part = $('#delete_page_part');


		new_page_part_editor.editor({
			title: I18n.t('refinerycms.page.new_page_part_editor_title', 'Create Content Section'),
			modal: true,
			resizable: false,
			autoOpen: false,
			width: 600,
			height: 200
		});

		add_page_part.click(function(e) {
			e.preventDefault();
			new_page_part_editor.editor('open');
		});

		new_page_part_save.click(function(e) {
			var part_title = new_page_part_title.val();
			e.preventDefault();

			if (part_title.length > 0) {
				var tab_title = part_title.toLowerCase().replace(' ', '_');

				if ($('#part_' + tab_title).size() === 0) {
					$.get(that.new_part_url, {
						title: part_title,
						part_index: new_page_part_index.val(),
						body: ''
					}, function(data, status) {
						submit_continue_button.remove();
						// Add a new tab for the new content section.
						$(data).appendTo(page_part_editors);
						that.tabs.tabs('add', '#page_part_new_' + new_page_part_index.val(), part_title);
						that.tabs.tabs('select', new_page_part_index.val());

						// hook into edtior to instruct it to select this new tab again once it has loaded.
						REFINERYCMS.editor.onload_functions.push(function() {
							$('#page_part_new_' + new_page_part_index.val()).appendTo(page_part_editors);
							that.tabs.tabs('select', new_page_part_index.val());
						});

						// turn the new textarea into a editor.
						REFINERYCMS.editor.init();

						// Wipe the title and increment the index counter by one.
						new_page_part_index.val(parseInt(new_page_part_index.val(), 10) + 1);
						new_page_part_title.val('');

						new_page_part_editor.editor('close');
						new_page_part_editor.remove();
					}
					);
				} else {
					alert(I18n.t('refinerycms.page.title_already_exists', { defaultValue: 'A content section with that title already exists, please choose another.'}));
				}
			} else {
				alert(I18n.t('refinerycms.page.not_entered_title', { defaultValue: 'You have not entered a title for the content section, please enter one.'}));
			}
		});

		new_page_part_cancel.click(function(e) {
			e.preventDefault();
			new_page_part_editor.editor('close');
			new_page_part_title.val('');
		});

		delete_page_part.click(function(e) {
			e.preventDefault();
			var confirmed = confirm(I18n.t(
				'refinerycms.page.confirm_delete',
				{
					defaultValue: 'This will remove the content section "{section_title}" immediately. \nAre you sure?',
					section_title: $('#page_parts .ui-tabs-selected a').text()
				}
			));

			if (confirmed) {
				var tabId = that.tabs.tabs('option', 'selected');
				$.ajax({
					url: that.del_part_url + '/' + $('#page_parts_attributes_' + tabId + '_id').val(),
					type: 'DELETE'
				});
				that.tabs.tabs('remove', tabId);
				$('#page_parts_attributes_' + tabId + '_id').remove();
				submit_continue_button.remove();
			}
		});
	},

	init: function (enable_parts, new_part_url, del_part_url) {
		var tabs = $('#page-tabs'),
			part_shown = tabs.find('.page_part.field').not('.ui-tabs-hide');

		tabs.tabs({
			tabTemplate: '<li><a href="#{href}">#{label}</a></li>'
		});

		tabs.find('.page_part.field').removeClass('ui-tabs-hide');

		this.enable_parts = enable_parts;
		this.new_part_url = new_part_url;
		this.del_part_url = del_part_url;
		this.show_options();
		this.title_type();

		// hide the tabs that are supposed to be hidden.
		tabs.find('.page_part.field').not(part_shown).addClass('ui-tabs-hide');

		if (this.enable_parts) {
			this.page_part_editor();
		}
		this.initialised = true;
	}
};