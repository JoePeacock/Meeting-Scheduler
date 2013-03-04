/* This Meeting Scheduler is written by Joseph Peacock CEN/EE 2016' 
For the University at Buffalo (SUNY) - Computer Science and Engineering Department 

Date: Janurary 2013 
Author: Joseph Peacock 
Contact: japeacoc@buffalo.edu
Page: base.html

*/

var weekDay = new Array("Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat");
var monthName = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
var date = new Date();
var pastDate = new Date();

$(document).ready(function(){
	var diff = date.getDay();

	for(i = 0; i < 21; i++) {
		var dates = new Date(date.getFullYear(), date.getMonth(), date.getDate()-diff);
		$('.cal-nav').append('<li><span class ="date-num">' + (dates.getDate()) + '</span><span class="date-day">' + weekDay[dates.getDay()] + '<bR>' + monthName[dates.getMonth()] + '</span></li>');
		diff--;
		
	}
	
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
			var backwards = date.getDay();
			pastDate.setDate(date.getDate()-backwards);
		for(i = 0; i < 7; i++) {
			pastDate.setDate(pastDate.getDate()-1);
			$('.cal-nav').prepend('<li><span class ="date-num">' + (pastDate.getDate()) + '</span><span class="date-day">' + weekDay[pastDate.getDay()] + '<bR>' + monthName[pastDate.getMonth()] + '</span></li>');
		}
		$(".cal-nav li").click(function(){
			$(".cal-nav li").removeClass("cal-nav-select");
			$(this).toggleClass("cal-nav-select");
		});
	});
	

	$(".next-week").click(function(){
		for (i = 0; i < 7; i++) {
			dates.setDate(dates.getDate()+1);
			$('.cal-nav').append('<li><span class ="date-num">' + (dates.getDate()) + '</span><span class="date-day">' + weekDay[dates.getDay()] + '<bR>' + monthName[dates.getMonth()] + '</span></li>');
		}
		$(".cal-nav li").click(function(){
			$(".cal-nav li").removeClass("cal-nav-select");
			$(this).toggleClass("cal-nav-select");
		});

	});
});
