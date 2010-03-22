(function($) { //create closure
    $.fn.gcarousel = function(options) {
        return this.each(function() {
            new $.gcarousel(this, options);
        });
    };

    $.gcarousel = function(element, input_options) {

	this.initialize = function() {
        	this.items_container = $(element);

        	this.options = {
        	    number_slides_visible: "1",
        	    transition_duration: 1000,
        	    transition_easing: "swing",
        	    scroll: 1,
        	    auto_adjust: false,
        	    shift: 100
        	};
        	$.extend(this.options, input_options);

        	this.items_container_width = this.items_container.width();
	}

        this.skip = function(direction) {
            if (!this.current_left) this.current_left = 0;

            // calculate current_left
            if (direction == "next")
                this.current_left -= this.options.shift;
            if (direction == "prev")
                this.current_left += this.options.shift;

            if (this.current_left + (this.items_container_width) <= 0)
		    this.current_left = 0;

	    //reset to last page
            if (this.current_left > 0){
                var pages_count = Math.ceil( this.items_container_width / this.options.shift );
		this.current_left = - (pages_count-1) * this.options.shift;
            }

            // animation
            this.carousel_transition(this.current_left);
        };


        this.carousel_transition = function(position) {
            this.items_container.stop().animate({
                "left": position
            },
            {
                "duration": this.options.transition_duration,
                "easing": this.options.transition_easing
            });
        };

        // auto adjust carousel constructor ------------------------------------
        this.auto_adjust_carousel = function() {

            //add_wrappers = function(){
                // add class to scrolled div
                this.items_container.addClass("row_of_slides");

                // add wrapper 1
                this.items_container.wrap('<div class="slide_holder_inner" />');

                // add wrapper 2
                this.items_container.parent(".slide_holder_inner").wrap('<div class="slide_holder" />');
                this.carousel_wrapper = this.items_container.parent(".slide_holder_inner").parent();

                // add prev/next buttons
                this.carousel_wrapper.append('<div class="prev_button">&lt;</div>');
                this.prev_button = this.carousel_wrapper.children(".prev_button");

                this.carousel_wrapper.append('<div class="next_button">&gt;</div>');
                this.next_button = this.carousel_wrapper.children(".next_button");

                this.items_count = this.items_container.children().length;                
            //};

            this.item_width = Math.floor(this.items_container.parent().width() / this.options.number_slides_visible);
            this.items_container_width = Math.floor(this.items_count * this.item_width);
                                             
            //setup_items_and_wrappers = function(){
                this.items_container.css('width', this.items_container_width);
                this.items_container.children().css("width", this.item_width+"px");
                this.items_container.children().addClass("slide");
            //};

            this.options.shift =  this.options.scroll * this.item_width;

	    var carousel = this;
            // add events for buttons
            this.next_button.click(function() {
                carousel.skip('next');
            });

            this.prev_button.click(function() {
                carousel.skip('prev');
            });

        } 

	this.initialize();


    } // function agile_carousel

    //$.auto_carousel = function(element, input_options) {
    //    proto = $.gcarousel(element, input_options);
    //    //$.extend( this, par );
    //    prototype
    //}

})(jQuery);
