// create private environment
(function() {

	// create shorthand
	if (typeof REFINERYCMS !== 'undefined') {
		var cms = REFINERYCMS;
	}

	var refinerycmsSeoTestCase = new YUITest.TestCase({

		//name of the test case - if not provided, one is auto-generated
		name : "REFINERYCMS Seo Plugin Tests",

		//---------------------------------------------------------------------
		// setUp and tearDown methods - optional
		//---------------------------------------------------------------------

		/*
         * Sets up data that is needed by each test.
         */
		setUp : function () {
			this.data = {
				'text': 'Ford podal knihu. \n\
Co je to na restauraci McDonalds. \n\
McDonaldův hamburger už jistě doslechl, \n\
plusmínus řídili jeho vzpomínkách.',
				'keywords': ['trilian', 'anglie']
			};
			
			this.html_data_holder = $('#content-for-tests');
			this.seo = new cms.plugin.Seo(this.data);
		},

		/*
         * Cleans up everything that was created by setUp().
         */
		tearDown : function () {
			delete this.data;
			delete this.html_data_holder;
			delete this.seo;
		},
		
		prepareKeywordInput : function () {
			var elm = $('#meta_tag_keywords');
			if (elm.length == 0) {
				$('<input />', {
					'value': '',
					'id': 'meta_tag_keywords',
					'type': 'text'
				}).appendTo(this.html_data_holder);
				
				elm = $('#meta_tag_keywords');
			}
			
			return elm;
		},

		//---------------------------------------------------------------------
		// Test methods - names must begin with "test"
		//---------------------------------------------------------------------

		testInitialization : function () {
			var Assert = YUITest.Assert;

			Assert.isObject(this.seo);
			Assert.areEqual('Ford podal knihu. Co je to na restauraci McDonalds. McDonaldův hamburger už jistě doslechl, plusmínus řídili jeho vzpomínkách.', this.seo.get_text());
			Assert.areEqual(this.data.keywords, this.seo.get_keywords());
		},

		testCountWordsInText : function () {
			var Assert = YUITest.Assert;

			Assert.isFunction(this.seo.count_text_words);
			Assert.areEqual(18, this.seo.count_text_words());
		},

		testCountKeywords : function () {
			var Assert = YUITest.Assert;

			Assert.isFunction(this.seo.count_keywords);
			Assert.areEqual(2, this.seo.count_keywords());

			var words = this.seo.get_text_words();
		},

		testWordsSanitization : function () {
			var Assert = YUITest.Assert;
			var words = this.seo.get_text_words();

			Assert.areEqual('podal', words[1]);
			Assert.areEqual('knihu', words[2]);
		},

		testSeoValidatorMetaTagKeywordsFilled : function () {
			var Assert = YUITest.Assert,
				meta_key_input = this.prepareKeywordInput();
				validate = this.seo.validate();

			Assert.isFalse(validate['meta_tag_keywords']['filled']);	
			
			meta_key_input.val('lorem, ipsum, dolor');
			validate = this.seo.validate();
			Assert.isTrue(validate['meta_tag_keywords']['filled']);

			// clear on test end
			meta_key_input.val('');
		},

		testSeoValidatorMetaTagKeywordsMinLength : function () {
			var Assert = YUITest.Assert,
				meta_key_input = this.prepareKeywordInput();
				validate = null;
			
//			this.seo.set_validation_rules();
			this.seo.set_stop_on_first_error(false);
			
			validate = this.seo.validate();
			
			// test empty value
			Assert.isFalse(validate['meta_tag_keywords']['min_length']);
			
			// test filled correct value
			meta_key_input.val('lorem, ipsum, dolor');
			validate = this.seo.validate();
			Assert.isTrue(validate['meta_tag_keywords']['min_length']);
			
			// test short value
			meta_key_input.val('lorem');
			validate = this.seo.validate();
			Assert.isFalse(validate['meta_tag_keywords']['min_length']);

			// clear
			meta_key_input.val('');
		},

		testSeoValidatorMetaTagKeywordsMaxLength : function () {
			var Assert = YUITest.Assert;	
				meta_key_input = this.prepareKeywordInput();
				validate = null;
			
//			this.seo.set_validation_rules();
			this.seo.set_stop_on_first_error(false);
			
			validate = this.seo.validate();
			
			// test empty value
			Assert.isTrue(validate['meta_tag_keywords']['max_length']);
			
			// test filled correct value
			meta_key_input.val('lorem, ipsum, dolor');
			validate = this.seo.validate();
			Assert.isTrue(validate['meta_tag_keywords']['max_length']);
			
			// test long value
			meta_key_input.val('lorem, ipsum, dolor, sit, amet, parsley, over the unpeeled, kind, put three quarters, of the soup, jurko, majka, veronika');
			validate = this.seo.validate();
			Assert.isFalse(validate['meta_tag_keywords']['max_length']);
			
			// clear
			meta_key_input.val('');
		},

		testSeoValidatorKeywordsCount : function () {
			var Assert = YUITest.Assert,
				meta_key_input = this.prepareKeywordInput();
				validate = null;
			
//			this.seo.set_validation_rules();
			this.seo.set_stop_on_first_error(false);
			
			validate = this.seo.validate();

			// test empty value
			Assert.isFalse(validate['meta_tag_keywords']['min_words_count']);
			
			// test filled correct value
			meta_key_input.val('lorem, ipsum, dolor, ipsum');
			validate = this.seo.validate();
			Assert.isTrue(validate['meta_tag_keywords']['min_words_count']);
			Assert.isTrue(validate['meta_tag_keywords']['max_words_count']);

			// test long value
			meta_key_input.val('lorem, ipsum, dolor, sit, amet, parsley, over the unpeeled, kind, put three quarters, of the soup, jurko, majka, veronika');
			validate = this.seo.validate();
			Assert.isFalse(validate['meta_tag_keywords']['max_words_count']);

			// clear
			meta_key_input.val('');
		},
		
		testSeoValidatorRenderer : function () {
			var Assert = YUITest.Assert,
				meta_key_input = this.prepareKeywordInput(),
				seo = this.seo;
			
			// test filled correct value
			meta_key_input.val('lorempsiufdsam');
			
			
			seo.render({
				'holder' : $('#content-for-tests')
			});
			
			
			$('#seo-report a.button').bind('click', function () {
				seo.set_stop_on_first_error(true);
				seo.render({
					'holder' : $('#content-for-tests'),
					'validation_data' : seo.validate(),
					'analysis_data' : seo.analyse()
				});
				
				return false;
			});
			
			
			Assert.isTrue(!!$('#seo-report').html().match(/Seo report/));
			
			$('#seo-report').remove();
			meta_key_input.val('');
		},
		
		testEmptyDataAnalyzeReturnObject : function () {
			var Assert = YUITest.Assert,	
				meta_key_input = this.prepareKeywordInput(),
				seo = this.seo,
				analyse = seo.analyse();
			
			Assert.isTrue(typeof (analyse) == 'object');
			Assert.isTrue(analyse.length === 0);
		},
		
		testSeoValidatorKeywordsHiglighter : function () {
			var Assert = YUITest.Assert,
				validation = null,
				ht = null,
				seo = this.seo;
			
			// test filled correct value
			seo.set_text('janiccka');
			
			ht1 = seo.get_highlighted_keywords();
			
			Assert.areEqual('janiccka', ht1);
			
			// test filled correct value
			seo.set_text('Nice relaxed and, to Trilian shrugged and researchers backpack ringing rap on the trilian bulldozer drivers.');
			
			ht2 = seo.get_highlighted_keywords();
			
			Assert.areEqual('Nice relaxed and, to <span class="keyword-highlighted">Trilian</span> shrugged and researchers backpack ringing rap on the <span class="keyword-highlighted">trilian</span> bulldozer drivers.', ht2);
			
			$('#content-for-tests').html(ht2);
			
		}
	});

	suite.add(refinerycmsSeoTestCase);
})();
