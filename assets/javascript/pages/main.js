var cache = {
	lastElementClicked: null,
	$navbarMain: $('#navbar-main'),
	$blogFilter: $('#blog-filter'),
	$blogHeader: $('#blog-header-wrapper'),
	$sidebar: $("#sidebar"),
	$blogPostItem : $("#all-posts-container .grid-item a"),
	homeInitialized: false,
	blogInitialized: false,
};

var currentNamespace = null;



/**
 * Homepage Latest log Posts Carousel
 */
var initCarousel = function () {

	var $latestBlogPostsCarousel = $(".latest-blog-posts-carousel");

	// only init if slick is not already initialized
	if( !$latestBlogPostsCarousel.hasClass('slick-initialized') ) {
		$latestBlogPostsCarousel.slick({
			slidesToShow: 3,
			slidesToScroll: 1,
			autoplay: false,
			autoplaySpeed: 2000,
			centerMode: false,
			centerPadding: '0',
			infinite: true,
			responsive: [
				{
					breakpoint: 1024,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 3,
					}
				},
				{
					breakpoint: 992,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 2
						}
				},
				{
					breakpoint: 562,
						settings: {
							slidesToShow: 1,
							slidesToScroll: 1
						}
				}
			]
		});
	}
};


/**
 *
 *
 */
var changeNavbar = function (dataset) {

	var slideshow_height = 809 ;
	var scroll_pos = $(window).scrollTop();

	if (currentNamespace === 'home') {

		if (scroll_pos >= slideshow_height) {
			//$('.navbar-brand').addClass("brand-hidden" );
			$('#navbar-main').addClass("navbar-slim");
			$('#slideshowHomeHTML').trigger('jumplink_slideshow_stop');
			// console.log('stop slideshow triggert');

		} else {
			$('#navbar-main').removeClass("navbar-slim");
			//$('.navbar-brand').removeClass("brand-hidden");
			$('#slideshowHomeHTML').trigger('jumplink_resume_slideshow');
			// console.log('jumplink_resume_slideshow  triggert');
		}

	} else {
		//$('.navbar-brand').addClass("brand-hidden" );
		$('#navbar-main').addClass("navbar-slim");
	}

};


/**
 * Set each card to the height of the heightest card to get all cards with the same height
 */
var sameHeightCards = function (selector) {
	var t = 0;
	var t_elem;
	$cards = $(selector);
	// get heightest height
	$cards.each(function () {
		$this = $(this);
		// reset height
		$this.css('min-height', 'auto');
		if ( $this.outerHeight() > t ) {
			t_elem=this;
			t=$this.outerHeight();
		}
	});

	// set all smaller cards to the height of the heightest card
	$cards.each(function () {
		$this = $(this);
		if($this.outerHeight() != t) {
			$this.css('min-height',t);
		}
	});
};


/**
 *
 */
var initSidebar = function (dataset) {

	transformicons.add('.tcon');

 	/**
	 * @see http://dcdeiv.github.io/simpler-sidebar/
	 * https://github.com/simple-sidebar/simpler-sidebar/issues/25#issuecomment-236579696
	 */
	var $sidebar = $( "#sidebar" );
	var mask = true;
	/* only initialize sidebar once */
	if ( ! $sidebar.hasClass('initialized') ) {

		$sidebar
		.show() // already tried to remove
		.simplerSidebar( {
			align: "left", // the new sidear.align
			selectors: {
				trigger: ".toggle-sidebar", // the new opener
				quitter: ".close-sidebar" // the new closingLinks
			},
			animation: {
				easing: "easeOutQuint"
			},
			mask: {
				display: mask,
				css: {
					backgroundColor: "black",
					opacity: 0,
				}
			},
			sidebar: {
				width: 250
			},
			events: {
				callbacks: {
					animation: {
						freezePage: false
					}
				},
				on: {
					animation: {
						open: function() {
							// console.log("open");
							transformicons.transform($('.toggle-sidebar button.tcon')[ 0 ]);
						},
						close: function() {
							// console.log("close");
							transformicons.revert($('.toggle-sidebar button.tcon')[ 0 ]);
						},
					}
				}
			}
		});
		$sidebar.addClass('initialized');
	}
};


/**
 *
 */
