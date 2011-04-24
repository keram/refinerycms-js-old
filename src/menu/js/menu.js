/**
 * Menu handling
 *
 * @author     keraM marek@keram.name http//keram.name
 * @copyright  Copyright (C) 2011
 * @license    MIT
 * @version   0.1
 */
REFINERYCMS.menu = {
	menu: null,

	reorder: function (e, enable) {
		e.preventDefault();
		$('#menu_reorder, #menu_reorder_done').toggle();
		$('#site_bar, #content').fadeTo(500, enable ? 0.35 : 1);

		if(enable) {
			this.menu.find('.tab a').click(function(ev){
				ev.preventDefault();
			});
		} else {
			this.menu.find('.tab a').unbind('click');
		}

		this.menu.sortable(enable ? 'enable' : 'disable');
	},

	init: function () {
		var that = this;
		this.menu = $('#menu');
		if(this.menu.length === 0){
			return;
		}

		this.menu.sortable({
			axis: 'x',
			cursor: 'crosshair',
			connectWith: '.nested',
			update: function(){
				$.post('/refinery/update_menu_positions', this.menu.sortable('serialize', {
					key: 'menu[]',
					expression: /plugin_([\w]*)$/
				}));
			}
		}).tabs();

		this.menu.jcarousel({
			vertical: false,
			scroll: 1,
			buttonNextHTML: "<img src='/images/refinery/carousel-right.png' alt='down' height='15' width='10' />",
			buttonPrevHTML: "<img src='/images/refinery/carousel-left.png' alt='up' height='15' width='10' />",
			listTag: this.menu.get(0).tagName.toLowerCase(),
			itemTag: this.menu.children(':first').get(0).tagName.toLowerCase()
		});

		//Initial status disabled
		this.menu.sortable('disable');

		this.menu.find('#menu_reorder').click(function(e){
			that.reorder(e, true);
		});

		this.menu.find('#menu_reorder_done').click(function(e){
			that.reorder(e, false);
		});
	}
};
