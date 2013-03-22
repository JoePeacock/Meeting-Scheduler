/* This Meeting Scheduler is written by Joseph Peacock CEN/EE 2016' 
For the University at Buffalo (SUNY) - Computer Science and Engineering Department 

Date: Janurary 2013 
Author: Joseph Peacock 
Contact: japeacoc@buffalo.edu
Page: base.html

*/

/* NOTE REBUILD WEEKS WITH SINGULAR WEEKS REUPDATING THE LIST. */

var times =  new Array("8:00 am", "9:00 am", "10:00 am",  "11:00 am",  "12:00 pm", "1:00 pm",  "2:00 pm", "3:00 pm",  "4:00 pm",  "5:00 pm",  "6:00 pm");
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
	ul.append("<div class='week' style='display:block'></div>");

	for(i = 0; i < 7; i++) {
		var dates = new Date(date.getFullYear(), date.getMonth(), date.getDate()-diff);
		$(".cal-dates").append('<th><span class ="date-num">' + (dates.getDate()) + '</span><span class="date-day">' + weekDay[dates.getDay()] + '<bR>' + monthName[dates.getMonth()] + '</span></th>');
		diff--;		
	}
	
	$('.cal-nav li').each(function(){
		$(this).removeClass('cal-nav-select');
		if ($(this).find('.date-num').text() == date.getDate()) {
			$(this).addClass('cal-nav-select');
		}
	});

	for (i = 0; i < times.length; i++){
		$('.times tr td').append("<div>" + times[i] + "</div>");
	}
	

	$(".cal-nav li").click(function(){
		$(".cal-nav li").removeClass("cal-nav-select");
		$(this).toggleClass("cal-nav-select")
	});

	$(".prev-week").click(function(){

		var endweek = $('.week li:nth-child(7)').text();

			if ((date.getDate()+Math.abs(diff)) != endweek) {
				dates.setDate(dates.getDate()-14);
			} else {
				dates.setDate(date.getDate()+Math.abs(diff)-14);
			}

			var weekofEvents = new Array();

			for(i = 1; i < 8; i++) {
				dates.setDate(dates.getDate()+1);
				var weekofEvents = '{ "day":"' + dates.getDate() + "', 'month': '" + (dates.getMonth()+1) + "', 'year': '" +dates.getFullYear() + '"}';

				if (dates.getDate() == date.getDate()) {
					$('.cal-dates th:nth-child(' + i + ')').replaceWith('<th class="cal-nav-select"><span class ="date-num">' + (dates.getDate()) + '</span><span class="date-day">' + weekDay[dates.getDay()] + '<bR>' + monthName[dates.getMonth()] + '</span></th>');

				} else {
					$('.cal-dates th:nth-child(' + i + ')').replaceWith('<th><span class ="date-num">' + (dates.getDate()) + '</span><span class="date-day">' + weekDay[dates.getDay()] + '<bR>' + monthName[dates.getMonth()] + '</span></th>');
				}


			}

			$.ajax({
					type: "POST",
					dataType: "json",
					data:  {'events': weekofEvents },
					url: 'http://localhost:5003/reqs/getcal/',
					complete: function(xhr, textStatus) {  
						console.log(xhr.responseText) 
					}
				});

			$(".cal-nav td").click(function(){
				$(".cal-nav li").removeClass("cal-nav-select");
				$(this).toggleClass("cal-nav-select");
			});
			
		});

	$(".next-week").click(function(){
		
		var endweek = $('.cal-dates td:nth-child(7)').text();

			if ((date.getDate()+Math.abs(diff)) != endweek) {
				dates.setDate(dates.getDate());
			} else {
				dates.setDate(date.getDate()+Math.abs(diff));
			}

			for (i = 1; i < 8; i++) {
				dates.setDate(dates.getDate()+1);
				if (dates.getDate() == date.getDate()) {
					$('.cal-dates th:nth-child(' + i + ')').replaceWith('<th class="cal-nav-select"><span class ="date-num">' + (dates.getDate()) + '</span><span class="date-day">' + weekDay[dates.getDay()] + '<bR>' + monthName[dates.getMonth()] + '</span></th>');

				} else {
				$('.cal-dates th:nth-child(' + i + ')').replaceWith('<th><span class ="date-num">' + (dates.getDate()) + '</span><span class="date-day">' + weekDay[dates.getDay()] + '<bR>' + monthName[dates.getMonth()] + '</span></th>');
			}
		}

			$(".cal-nav li").click(function(){
				$(".cal-nav li").removeClass("cal-nav-select");
				$(this).toggleClass("cal-nav-select");
			});

	});
});