var initHome = function (container) {
	var dataset = container.dataset;

	slideshowHomeJavaScriptInit('#slideshowHomeHTML');
	initCarousel();

	if(! cache.homeInitialized ) { // just add ONE event listener
		$(window).on('scrollstop', function () {
			// console.log('-----onscrollstop');
			changeNavbar(dataset);
		});
		cache.homeInitialized = true;
	}
	
	$('.scroll-down').click(function() {      
        $('html, body').animate({
            scrollTop: $("#layout-content").offset().top - 40
        }, 2000);
    });

};

/**
 * Initialize Fullscreen Slideshow Modal
 */
var initializeAnimatedModal = function( fullscreenButtonID, name, fullscreenSlideshowID ) {
	$(fullscreenButtonID).animatedModal({
		color: "#fff",
		overflow:"hidden",
		modalTarget: name,

		beforeOpen: function () { // not working properly in safari....
			$(fullscreenSlideshowID).slick('setPosition');
		},
		afterOpen: function () { // ... safari fix.
			$(fullscreenSlideshowID).slick('setPosition');
		},
	});
}

/**
 * initSlickFullscreenNav
 */
var initSlickFullscreenNav = function( section ) {
 	var $captionWrapper = $(".caption-wrapper"); // we need the new on each page
	slideshowJavaScriptInit( section + ' #slideshowHTML');
	subSlideshowJavaScriptInit( section + ' #subSlideshowHTML');
	fullscreenSlideshowJavaScriptInit(section + ' #fullscreenSlideshowHTML');

	function showCaption() {
		$captionWrapper.addClass('visible');
		$captionWrapper.find('button').addClass('visible');
	}

	function hideCaption() {
		$captionWrapper.removeClass('visible');
		$captionWrapper.find('button').removeClass('visible');
	}
	
	$( section + " .slick-next").on('click',function(){
		$('#fullscreenSlideshowHTML').slick('slickNext');
	});

	$(section + "  .slick-prev").on('click',function(){
		$('#fullscreenSlideshowHTML').slick('slickPrev');
	});	

	$(".caption-wrapper").on('mouseenter',function() {
		showCaption();
	});
	
	$(".caption-wrapper").on('mouseleave',function() {
		hideCaption();
	});
}

/**
 * 
 */
var gotoNextFullscreenSlide = function( event, slick, currentSlide, nextSlide ) {
	// console.info('gotoNextFullscreenSlide ', nextSlide);
	$('#fullscreenSlideshowHTML').slick('slickGoTo',nextSlide);
}
var gotoNextSlide = function( event, slick, currentSlide, nextSlide ) {
	// console.info('gotoNextSlide ',nextSlide);
	$('#slideshowHTML').slick('slickGoTo',nextSlide);
}

/**
 * 
 */
var initSlideshowSync = function () {
	// console.info('init!')
	$(document).on('beforeChange',"#slideshowHTML", gotoNextFullscreenSlide );     
	$(document).on('beforeChange',"#fullscreenSlideshowHTML", gotoNextSlide );     
}
var destroySlideshowSync = function () {
	// console.info('destroy!')
	$(document).off('beforeChange', "#slideshowHTML",gotoNextFullscreenSlide );     
	$(document).off('beforeChange', "#fullscreenSlideshowHTML",gotoNextSlide );   
}

/**
 *
 */
var initForwarding = function (container) {
	// Initialize Slideshow
	initializeAnimatedModal( "#forwardingFullscreenButton", "forwardingAnimatedModal", "#fullscreenSlideshowHTML" );
	initSlickFullscreenNav('#forwarding');
	destroySlideshowSync();
	initSlideshowSync();
};

/**
 *
 */
var initShipping = function (container) {
	// Initialize Slideshow
	initializeAnimatedModal( "#shippingFullscreenButton", "shippingAnimatedModal", "#fullscreenSlideshowHTML" );
	initSlickFullscreenNav('#shipping');
	destroySlideshowSync();
	initSlideshowSync();
};

/**
 *
 */
var initOffshore = function (container) {
	// Initialize Slideshow
	// initSlideshowSync();
	initializeAnimatedModal( "#offshoreFullscreenButton", "offshoreAnimatedModal", "#fullscreenSlideshowHTML" );
	initSlickFullscreenNav('#offshore');
	destroySlideshowSync();
	initSlideshowSync();
};

