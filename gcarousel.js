(function($) { //create closure
    $.fn.gcarousel = function(options) {
        return this.each(function() {
            new $gc(this, options);
        });
    };

    $.gcarousel = function(element, input_options) {

        var this_ = this;

        this.items_container = $(element);
        this.carousel_wrapper = null;
        this.next_button = null;
        this.prev_button = null;                
        this.current_left = 0;
        this.items_count = 0;
        this.items_container_width = null;
        this.item_width = null;

        this.options = {
            number_slides_visible: "1",
            transition_duration: 1000,
            transition_easing: "swing",
            scroll: 1,
            auto_adjust: false,
            shift: 100
        };
        $.extend(this.options, input_options);

        initialize = function(){
            this_.items_container.css("position","absolute");
            this_.items_count = this_.items_container.children().length;

            this_.items_container_width = this_.items_container.width();
            this_.item_width = this_.options.shift;

            if (this_.options.auto_adjust)
                auto_adjust_carousel();
        };

        this.skip = function(direction) {
            // calculate current_left
            if (direction == "next")
                this_.current_left -= this_.options.shift;
            if (direction == "prev")
                this_.current_left += this_.options.shift;

            if (this_.current_left + (this_.items_container_width) <= 0) this_.current_left = 0;
            if (this_.current_left > 0){
                var pages_count = Math.ceil(this_.items_count / this_.options.scroll);
                var first_visible = (pages_count-1) * this_.options.scroll;
                var rest = this_.items_count - first_visible
                this_.current_left = -(this_.items_container_width - rest * this_.item_width);
            }
            
            // animation
            this_.carousel_transition(this_.current_left);
        };


        this.carousel_transition = function(position) {
            this_.items_container.stop().animate({
                "left": position
            },
            {
                "duration": this_.options.transition_duration,
                "easing": this_.options.transition_easing
            });
        };

        // auto adjust carousel constructor ------------------------------------
        auto_adjust_carousel = function() {

            add_wrappers = function(){
                // add class to scrolled div
                this_.items_container.addClass("row_of_slides");

                // add wrapper 1
                this_.items_container.wrap('<div class="slide_holder_inner" />');

                // add wrapper 2
                this_.items_container.parent(".slide_holder_inner").wrap('<div class="slide_holder" />');
                this_.carousel_wrapper = this_.items_container.parent(".slide_holder_inner").parent();

                // add prev/next buttons
                this_.carousel_wrapper.append('<div class="prev_button">&lt;</div>');
                this_.prev_button = this_.carousel_wrapper.children(".prev_button");

                this_.carousel_wrapper.append('<div class="next_button">&gt;</div>');
                this_.next_button = this_.carousel_wrapper.children(".next_button");

                this_.items_count = this_.items_container.children().length;                
            };

            setup_items_and_wrappers = function(){
                this_.items_container.css('width', this_.items_container_width);
                this_.items_container.children().css("width", this_.item_width+"px");
                this_.items_container.children().addClass("slide");
            };

            add_wrappers();

            this_.item_width = Math.floor(this_.items_container.parent().width() / this_.options.number_slides_visible);
            this_.items_container_width = Math.floor(this_.items_count * this_.item_width);
                                             
            setup_items_and_wrappers();

            this_.options.shift =  this_.options.scroll * this_.item_width;

            // add events for buttons
            this_.next_button.click(function() {
                this_.skip('next');
            });

            this_.prev_button.click(function() {
                this_.skip('prev');
            });

        } 

        // constructor
        initialize();

    } // function agile_carousel

    var $gc = $.gcarousel;

})(jQuery);
