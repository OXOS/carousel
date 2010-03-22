(function($) { //create closure
    $.fn.gcarousel = function(options) {
        return this.each(function() {
            new $gc(this, options);
        });
    };

    $.gcarousel = function(element, input_options) {

        var carousel = this;

        carousel.items_container = $(element);
        carousel.current_left = 0;
        carousel.items_count = 0;
        carousel.items_container_width = null;
        carousel.item_width = null;

        carousel.options = {
            number_slides_visible: "1",
            transition_duration: 1000,
            transition_easing: "swing",
            scroll: 1,
            auto_adjust: false,
            shift: 100
        };
        $.extend(this.options, input_options);

        initialize = function(){
            carousel.items_container_width = carousel.items_container.width();

            if (carousel.options.auto_adjust)
                auto_adjust_carousel();
        };

        carousel.skip = function(direction) {
            // calculate current_left
            if (direction == "next")
                carousel.current_left -= carousel.options.shift;
            if (direction == "prev")
                carousel.current_left += carousel.options.shift;

            if (carousel.current_left + (carousel.items_container_width) <= 0)
		    carousel.current_left = 0;

	    //reset to last page
            if (carousel.current_left > 0){
                var pages_count = Math.ceil( carousel.items_container_width / carousel.options.shift );
		carousel.current_left = - (pages_count-1) * carousel.options.shift;
            }

	    console.log("current_left", carousel.current_left );
            
            // animation
            carousel.carousel_transition(carousel.current_left);
        };


        carousel.carousel_transition = function(position) {
            carousel.items_container.stop().animate({
                "left": position
            },
            {
                "duration": carousel.options.transition_duration,
                "easing": carousel.options.transition_easing
            });
        };

        // auto adjust carousel constructor ------------------------------------
        auto_adjust_carousel = function() {

            add_wrappers = function(){
                // add class to scrolled div
                carousel.items_container.addClass("row_of_slides");

                // add wrapper 1
                carousel.items_container.wrap('<div class="slide_holder_inner" />');

                // add wrapper 2
                carousel.items_container.parent(".slide_holder_inner").wrap('<div class="slide_holder" />');
                carousel.carousel_wrapper = carousel.items_container.parent(".slide_holder_inner").parent();

                // add prev/next buttons
                carousel.carousel_wrapper.append('<div class="prev_button">&lt;</div>');
                carousel.prev_button = carousel.carousel_wrapper.children(".prev_button");

                carousel.carousel_wrapper.append('<div class="next_button">&gt;</div>');
                carousel.next_button = carousel.carousel_wrapper.children(".next_button");

                carousel.items_count = carousel.items_container.children().length;                
            };

            setup_items_and_wrappers = function(){
                carousel.items_container.css('width', carousel.items_container_width);
                carousel.items_container.children().css("width", carousel.item_width+"px");
                carousel.items_container.children().addClass("slide");
            };

            add_wrappers();

            carousel.item_width = Math.floor(carousel.items_container.parent().width() / carousel.options.number_slides_visible);
            carousel.items_container_width = Math.floor(carousel.items_count * carousel.item_width);
                                             
            setup_items_and_wrappers();

            carousel.options.shift =  carousel.options.scroll * carousel.item_width;

            // add events for buttons
            carousel.next_button.click(function() {
                carousel.skip('next');
            });

            carousel.prev_button.click(function() {
                carousel.skip('prev');
            });

        } 

        // constructor
        initialize();

    } // function agile_carousel

    var $gc = $.gcarousel;

})(jQuery);
