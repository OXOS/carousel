(function($) { //create closure
    $.fn.gcarousel = function(options) {
        return this.each(function() {
            new $gc(this, options);
        });
    };

    $.gcarousel = function(element, options) {

        var this_ = this;

        this.items_container = $(element);
        this.carousel_wrapper = null;
        this.next_button = null;
        this.prev_button = null;                
        this.current_left = 0;
        this.items_count = 0;

        this.defaults = {
            number_slides_visible: "1",
            transition_duration: 1000,
            transition_easing: "swing",
            scroll: 1,
            auto_adjust: false,
            shift: 100
        };
        
        $.extend(this.defaults, options);

        initialize = function(){
            this_.items_container.css("position","absolute");
            this_.items_count = this_.items_container.children().length;

            if (this_.defaults.auto_adjust)   
                auto_adjust_carousel();
        };

        this.skip = function(direction) {
            var wrapper_width = this_.items_container.width();
            var item_width = (this_.defaults.auto_adjust) ? (Math.floor(this_.items_container.parent().width() / this_.defaults.number_slides_visible)) : this_.defaults.shift;

            // calculate current_left
            if (direction == "next")
                this_.current_left -= this_.defaults.shift;
            if (direction == "prev")
                this_.current_left += this_.defaults.shift;

            if (this_.current_left + (wrapper_width) <= 0) this_.current_left = 0;
            if (this_.current_left > 0){
                var pages_count = Math.ceil(this_.items_count / this_.defaults.scroll);
                var first_visible = (pages_count-1) * this_.defaults.scroll;
                var rest = this_.items_count - first_visible
                this_.current_left = -(wrapper_width - rest * item_width);
            }

            // animation
            this_.carousel_transition(this_.current_left);
        };


        this.carousel_transition = function(position) {
            this_.items_container.stop().animate({
                "left": position
            },
            {
                "duration": this_.defaults.transition_duration,
                "easing": this_.defaults.transition_easing
            });
        };

        // auto adjust carousel constructor ------------------------------------
        auto_adjust_carousel = function() {

            setup_wrappers = function(){
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

            setup_items = function(){
                this_.items_container.css('width', all_slides_width);
                this_.items_container.children().css("width", item_width+"px");
                this_.items_container.children().addClass("slide");
            };

            setup_wrappers();
            
            // setup items
            var wrapper_width = this_.items_container.width();
            var item_width = Math.floor(this_.items_container.parent().width() / this_.defaults.number_slides_visible);
            var all_slides_width = Math.floor(this_.items_count * item_width);
            
            setup_items();

            this_.defaults.shift =  this_.defaults.scroll * item_width;

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