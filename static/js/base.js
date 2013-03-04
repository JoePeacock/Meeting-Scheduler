/* This Meeting Scheduler is written by Joseph Peacock CEN/EE 2016' 
For the University at Buffalo (SUNY) - Computer Science and Engineering Department 

Date: Janurary 2013 
Author: Joseph Peacock 
Contact: japeacoc@buffalo.edu
Page: base.html

*/


/* NOTE REBUILD WEEKS WITH SINGULAR WEEKS REUPDATING THE LIST. *
/
var weekDay = new Array("Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat");
var monthName = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
var date = new Date();
var pastDate = new Date();

$(document).ready(function(){
	var diff = date.getDay();
	var ul = $('.cal-nav');
	var calSize = 7;
	var pos = 0;
	var neg = 0;
	var index = 0;
	ul.append("<div class='week0' style='display:block'></div>");

	for(i = 0; i < 7; i++) {
		var dates = new Date(date.getFullYear(), date.getMonth(), date.getDate()-diff);
		$(".week0").append('<li><span class ="date-num">' + (dates.getDate()) + '</span><span class="date-day">' + weekDay[dates.getDay()] + '<bR>' + monthName[dates.getMonth()] + '</span></li>');
		diff--;		
	}

/*	if (ul.children('li').size() > 7) {
		ul.children('li:gt(7)', this).hide();
*/	
	
	$('.cal-nav li').each(function(){
		$(this).removeClass('cal-nav-select');
		if ($(this).find('.date-num').text() == date.getDate()) {
			$(this).addClass('cal-nav-select');
		}
	});

	$(".cal-nav li").click(function(){
		$(".cal-nav li").removeClass("cal-nav-select");
		$(this).toggleClass("cal-nav-select");
	});

	$(".prev-week").click(function(){
		index -= 1;
		var week = parseInt($('.cal-nav div[style*="display:block"]').attr('class').charAt(4));
		console.log(week);
		if ((week-1) == index) {
			$('.cal-nav').prepend("<div class='week" + index + "'></div>");
			console.log("IM HERE");

				var backwards = date.getDay();
				pastDate.setDate(date.getDate()-backwards);
			for(i = 0; i < 7; i++) {
				pastDate.setDate(pastDate.getDate()-1);
				$('.week' + index).prepend('<li><span class ="date-num">' + (pastDate.getDate()) + '</span><span class="date-day">' + weekDay[pastDate.getDay()] + '<bR>' + monthName[pastDate.getMonth()] + '</span></li>');
			}
			$(".cal-nav li").click(function(){
				$(".cal-nav li").removeClass("cal-nav-select");
				$(this).toggleClass("cal-nav-select");
			});

				$('.week' + (index+1)).hide();
				$('.week' + (index)).fadeIn();

		} else {
			$('.week' + (index+1)).hide();
			$('.week' + (index)).fadeIn();
		}
			
	});

	$(".next-week").click(function(){
		index += 1;

		if ($('') == index) {
			$('.cal-nav').append("<div class='week" + pos + "'></div>");

			for (i = 0; i < 7; i++) {
				dates.setDate(dates.getDate()+1);
				$('.week' + pos).append('<li><span class ="date-num">' + (dates.getDate()) + '</span><span class="date-day">' + weekDay[dates.getDay()] + '<bR>' + monthName[dates.getMonth()] + '</span></li>');
			}
			$(".cal-nav li").click(function(){
				$(".cal-nav li").removeClass("cal-nav-select");
				$(this).toggleClass("cal-nav-select");
			});

			$('.week' + (index-1)).hide();
			$('.week' + (index)).fadeIn();
		} else {
			$('.week' + (index-1)).hide();
			$('.week' + (index)).fadeIn();
		}

	});
});
