(function($) { //create closure
    $.fn.agile_carousel = function(options) {
        return this.each(function() {
            new $ac(this, options);
        });
    };

    $.agile_carousel = function(element, options) {

        var this_ = this;
        this.carousel_wrapper = null;
        this.items_container = $(element);
        this.next_button = null;
        this.prev_button = null;
        this.curr_slide_id_number = 1;
        this.items_count = null;
        this.x_position_array = [];
        this.current_left = 0;

        this.defaults = {
            number_slides_visible: "1",
            transition_duration: 1000,
            transition_easing: "swing",
            scroll: 1,
            auto_adjust: false,
            shift: 100
        };
        
        var opts = $.extend(this.defaults, options);



        this.setup_carousel = function(){
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


        this.basic_carousel = function() {

            this_.setup_carousel();

            // set width for items wrapper
            var items_container_width = 0;
            this_.items_container.children().each(function(i,el){                
                items_container_width += $(el).width();
            });

            this_.items_container.css("width", items_container_width+"px")

            this_.carousel_transition = function(position) {
                this_.items_container.stop().animate({
                    "left": position
                },
                {
                    "duration": this_.defaults.transition_duration,
                    "easing": this_.defaults.transition_easing
                });
            };

            this.skip = function(direction) {

                var wrapper_width = this_.items_container.width();

                // calculate current slide id
                if (direction == "next")
                    this_.current_left -= this_.defaults.shift;
                else
                    this_.current_left += this_.defaults.shift;

                if (this_.current_left + (wrapper_width-this_.defaults.shift) < 0) this_.current_left = 0;
                if (this_.current_left > 0) this_.current_left = -(wrapper_width-this_.defaults.shift);

                // animation
                this_.carousel_transition( this_.current_left );

                // disable first and last buttons
                // there should be code


            }; //skip

            // functions for clicking prev & next buttons
            // next button
            this_.next_button.click(function() {
                this_.skip('next');
            }
            ); // click
            this_.prev_button.click(function() {
                this_.skip('prev');
            }
            ); // click

        };


        this.auto_adjust_carousel = function() {

            this.setup_carousel();

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
            } // for            
            this_.items_container.css('width', all_slides_width);
            // end // set styles for items and wrappers


            var create_x_position_array = function(){
                for (i = 0; i < this_.items_count; i++) {
                    test_me_for_float = (i) / this_.defaults.scroll;
                    if (i == 0 || (test_me_for_float == parseInt(test_me_for_float) && test_me_for_float == parseFloat(test_me_for_float))) {
                        the_x_pos = width_per_slide * (i) * -1;//
                    }
                    this_.x_position_array[i] = the_x_pos;

                } // for
            };

            create_x_position_array();
            

            this_.carousel_transition = function(position) {
                this_.items_container.stop().animate({
                    "left": position
                },
                {
                    "duration": this_.defaults.transition_duration,
                    "easing": this_.defaults.transition_easing
                });
            };

            this.skip = function(direction) {

                // calculate current slide id
                if (direction == "next")
                    this_.curr_slide_id_number += this_.defaults.scroll;
                else
                    this_.curr_slide_id_number -= this_.defaults.scroll;

                if (this_.curr_slide_id_number < 1) this_.curr_slide_id_number = this_.items_count;
                if (this_.curr_slide_id_number > this_.items_count) this_.curr_slide_id_number = 1;

                // animation
                this_.carousel_transition( this_.x_position_array[this_.curr_slide_id_number- 1] );

                // disable first and last buttons
                // there should be code


            }; //skip
            
            // functions for clicking prev & next buttons
            // next button
            this_.next_button.click(function() { 
                this_.skip('next');            
            } 
            ); // click
            this_.prev_button.click(function() {
                this_.skip('prev');         
            }
            ); // click

        } // carousel

        if (this.defaults.auto_adjust)
            this_.auto_adjust_carousel();
        else
            this_.basic_carousel();

    } // function agile_carousel

    var $ac = $.agile_carousel;

})(jQuery);