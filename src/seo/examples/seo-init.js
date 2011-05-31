/*global REFINERYCMS, Object, Error, window, $, parent, console */

$(function () {
	
	$('#more_options').show();
	
	if (typeof (REFINERYCMS) === 'undefined') {
		throw new Error('REFINERYCMS object is undefined');
	}

	if (typeof (REFINERYCMS.plugin.Seo) === 'undefined') {
		throw new Error('REFINERYCMS.plugin.Seo is undefined');
	}
	
	var cms = REFINERYCMS,
		seo = new cms.plugin.Seo(),
		elm_keywords = $('#page_meta_keywords'),
		elm_browser_title = $('#page_browser_title'),
		elm_description = $('#page_meta_description');

	if (elm_keywords.length > 0 && elm_browser_title.length > 0 && elm_description.length) {
		seo.render();

		var keywords_rules = {
			'filled': true,
			'min_length': 3,
			'min_word_length' : 3,
			'max_length': 100,
			'min_words_count': 2,
			'max_words_count': 5
		};

		var title_rules = {
			'filled': true,
			'min_length': 3,
			'max_length': 10
		};

		var description_rules = {
			'filled': true,
			'min_length': 20,
			'max_length': 140
		};

		var onchange = function () {
			seo.render({
				'validation_data': seo.validate()
			});
		};

		seo.set_element(elm_keywords, 'meta_tag_keywords', keywords_rules);
		seo.set_element(elm_browser_title, 'browser_title', title_rules);
		seo.set_element(elm_description, 'meta_tag_description', description_rules);

		seo.set_stop_on_first_error(true);

		elm_keywords.bind('change', onchange);
		elm_description.bind('change', onchange);
		elm_browser_title.bind('change', onchange);

		$('#run-seo-validator').bind('click', function () {

			seo.render({
				'validation_data': seo.validate(),
				'fade': true
			});
			
			return false;
		});
		
		elm_keywords.val('lorem');
		
		$('#run-seo-highlighter').bind('click', function () {
			var kw = '',
				v = seo.validate();
			
			
			// wymeditor smells
			$.each(WYMeditor.INSTANCES, function(index, wym) {
			  wym.update();
			});

			if (v['meta_tag_keywords']['filled']) {
				kw = elm_keywords.val().split(', ');
				seo.set_keywords(kw);
				seo.highlight();
			}
			
			return false;
		});
		
		
//		$('#run-seo-highlighter').trigger('click');
	}

});