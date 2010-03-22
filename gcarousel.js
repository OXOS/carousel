    jQuery.fn.gcarousel = function(options) {
        return this.each(function() {
            new jQuery.gcarousel(this, options);
        });
    };

    jQuery.gcarousel = function(element, input_options) {

	this.initialize = function(element, input_options) {
        	this.items_container = $(element);

        	this.options = {
        	    number_slides_visible: "1",
        	    transition_duration: 1000,
        	    transition_easing: "swing",
        	    scroll: 1,
        	    auto_adjust: false,
        	    shift: 100
        	};
        	this.options.width = this.items_container.width();

        	jQuery.extend(this.options, input_options);

	}

        this.skip = function(direction) {
            if (!this.current_left) this.current_left = 0;

            // calculate current_left
            if (direction == "next")
                this.current_left -= this.options.shift;
            if (direction == "prev")
                this.current_left += this.options.shift;

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


    } // function agile_carousel

    jQuery.auto_carousel = function(element, input_options) {
    	proto = new jQuery.gcarousel(element, input_options);
	//return proto;

	acar = function() {
        	// auto adjust carousel constructor ------------------------------------

        	this.add_wrappers = function() {
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
        	};

        	this.setup_items_and_wrappers = function(){
        	    this.item_width = Math.floor(this.items_container.parent().width() / this.options.number_slides_visible);
        	    this.options.width = Math.floor(this.items_count * this.item_width);
        	                                     
        	    this.items_container.css('width', this.options.width);
        	    this.items_container.children().css("width", this.item_width+"px");
        	    this.items_container.children().addClass("slide"); //};

        	    this.options.shift =  this.options.scroll * this.item_width;
		}

        	this.auto_adjust_carousel = function() {

		    this.add_wrappers();

        	    this.setup_items_and_wrappers();

		    var carousel = this;
        	    // add events for buttons
        	    this.next_button.click(function() {
        	        carousel.skip('next');
        	    });

        	    this.prev_button.click(function() {
        	        carousel.skip('prev');
        	    });

        	} 

	}

    	acar.prototype = proto;
	return new acar;
    }
