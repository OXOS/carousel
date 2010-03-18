(function($) { //create closure
    $.fn.gcarousel = function(options) {
        return this.each(function() {
            new $gc(this, options);
        });
    };

    $.gcarousel = function(element, options) {

        var this_ = this;

        // carousel elements
        this.carousel_wrapper = null;
        this.items_container = $(element);
        this.next_button = null;
        this.prev_button = null;                

        // moving parameters
        this.current_left = 0;

        // other attributes
        this.items_count = null;

        this.defaults = {
            number_slides_visible: "1",
            transition_duration: 1000,
            transition_easing: "swing",
            scroll: 1,
            auto_adjust: false,
            shift: 100
        };
        
        $.extend(this.defaults, options);

        // methods -----------------------------------------------------
        this.initialize = function(){
            
            if (this_.defaults.auto_adjust)
                this_.auto_adjust_carousel();
            else
                this_.basic_carousel();

            this_.setup_carousel();

            // add events for buttons
            this_.next_button.click(function() {
                this_.skip('next');
            }
            ); 
            this_.prev_button.click(function() {
                this_.skip('prev');
            }
            ); 
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


        // basic carousel constructor ------------------------------------------
        this.basic_carousel = function() {

            this_.setup_carousel = function(){
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

                // set width for items wrapper
                var items_container_width = 0;
                this_.items_container.children().each(function(i,el){
                    items_container_width += $(el).width();
                });
                this_.items_container.css("width", items_container_width+"px");
            };

            this_.skip = function(direction) {

                var wrapper_width = this_.items_container.width();

                // calculate current_left
                if (direction == "next")
                    this_.current_left -= this_.defaults.shift;
                else
                    this_.current_left += this_.defaults.shift;

                if (this_.current_left + (wrapper_width-this_.defaults.shift) < 0) this_.current_left = 0;
                if (this_.current_left > 0) this_.current_left = -(wrapper_width-this_.defaults.shift);

                // animation
                this_.carousel_transition( this_.current_left );

            }; 

        };

        // auto adjust carousel constructor ------------------------------------
        this.auto_adjust_carousel = function() {

            this_.setup_carousel = function(){
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

                // set width for items wrapper
                var items_container_width = 0;
                this_.items_container.children().each(function(i,el){
                    items_container_width += $(el).width();
                });
                this_.items_container.css("width", items_container_width+"px");

                setup_items();
            };
                                                
            this_.skip = function(direction) {

                var wrapper_width = this_.items_container.width();
                var item_width = Math.floor(this_.items_container.parent().width() / this_.defaults.number_slides_visible);
                var offset = this_.defaults.scroll * item_width;

                // calculate current_left
                if (direction == "next")
                    this_.current_left -= offset;
                else
                    this_.current_left += offset;
                

                if (this_.current_left + (wrapper_width-this_.defaults.shift) < 0) this_.current_left = 0;
                if (this_.current_left > 0) this_.current_left = -(wrapper_width-offset);

                // animation
                this_.carousel_transition( this_.current_left );

            };

            setup_items = function(){
                slide_height = this_.items_container.parent().height()-2;
                half_slide_height_raw = slide_height / 2;
                half_slide_height = parseFloat(half_slide_height_raw);
                slide_holder_width = this_.carousel_wrapper.width();
                slide_holder_height = this_.carousel_wrapper.height();
                slide_holder_inner_width = this_.items_container.parent().width();
                slide_holder_inner_height = this_.items_container.parent().height();
                slide_holder_inner_width_px = slide_holder_inner_width + 'px';
                slide_holder_inner_height_px = slide_holder_inner_height + 'px';

                width_per_slide = slide_holder_inner_width / this_.defaults.number_slides_visible;
                width_per_slide = Math.floor(width_per_slide);
                all_slides_width_raw = this_.items_count * width_per_slide;
                all_slides_width_raw = Math.floor(all_slides_width_raw);
                all_slides_width = all_slides_width_raw + 'px';

                num_slides_vis = parseFloat(this_.defaults.number_slides_visible);

                // set styles for items and wrappers
                this_.items_container.children().css("width", width_per_slide+"px");
                this_.items_container.children().addClass("slide");

                for (i = 0; i < this_.items_count; i++) {
                    var the_slide = this_.items_container.children()[i];
                    var x_pos = ((width_per_slide) * i)+2;
                    $(the_slide).css('left', x_pos);
                }
                this_.items_container.css('width', all_slides_width);
            };

        } 


        // constructor
        this.initialize();

    } // function agile_carousel

    var $gc = $.gcarousel;

})(jQuery);