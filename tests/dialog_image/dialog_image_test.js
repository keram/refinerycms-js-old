// create private environment
(function() {

	// create shorthand
	if (typeof REFINERYCMS !== 'undefined') {
		var cms = REFINERYCMS;
	}

	var refinerycmsImageDialogTestCase = new YUITest.TestCase({

		//name of the test case - if not provided, one is auto-generated
		name : "REFINERYCMS Image Dialog Tests",

		//---------------------------------------------------------------------
		// setUp and tearDown methods - optional
		//---------------------------------------------------------------------

		/*
         * Sets up data that is needed by each test.
         */
		setUp : function () {
			this.data = {
			};
		},

		/*
         * Cleans up everything that was created by setUp().
         */
		tearDown : function () {
			delete this.data;
		},

		//---------------------------------------------------------------------
		// Test methods - names must begin with "test"
		//---------------------------------------------------------------------

		testInitialization : function () {
			var Assert = YUITest.Assert;

			Assert.isObject(cms.dialog.ImageDialog);
		},

		testInheritation : function () {
			var Assert = YUITest.Assert;

			var my_dialog_image = new cms.dialog.ImageDialog();
			Assert.isFunction(my_dialog_image.init_tabs);
		}
	});

	suite.add(refinerycmsImageDialogTestCase);


})();