/**
 *
 */
var initPortagency = function (container) {
	// Initialize Slideshow
	initializeAnimatedModal( "#portAgencyFullscreenButton", "portAgencyAnimatedModal", "#fullscreenSlideshowHTML" );
	initSlickFullscreenNav('#portagency');
	destroySlideshowSync();
	initSlideshowSync();
};

/**
 *
 */
var initLinerservices = function (container) {
	// Initialize Slideshow
	// initSlideshowSync();
	initializeAnimatedModal( "#linerServicesFullscreenButton", "linerServicesAnimatedModal", "#fullscreenLinerServicesSlideshowHTML" );
	initSlickFullscreenNav('#liner-services');

	$('#line-names a').click( function (e) {
		e.preventDefault()
		var index = $(this).data('index');	
		$('.lines-route-images-container img').removeClass('active');
		switch( index ) {
			case 0: 
				console.log('0');
				$('.lines-route-images-container .lines-route-image-1').addClass('active');
			break;

			case 1: 
				console.log('1');
				$('.lines-route-images-container .lines-route-image-2').addClass('active');
			break;

			case 2: 
				console.log('2');
				$('.lines-route-images-container .lines-route-image-3').addClass('active');
			break;  
		}
	});
	destroySlideshowSync();
	initSlideshowSync();
};

/**
 *
 */
var initContact = function (container) {

};

/**
 *
 */
var initAbout = function (container) {

};

/**
 *
 */
var initBlog = function (container) {
		var changeBlogHeaderHeight = function (event) {
			var threshold = 10 ;
			var scroll_pos = $(window).scrollTop();
			if(scroll_pos >= threshold) {
				cache.$blogHeader.addClass('blog-nav-low-height');
				$('#blog-header-wrapper .blog-header-container .nav-link').addClass('blog-nav-small');
			} else {
				cache.$blogHeader.removeClass('blog-nav-low-height');
				$('#blog-header-wrapper .blog-header-container .nav-link').removeClass('blog-nav-small');
			}
		};

		if( ! cache.blogInitialized ) {
			$(window).on('scrollstop', function () {
				changeBlogHeaderHeight();
			});
			cache.blogInitialized = true;
		}
		changeBlogHeaderHeight();

		var initMasonry = function() {
		    var $grid = $('.grid');
			$grid.masonry({
    			itemSelector: '.grid-item',
    			columnWidth: '.grid-sizer',
    			isFitWidth: true,
    			gutter:30
			});
			
            $grid.imagesLoaded().progress( function() {
              $grid.masonry('layout');
            });
		}
		initMasonry();

		var currentUrl = location.href;
		var protocolEndIndex = currentUrl.indexOf('//');
		var currentProtocol = currentUrl.substr(0, protocolEndIndex);
		var currentDomain = currentUrl.substr(protocolEndIndex+2);
		var domainEndIndex = currentDomain.indexOf('/');
		if (domainEndIndex !== -1) {
			currentDomain = currentDomain.substr(0, domainEndIndex);
		}
		var currentBaseUrl = currentProtocol + '//' + currentDomain;
		var storagePath = '/storage';
		var themePath = octoberThemeAbsolutePath.substr(currentBaseUrl.length);
		Array.from(container.querySelectorAll('a')).forEach(function (anchor) {
			var url = anchor.href;
			['pdf','eps','txt','doc','docx','odt','odf','xls','png','jpg','gif','svg','bmp','wav','mp3','mp4','m4a','ogg','zip','rar'].some(function(ending) {
				if(url.endsWith('.'+ending)) {
					anchor.className += ' no-barba';
					return  true;
				}
			});
		});


};

/**
 *
 */
var initAllReports = function (container) {
	initBlog(container);
};

/**
 *
 */
var initCategory = function (container) {
	initBlog(container);
};


/**
 *
 */
var initPost = function (container) {
	initBlog(container);
};

/**
 *
 */
var initJobs = function (container) {

};

/**
 *
 */
var initEnvironment = function (container) {

};

/**
 *
 */
var initHistory = function (container) {

};

/**
 *
 */
var initCopyright = function (container) {

};


/**
 *
 */
var initAgency = function (container) {

};


