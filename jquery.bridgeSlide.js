/**
 * jQuery bridgeSlide Plugin 0.2.2 (06.16.2015)
 * @link http://gilu.org
 *
 * @copyright 2014, Gilu.org
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
(function($)
{
	$.fn.bridgeSlide = function(config)
	{
		var config = $.extend(
			{
				width: 960,
				visibleItems: 4,
				items: '.items',
				item: '.item',
				itemMargin: 'auto',
				pagination: '#pagination',
				paginationExtended: false,
				paginationPrev: '.left',
				paginationNext: '.right',
				sliderStartAnimate: true,
				sliderStartSpeed: 800,
				sliderStartEasing: 'linear',
				sliderSpeed: 500,
				sliderEasing: 'linear',
				keyboardArrows: true,
				touch: true
			}, config);
		return new bridgeSlide(this, config);
	};


	var bridgeSlide = function(element, config)
	{
		var bridgeSlide = this;
		bridgeSlide._init(element, config);

	};


	bridgeSlide.prototype =
	{
		// Configuration
		config: null,
		// This element (bridgeSlide)
		element: null,
		// Slider container div
		containerDiv: null,
		// Slider items
		items: null,
		// Number of items
		itemsLength: 0,
		// Slider item Width
		itemWidth: 0,
		// Pagination element
		pagination: null,
		// Paginationis clickable or not
		paginationClickable: true,
		// Position where item is hiden from left
		leftHide: 0,
		// Position where item is hiden from right
		rightHide: 0,
		// First elements left position
		firstPos: 0,
		// Last elements right position
		lastPos: null,

		/*
		 * Initialize and start slider
		 */
		_init: function(element, config)
		{

			// This element (bridgeSlide)
			this.element = element;
			// Configuration
			this.config = config;

			// Add some neccessary css to the main div (this)
			this.element.css({
				'overflowX': 'hidden',
				'overflowY': 'visible',
				'position': 'relative'
			});

			// Create container div
			this.containerDiv = $(document.createElement('div'));
			// Get width for the container div
			this.config.width = config.width == '100%' || config.width == 'auto' ? $(document).width() : parseInt(config.width);

			// Items object
			var itemsContainer = $(config.items, element);
			// Slider items
			this.items = $(config.item, itemsContainer);
			// Number of items
			this.itemsLength = parseInt(this.items.length);
			// Append container div to main object (this)
			this.element.append(this.containerDiv);
			// Append items to container div
			itemsContainer.appendTo(this.containerDiv);
			// Append pagination to the main object (this)
			this.pagination = $(this.config.pagination, element).length && this.config.paginationExtended === false ? $(this.config.pagination, element).appendTo(element) : $(this.config.pagination);

			// Assign css for the container div
			this.containerDiv.css({
				'width': config.width,
				'position': 'relative',
				'margin': '0 auto',
				'minHeight': this.items.filter(':visible').first().innerHeight()
			});

			// Set some auto configs
			// Element margins
			if(config.itemMargin === 'auto')
			{
				config.itemMargin = parseInt(this.items.first().css('marginLeft')) + parseInt(this.items.first().css('marginRight'));
			}
			config.itemMargin = parseInt(config.itemMargin);

			// If items is less than visible items
			if(this.itemsLength <= this.config. visibleItems)
			{
				$(this.config.paginationPrev + ',' + this.config.paginationNext, this.pagination).addClass('disabled');
				// Margin left for element
				var marginLeft = 0;
				this.items.each(function(i)
				{
					$(this).css({
						marginLeft: marginLeft + 'px'
					});
					// Add margins
					//marginLeft += config.itemMargin;
					marginLeft = config.itemMargin;
				});
				return false;
			}

			// Slider item width
			this.itemWidth = this.items.innerWidth();
			// Left position, for hiding element
			this.leftHide = this.items.first().offset().left;
			// Right position, for hiding element
			this.rightHide = $(window).width() - this.leftHide;
			// Correct left hide position
			this.leftHide += this.itemWidth;

			// Window resize fixer
			this.fixer();

			// Hide pagination
			this.pagination.hide();
			// Hide all items
			this.items.hide();
			// Start Slider
			this.startSlider();
		},


		/*
		 * Start slider and show config.visible elements
		 */
		startSlider: function()
		{
			// This element (bridgeSlide)
			var element = this;
			// Configuration
			var config = element.config;
			// Pagination
			var pagination = element.pagination;
			// Current Position fot left element
			var currentPosL = 0;
			// Margin left for element
			var marginLeft = 0;
			// All Items
			var items = element.items;
			// Item width
			var itemWidth = element.itemWidth;

			// At first, show all visible elements
			items.eq(config.visibleItems).prevAll().show();
			// Set all items position to right hide.
			// If config.sliderStartAnimate === false, then hide all emenets except first config.visibleItems
			this.items.css(
				{
					'position': 'absolute',
					'top': 0
				});
			if(config.sliderStartAnimate === true)
			{
				// Hide all items
				this.items.css(
					{
						'left': this.rightHide
					});
				// At first, display all visible elements with animation
				$(items).filter(':visible').each(function(i)
				{
					$(this).stop().animate(
						{
							left: currentPosL + marginLeft
						}, {
							duration: config.sliderStartSpeed,
							specialEasing: {
								left: config.sliderStartEasing
							},
							done: function()
							{
								// Disable paginations previous button
								$(config.paginationPrev, pagination).addClass('disabled');
								// Display pagination
								pagination.fadeIn('fast');
							}
						});
					// Positioning elements helper
					currentPosL += itemWidth;
					// Add margins
					marginLeft += config.itemMargin;
				});
			}
			else
			{
				// Show at start some items
				this.items.slice(config.visibleItems, this.itemsLength).css(
					{
						'left': this.rightHide
					});
				// At first, display all visible elements with animation
				$(items).filter(':visible').each(function(i)
				{
					$(this).css({
						left: currentPosL + marginLeft
					});
					// Disable paginations previous button
					$(config.paginationPrev, pagination).addClass('disabled');
					// Display pagination
					pagination.fadeIn('fast');
					// Positioning elements helper
					currentPosL += itemWidth;
					// Add margins
					marginLeft += config.itemMargin;
				});
			}

			// Change slides by keyboard arrow clicking
			if(config.keyboardArrows === true)
			{
				$(document).keydown(function(e)
				{
					switch(parseInt(e.keyCode))
					{
						// Show next slider by keyboard arrow left
						case 39:
							element.goTo('next', config.paginationNext, e);
							break;
						// Show previous slider by keyboard arrow right
						case 37:
							element.goTo('prev', config.paginationPrev, e);
							break;
					}
				});
			}

			// Show Next slider by clicking on the next button
			$(config.paginationNext, pagination).click(function(e)
			{
				element.goTo('next', this, e);
			});
			// Show Previous slider by clicking on the previous button
			$(config.paginationPrev, pagination).click(function(e)
			{
				element.goTo('prev', this, e);
			});
			if(config.touch === true)
			{
				element.swipe(this.element[0], function(swipePos, e)
				{
					switch(swipePos)
					{
						// Show next slider by swipe right
						case 'left':
							element.goTo('next', config.paginationNext, e);
							break;
						// Show previous slider by swipe left
						case 'right':
							element.goTo('prev', config.paginationPrev, e);
							break;
					}
				});
			}
		},


		/*
		 * Change slider by clicking or with arrow buttons
		 * 
		 * action prev|next
		 * actionElement (prev button or next button)
		 * e Event
		 */
		goTo: function(action, actionElement, e)
		{
			// This element (bridgeSlide)
			var element = this;
			// Get items
			var items = element.items;
			// Get last position of element
			element.lastPos = this.items.filter(':visible:last').position().left;
			// If pagination is not clickable (if there is no element to display), just return false
			if (element.getPaginationClickable() === false || $(actionElement, element.config.pagination).hasClass('disabled'))
			{
				return false;
			}
			// Previous action
			if (action == 'prev')
			{
				// Active next button for clicking
				$(element.config.paginationNext, element.pagination).removeClass('disabled');
				// Get first visible element
				var firstVisible = items.filter(':visible:first');
				// Disable arrow button, if there is not any items to display
				var prevVisibleLength = firstVisible.prevAll(element.config.item).length;
				if (prevVisibleLength <= 1)
				{
					$(actionElement, element.config.pagination).addClass('disabled');
				}
				// Show arrow if there is elements to display
				else
				{
					$(actionElement, element.config.pagination).removeClass('disabled');
				}
			}
			// Next action
			else if (action == 'next')
			{
				// Active previous button for clicking
				$(element.config.paginationPrev, element.pagination).removeClass('disabled');
				// Get last visible element
				var lastVisible = items.filter(':visible:last');

				// Disable arrow, if there is not any items to display
				var nextVisibleLength = lastVisible.nextAll(element.config.item).length;

				if (nextVisibleLength <= 1)
				{
					$(actionElement, element.config.pagination).addClass('disabled');
				}
				else
				{
					$(actionElement, element.config.pagination).removeClass('disabled');
				}
			}

			// Disable multi click
			element.setPaginationClickable(false);

			// Animation start by clicking or by keyboard arrows (prev or next)
			$(items).filter(':visible').each(function(i, elem)
			{
				// Previous action
				if(action == 'prev')
				{
					switch (i)
					{
						// Hide last item
						case (element.config.visibleItems - 1):
							element.firstPos = element.rightHide;
							break;
						// Set element to last position
						case (element.config.visibleItems - 2):
							element.firstPos = element.lastPos;
							break;
						// Change items position from right to left
						default:
							element.firstPos = ($(elem).position().left + element.itemWidth) + element.config.itemMargin;
							break;
					}
				}
				// Next action
				else if(action == 'next')
				{
					switch (i)
					{
						// Hide first item
						case 0:
							element.firstPos = -element.leftHide - element.config.itemMargin;
							break;
						// Set element to first position
						case 1:
							element.firstPos = 0;
							break;
						//  Change items position from left to right
						default:
							element.firstPos = ($(elem).position().left - element.itemWidth) - element.config.itemMargin;
							break;
					}
				}
				// Do this positioning all positioning with animation
				$(elem).stop().animate(
					{
						// Animation left!
						left: element.firstPos
					}, {
						// Duration and Easing
						duration: i === 0 ? element.config.sliderSpeed : element.config.sliderSpeed,
						specialEasing:
						{
							left: element.config.sliderEasing
						},
						// Animation done
						done: function()
						{
							// If action is 'previous', then hide prev button, if there is no any item(s) to show
							if(action == 'prev')
							{
								i === (element.config.visibleItems - 1) && $(elem).hide('0', function()
								{
									element.setPaginationClickable(true);
								});
							}
							// If action is 'next', then hide next button, if there is no any item(s) to show
							else if(action == 'next')
							{
								i === 0 && $(elem).hide('0', function()
								{
									element.setPaginationClickable(true);
								});
							}
						}
					});
			});

			// Show a new item from left, or from right
			action == 'prev' ? firstVisible.prev().show() : lastVisible.next().show();
			// Animate a new item
			$(action == 'prev' ? firstVisible.prev() : lastVisible.next()).stop().animate(
				{
					// Animation left!
					left: action == 'prev' ? 0 : lastVisible.position().left
				}, {
					// Duration and Easing
					duration: element.config.sliderSpeed,
					specialEasing:
					{
						left: element.config.sliderEasing
					},
					// Animation complete
					complete: function()
					{
					}
				});
		},


		/*
		 * Set information about pagination is clickable or not
		 * value true|false
		 */
		setPaginationClickable: function(value)
		{
			this.paginationClickable = value;
		},


		/*
		 * Get information about pagination is clickable or not
		 */
		getPaginationClickable: function()
		{
			return this.paginationClickable;
		},


		/*
		 * Helper method, on window resize and etc.
		 */
		fixer: function()
		{
			// This element (bridgeSlide)
			var element = this;
			// Window on resize fixer
			$(window).on('resize', function()
			{
				// Update left position, for hiding element
				element.leftHide = element.items.filter(':visible').first().offset().left;
				// Update right position, for hiding element
				element.rightHide = $(window).width() - element.leftHide;
				// Correct left hide position
				element.leftHide += element.itemWidth;
				// Change item hidden positions
				element.items.filter(':visible').first().prevAll(element.config.item).css({
					'left': -element.leftHide
				});
				element.items.filter(':visible').last().nextAll(element.config.item).css({
					'left': element.rightHide
				});

				// Update document width
				element.config.width = element.config.width == '100%' || element.config.width == 'auto' ? $(document).width() : element.config.width;
				$(element.containerDiv).css({
					'width': element.config.width
				});
			});
		},


		/*
		 * Touch (swipe) event methods (helpers)
		 */
		swipe: function (element, callback)
		{
			var touchObject = element,
				swipePos,
				startX,
				startY,
				distX,
				distY,
				threshold = 150, //required min distance traveled to be considered swipe
				restraint = 100, // maximum distance allowed at the same time in perpendicular direction
				allowedTime = 300, // maximum time allowed to travel that distance
				elapsedTime,
				startTime,
				handleswipe = callback || function(swipePos, e)
				{

				};
			touchObject.addEventListener('touchstart', function(e)
			{
				var touchElem = e.changedTouches[0]
				swipePos = 'none';
				startX = touchElem.pageX;
				startY = touchElem.pageY;
				// record time when finger first makes contact with surface
				startTime = new Date().getTime();
				//e.preventDefault();

			}, false);

			touchObject.addEventListener('touchmove', function(e)
			{
				// prevent scrolling when inside DIV
				//e.preventDefault();
			}, false);

			touchObject.addEventListener('touchend', function(e)
			{
				var touchElem = e.changedTouches[0];
				// get horizontal dist traveled by finger while in contact with surface
				distX = touchElem.pageX - startX;
				// get vertical dist traveled by finger while in contact with surface
				distY = touchElem.pageY - startY;
				// get time elapsed
				elapsedTime = new Date().getTime() - startTime;
				// first condition for swipe met
				if(elapsedTime <= allowedTime)
				{
					// 2nd condition for horizontal swipe met
					if(Math.abs(distX) >= threshold && Math.abs(distY) <= restraint)
					{
						// if dist traveled is negative, it indicates left swipe
						swipePos = (distX < 0)? 'left' : 'right';
					}
					// 2nd condition for vertical swipe met
					else if(Math.abs(distY) >= threshold && Math.abs(distX) <= restraint)
					{
						// if dist traveled is negative, it indicates up swipe
						swipePos = (distY < 0)? 'up' : 'down';
					}
				}
				handleswipe(swipePos, e);
				//e.preventDefault();
			}, false);
		}
	};
}(jQuery));
