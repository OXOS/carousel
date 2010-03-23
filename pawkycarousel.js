jQuery.fn.pawkyCarousel = function(options) {
	return this.each(function() {
		new jQuery.pawkyCarousel(this, options);
	});
};

jQuery.fn.pawkyAutoCarousel = function(options) {
	return this.each(function() {
		new jQuery.pawkyAutoCarousel(this, options);
	});
};


/*
 * Basic Carousel.
 * Makes no assumptions about its content. Just moves a container inside a wrapper
 */

jQuery.pawkyCarousel = function(element, input_options) {
	this.initialize(element, input_options);
}

jQuery.pawkyCarousel.prototype = {

	initialize: function(element, input_options) {
	
			this.items_container = $(element);
			this.position = 0;
	
			this.options = {
				transition_duration: 1000,
				transition_easing: "swing",
				shift: 100,
				width: this.items_container.width()
			};
			jQuery.extend(this.options, input_options);
	},
	
	slide: function(vector) {
		this.position += vector * this.options.shift;
		if (this.position >= this.options.width)
			this.position = 0;
	
		//reset to last page
		if (this.position < 0){
			var pages_count = Math.ceil( this.options.width / this.options.shift );
			this.position = (pages_count-1) * this.options.shift;
		}
	
		// animation
		this.carousel_transition(this.position);
	},
	
	carousel_transition: function(position) {
		this.items_container.stop().animate({
			"left": - position
		},
		{
			"duration": this.options.transition_duration,
			"easing": this.options.transition_easing
		});
	},
	
	prev: function() {
		this.slide(-1);
	},
	
	next: function() {
		this.slide(1);
	}
};






/*
 * Auto Carousel.
 * Creates wrappers and controls and resizes items
 */

jQuery.pawkyAutoCarousel = function(element, input_options) {
	this.initialize(element, input_options);
}

jQuery.pawkyAutoCarousel.prototype = jQuery.extend( {}, jQuery.pawkyCarousel.prototype, {

	initialize: function(element, input_options) {
		var default_options = {
			number_slides_visible: "1",
			scroll: 1
		};
		var options = jQuery.extend({}, default_options, input_options);

		//emulate: super(element,options)
		jQuery.pawkyCarousel.prototype.initialize.call(this, element, options );

		this.add_wrappers_and_controls();
		this.setup_items_and_wrappers();
	},

	add_wrappers_and_controls: function() {
		this.items_container.addClass("row_of_slides");
		
		this.items_container.wrap('<div class="slide_holder_inner" />');
		
		this.items_container.parent(".slide_holder_inner").wrap('<div class="slide_holder" />');
		this.carousel_wrapper = this.items_container.parent(".slide_holder_inner").parent();
		
		// add prev/next buttons
		this.carousel_wrapper.append('<div class="prev_button">&lt;</div>');
		this.prev_button = this.carousel_wrapper.children(".prev_button");
		
		this.carousel_wrapper.append('<div class="next_button">&gt;</div>');
		this.next_button = this.carousel_wrapper.children(".next_button");
		
		this.items_count = this.items_container.children().length;				
		
		// add events for buttons
		var _this = this;
		this.prev_button.click( function(){_this.prev();} );
		this.next_button.click( function(){_this.next();} );
	},

	setup_items_and_wrappers: function(){
		this.item_width = Math.floor(this.items_container.parent().width() / this.options.number_slides_visible);
		this.options.width = Math.floor(this.items_count * this.item_width);
										 
		this.items_container.css('width', this.options.width);
		this.items_container.children().css("width", this.item_width+"px");
		this.items_container.children().addClass("slide");

		this.options.shift =  this.options.scroll * this.item_width;
	}

});
