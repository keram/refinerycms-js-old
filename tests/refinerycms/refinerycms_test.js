// create private environment
(function() {

	// create shorthand
	if (typeof REFINERYCMS !== 'undefined') {
		var cms = REFINERYCMS;
	}

	var refinerycmsCoreTestCase = new YUITest.TestCase({

		//name of the test case - if not provided, one is auto-generated
		name : "REFINERYCMS Core Tests",

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

			Assert.isObject(cms);
		},

		testNamespace : function () {
			var Assert = YUITest.Assert;
			
			cms.namespace('REFINERYCMS.test');
			
			Assert.isObject(cms.test);
		},

		testTranslations : function () {
			var Assert = YUITest.Assert;


			Assert.areEqual(cms.translate('prev'), 'Prev');
			Assert.areEqual(cms.translate('fnc'), 2);
			Assert.areEqual('jurko “janosik', cms.translate('tpl', 'janosik'));
		},

		testExtend : function () {
			var Assert = YUITest.Assert;
			
			function Fruit( color )
			{
				this.color = color;
			}

			Fruit.prototype.yellColor = function()
			{
				alert( this.color );
			}

			function Apple( color )
			{
				Fruit.call( this, color );
			}
			
			Apple.prototype = {
				runDown: function() {
					return 1;
				}
			}

			cms.extendObject(Apple, Fruit);
			var apple = new Apple("red");
			
			Assert.isInstanceOf(Apple, apple);
			Assert.isInstanceOf(Fruit, apple);
			Assert.isFunction(apple.runDown);
			Assert.isFunction(apple.yellColor);
		}
	});

	suite.add(refinerycmsCoreTestCase);

})();
