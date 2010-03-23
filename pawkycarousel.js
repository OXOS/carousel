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

this.initialize = function(element, input_options) {

		this.items_container = $(element);
		this.current_left = 0;

		this.options = {
			transition_duration: 1000,
			transition_easing: "swing",
			shift: 100,
			width: this.items_container.width()
		};
		jQuery.extend(this.options, input_options);
}

this.skip = function(vector) {
	this.current_left -= vector * this.options.shift;

	if (this.current_left + (this.options.width) <= 0)
	this.current_left = 0;

	//reset to last page
	if (this.current_left > 0){
		var pages_count = Math.ceil( this.options.width / this.options.shift );
		this.current_left = - (pages_count-1) * this.options.shift;
	}

	// animation
	this.carousel_transition(this.current_left);
};

this.prev = function() {
		this.skip(-1);
}

this.next = function() {
		this.skip(1);
}


this.carousel_transition = function(position) {
	this.items_container.stop().animate({
		"left": position
	},
	{
		"duration": this.options.transition_duration,
		"easing": this.options.transition_easing
	});
};

this.initialize(element, input_options);


}





/*
 * Auto Carousel.
 * Creates wrappers and controls and resizes items
 */

jQuery.pawkyAutoCarousel = function(element, input_options) {
	var options = {
		number_slides_visible: "1",
		scroll: 1
	};
	jQuery.extend(options, input_options);

	proto = new jQuery.pawkyCarousel(element, options);

	acar = function() {

		this.add_wrappers_and_controls = function() {
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
		};

		this.setup_items_and_wrappers = function(){
			this.item_width = Math.floor(this.items_container.parent().width() / this.options.number_slides_visible);
			this.options.width = Math.floor(this.items_count * this.item_width);
											 
			this.items_container.css('width', this.options.width);
			this.items_container.children().css("width", this.item_width+"px");
			this.items_container.children().addClass("slide");

			this.options.shift =  this.options.scroll * this.item_width;
		}

		this.auto_adjust_carousel = function() {
			this.add_wrappers_and_controls();
			this.setup_items_and_wrappers();
		} 

		this.auto_adjust_carousel();

	}

	acar.prototype = proto;
	return new acar;
}