/**
 *
 */
var initFleet = function (container) {
 	shipsListJavaScriptInit();
};


/**
 *
 */
var initTermsAndConditions = function (container) {

};

/**
 *
 */
var initImprint = function (container) {

};

/**
 *
 */
var initLegalDisclosure = function (container) {
	
};

/**
 *
 */
var initPrivacyPolicy = function (container) {
	
};

/**
 *
 */
var initNewsletter = function (container) {
	var js = container.querySelectorAll("script");
	if (js) {
		js.forEach(function(script) {
			eval(script.innerHTML);
		});
	}
};

/**
 *
 */
var initQHSE = function () {

};

/**
 * Run JavaScript for for special template
 * E.g. templates/product.liquid
 */
var initTemplate = {
	'home': initHome,
	'offshore': initOffshore,
	'portagency': initPortagency,
	'linerservices': initLinerservices,
	'contact': initContact,
	'shipping': initShipping,
	'about': initAbout,
	'category': initCategory,
	'post': initPost,
	'blog': initBlog,
	'allreports': initAllReports,
	'jobs': initJobs,
	'environment':initEnvironment,
	'history':initHistory,
	'copyright': initCopyright,
	'agency': initAgency,
	'fleet': initFleet,
	'termsandconditions': initTermsAndConditions,
	'imprint': initImprint,
	'qhse': initQHSE,
	'privacypolicy': initPrivacyPolicy,
	'impressum–legaldisclosure': initLegalDisclosure,
	'newsletter': initNewsletter,
	'forwarding': initForwarding,
};


/**
 * reset main navigation and blog filter
 */
var resetNav = function () {
   	cache.$navbarMain.find('ul.nav.navbar-nav li').removeClass('active');
	cache.$navbarMain.find('ul.nav.navbar-nav li a').blur();
 	cache.$blogFilter.find('a').removeClass('btn-white-outline');
	cache.$sidebar.find('.list-group a').removeClass('active');
};


/**
 * Set active state of main navigation
 */
var setNav = function (selector, dataset) {
	// keep highlight for all blog-sub pages
	if ( selector == '.allreports' || selector == '.category' || selector == '.post') {
		cache.$navbarMain.find('.main-navigation .nav-item.reports').addClass('active');
		if ( !dataset.blogCategory ) {
		 	dataset.blogCategorySlug = 'allreports';
		}
		cache.$sidebar.find('.list-group .reports .'+dataset.blogCategorySlug).addClass('active');
		console.log('.list-group reports a '+dataset.blogCategorySlug)
	} else{
  		cache.$navbarMain.find('.main-navigation .nav-item'+selector).addClass('active');
	}

	cache.$sidebar.find('.list-group a'+selector).addClass('active');
};


/**
 * Handle main Nav / blog filter active state
 */
var setNavActive = function (dataset, currentStatus) {
	
	var lastClicked = null;

	// split dataset.blogPostCategories string to array of categories
	if( dataset && typeof(dataset.blogPostCategories) === 'string' ) {
	   dataset.blogPostCategories = dataset.blogPostCategories.split(',');

		if( typeof(dataset.blogPostCategories) === 'string' ) {
		   dataset.blogPostCategories = [dataset.blogPostCategories]; // not working?
		}
	}

	if ( lastClicked == 'all'){
		lastClicked ='allreports';
	}

	lastClicked = dataset.blogCategorySlug;

	if ( dataset.namespace == 'allreports') {
		lastClicked ='allreports';
	}

	if ( dataset.namespace == 'post') {

	}

  	resetNav();

  	setNav('.'+dataset.namespace,dataset);

	var setBlogFilterActiveState = function ( lastClicked ) {
		// Schoener waere es hier das vorhandene data-attribute zuy verwenden, nur fehlt mir nich der passende selektor
		// cache.$blogFilter.filter('[data-category="'+lastClicked+'"]').addClass('btn-white-outline'); ???
		cache.$blogFilter.find('a.'+lastClicked).addClass('btn-white-outline');
	}

	switch(dataset.namespace) {
		case 'category': {
			if ( lastClicked != null) {
				setBlogFilterActiveState( lastClicked );
			}
		}
		break;
		case 'allreports': {
			if(lastClicked != null){
				setBlogFilterActiveState( lastClicked );
			}
		}
		break;
		case 'post': {
			var $categories = $(dataset.blogPostCategories.split(','));
			$categories.each( function(index, object) {
				console.log('each',index, object);
				if (object != '') {
					cache.$blogFilter.find('a.'+object).addClass('btn-white-outline');
				}
				console.log('each',index, object);
			});
		}
		break;
		default: {
			//console.log('default');
			// don't work with teh cached var ?
			$("#blog-header-wrapper").css('display','none');
		}
	}
};


