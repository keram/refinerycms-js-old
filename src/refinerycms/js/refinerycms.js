/**
 * The REFINERYCMS object is the single global object used by RefineryCMS.
 * 
 * @version    $Id$
 * @package    refinerycms-js
 * @copyright  Copyright (C) 2011
 * @author     keraM marek@keram.name http//keram.name
 * @license    MIT
 */

/**
 * The REFINERYCMS global namespace object.
 * 
 * @title      REFINERYCMS Global object
 * @class      REFINERYCMS
 * @module     refinerycms
 * @required   jquery-1.5.2
 * @namespace  
 * @static
 */
var REFINERYCMS = REFINERYCMS || {};

REFINERYCMS = {

	/**
	 * I love YUI namespaces
	 *
	 * @see YUI.namespace
	 * @method namespace
	 * @param  {string*} arguments 1-n namespaces to create.
	 * @global window
	 * @return {object}  A reference to the last namespace object created.
	 */
	namespace: function () {
		var a = arguments, o = null, i, j, d;
		for (i = 0; i < a.length; i = i + 1) {
			d = a[i].split(".");

			o = window;
			for (j = 0; j < d.length; j = j + 1) {
				o[d[j]] = o[d[j]] || {};
				o = o[d[j]];
			}
		}

		return o;
	},

	/**
	 * Extend Child object with Parent prototype
	 * 
	 * @param {object} Child
	 * @param {object} Parent
	 */
	extendObject: function (Child, Parent) {
		var R = Child.prototype,
			key = null;
		
		function Q() {}
		
		Q.prototype = Parent.prototype;
		
		Child.prototype = new Q();
		
		// adding back overriden methods and properties
		for (key in R) {
			if (R.hasOwnProperty(key)) {
				Child.prototype[key] = R[key];
			}
		}

		Child.prototype.constructor = Child;
	},
	
	init_tooltips: function (args) {
		$($(args != null ? args : 'a[title], span[title], #image_grid img[title], *[tooltip]')).not('.no-tooltip').each(function(index, element)
		{
			var elm = $(element);
			// create tooltip on hover and destroy it on hoveroff.
			elm.hover(function(e) {
				var active_elm = $(this);
				if (e.type == 'mouseenter' || e.type == 'mouseover') {
					active_elm.oneTime(350, 'tooltip', $.proxy(function() {
						$('.tooltip').remove();
						var tooltip = $("<div class='tooltip'><div><span></span></div></div>").appendTo('#tooltip_container');
						tooltip.find("span").html(active_elm.attr('tooltip'));

						tooltip_nib_image = $.browser.msie ? 'tooltip-nib.gif' : 'tooltip-nib.png';
						nib = $("<img src='/images/refinery/"+tooltip_nib_image+"' class='tooltip-nib'/>").appendTo('#tooltip_container');

						tooltip.css({
							'opacity': 0,
							'maxWidth': '300px'
						});

						required_left_offset = active_elm.offset().left - (tooltip.outerWidth() / 2) + (active_elm.outerWidth() / 2);
						tooltip.css('left', (required_left_offset > 0 ? required_left_offset : 0));

						var tooltip_offset = tooltip.offset();
						var tooltip_outer_width = tooltip.outerWidth();
						if (tooltip_offset && (tooltip_offset.left + tooltip_outer_width) > (window_width = $(window).width())) {
							tooltip.css('left', window_width - tooltip_outer_width);
						}

						tooltip.css({
							'top': active_elm.offset().top - tooltip.outerHeight() - 2
						});

						nib.css({
							'opacity': 0
						});

						if (tooltip_offset = tooltip.offset()) {
							nib.css({
								'left': active_elm.offset().left + (active_elm.outerWidth() / 2) - 5,
								'top': tooltip_offset.top + tooltip.height()
							});
						}

						try {
							tooltip.animate({
								top: tooltip_offset.top - 10,
								opacity: 1
							}, 200, 'swing');
							nib.animate({
								top: nib.offset().top - 10,
								opacity: 1
							}, 200);
						} catch(e) {
							tooltip.show();
							nib.show();
						}
					}, active_elm));
				} else if (e.type == 'mouseleave' || e.type == 'mouseout') {
					active_elm.stopTime('tooltip');
					if ((tt_offset = (tooltip = $('.tooltip')).css('z-index', '-1').offset()) == null) {
						tt_offset = {
							'top':0,
							'left':0
						};
					}
					tooltip.animate({
						top: tt_offset.top - 20,
						opacity: 0
					}, 125, 'swing', function(){
						active_elm.remove();
					});
					if ((nib_offset = (nib = $('.tooltip-nib')).offset()) == null) {
						nib_offset = {
							'top':0,
							'left':0
						};
					}
					nib.animate({
						top: nib_offset.top - 20,
						opacity: 0
					}, 125, 'swing', function(){
						active_elm.remove();
					});
				}
			}).click(function(e) {
				active_elm.stopTime('tooltip');
			});

			if (elm.attr('tooltip') == null) {
				elm.attr('tooltip', elm.attr('title'));
			}
			// wipe clean the title on any children too.
			$elements = elm.add(elm.children('img')).removeAttr('title');
			// if we're unlucky and in Internet Explorer then we have to say goodbye to 'alt', too.
			if ($.browser.msie){
				$elements.removeAttr('alt');
			}
		});
	}
};