/**
 * Init Javascripts insite of barba.js
 */
var initTemplates = function () {

  Barba.Dispatcher.on('linkClicked', function (el) {
	cache.lastElementClicked = el;
  });

  Barba.Dispatcher.on('newPageReady', function (currentStatus, oldStatus, container) {

	// Stop ALL slideshows
	$(document).trigger('jumplink_slideshow_stop');

	// console.log("barba.js new page ready. Dataset: ", container);
	currentNamespace = currentStatus.namespace;
	// TODO is a new load necessary?
	// Hyphenator.run(); // https://github.com/mnater/Hyphenator/blob/wiki/en_HowToUseHyphenator.md#step-by-step-advanced-wo-hyphenator_loaderjs
	changeNavbar(container.dataset);
	initSidebar();

	if(typeof(initTemplate[currentStatus.namespace]) === 'function' ) {
	  initTemplate[currentStatus.namespace](container);
	} else {
	  console.error("Template not defined: "+currentStatus.namespace);
	}

	/**
	 * Show/hide Blog Header (Filter)
	 */
	if( currentStatus.namespace === 'blog' ||
		currentStatus.namespace === 'allreports' ||
		currentStatus.namespace === 'category' ||
		currentStatus.namespace === 'post') {
			// wenn ich das direkt in scss setzte gibt es einen srung und kein fade
			// cache.$blogHeader.addClass('active');
			cache.$blogHeader.css('display','block');
			cache.$blogHeader.animate({opacity:1},250);
	}else{
		//cache.$blogHeader.removeClass('active');
		cache.$blogHeader.animate({
			opacity:0,
			complete: function() {
				cache.$blogHeader.css('display','none');
			}
		},250);
	}
	setNavActive(container.dataset, currentStatus);

  });
};


/**
 * Custom Transition
 */
var FadeTransition = Barba.BaseTransition.extend({
  start: function () {
	/**
	 * This function is automatically called as soon the Transition starts
	 * this.newContainerLoading is a Promise for the loading of the new container
	 * (Barba.js also comes with an handy Promise polyfill!)
	 */

	// As soon the loading is finished and the old page is faded out, let's fade the new page
	Promise
	  .all([this.newContainerLoading, this.fadeOut()])
	  .then(this.fadeIn.bind(this))
	  .then(	$('html,body').animate({ scrollTop: 0 }, 'slow') );
  },

  fadeOut: function () {
	/**
	 * this.oldContainer is the HTMLElement of the old Container
	 */

	return $(this.oldContainer).animate({ opacity: 0 }).promise();
  },

  fadeIn: function () {
	/**
	 * this.newContainer is the HTMLElement of the new Container
	 * At this stage newContainer is on the DOM (inside our #barba-container and with visibility: hidden)
	 * Please note, newContainer is available just after newContainerLoading is resolved!
	 */
	var _this = this;
	var $el = $(this.newContainer);

	$(this.oldContainer).hide();

	$el.css({
	  visibility : 'visible',
	  opacity : 0
	});

	$el.animate({ opacity: 1 }, 400, function () {
	  /**
	   * Do not forget to call .done() as soon your transition is finished!
	   * .done() will automatically remove from the DOM the old Container
	   */

	  _this.done();
	});
  }
});


/**
 * Barba Constructor
 */
var initBarba = function () {
  /**
   * Next step, you have to tell Barba to use the new Transition
   */
  Barba.Pjax.getTransition = function () {
	/**
	 * Here you can use your own logic!
	 * For example you can use different Transition based on the current page or link...
	 */
	return FadeTransition;
  };
  // activate precache
  Barba.Prefetch.init();
  initTemplates();
  Barba.Pjax.start();
};


/**
 *
 */
$(document).ready(function (){
	initBarba();
});