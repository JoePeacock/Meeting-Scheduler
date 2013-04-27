/* This Meeting Schedule is written by Joseph Peacock CEN/EE 2016' 
For the University at Buffalo (SUNY) - Computer Science and Engineering Department 

Date: Janurary 2013 
Author: Joseph Peacock 
Contact: japeacoc@buffalo.edu
Page: base.js

*/

var times =  new Array("7:00 am", "7:30 am", "8:00 am", "9:00 am", "10:00 am",  "11:00 am",  "12:00 pm", "1:00 pm",  "2:00 pm", "3:00 pm",  "4:00 pm",  "5:00 pm",  "6:00 pm", "6:30 pm", "7:00 pm", "7:30 pm", "8:00 pm");
var weekDay = new Array("Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat");
var monthName = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
var date = new Date();
var pastDate = new Date();

function postDates(weekofEvents) {
	var weekdates = '';
	for (i = 0; i < weekofEvents.length; i++) {
		weekdates+= weekofEvents[i] + ',';
	}
	weekdates = weekdates.substring(0, weekdates.length - 1);
	weekdates = '[' + weekdates + ']';

	var url = window.location.href;
	var splitarray = url.split("/");
	if (splitarray[splitarray.length-1] == '#') {
		var username = 'none';
	} else {2
		var username = splitarray[splitarray.length-1];
		if (username.charAt(username.length-1) == '#') {
			username = username.slice(0, -1);
		}
	}

	return $.ajax({
		type: "POST",
		dataType: "json",
		data:  { events: weekdates, user: username },
		url: 'http://0.0.0.0:5003/reqs/getcal/',
	});	
}

$(document).ready(function(){
	var diff = date.getDay();
	var ul = $('.cal-nav');
	var calSize = 7;
	var pos = 0;
	var neg = 0;
	var index = 0;
	var weekofEvents = new Array()

	$('.calendar-body td').css('height', times.length*50 + 'px');

	weekofEvents = [];
	for(i = 0; i < 7; i++) {
		var dates = new Date(date.getFullYear(), date.getMonth(), date.getDate()-diff);		
		var datesjson = JSON.stringify({ day: dates.getDate()  , month: (dates.getMonth()+1), year: dates.getFullYear() });
		weekofEvents.push(datesjson);
		$(".cal-dates").append('<th>' + weekDay[dates.getDay()] + ' ' +  (dates.getDate()) + ' ' + monthName[dates.getMonth()] + '</th>');
		diff--;		
	}
	console.log(weekofEvents);
	var currentTD = Math.abs(date.getDate() - dates.getDate());
	var currentTimePx = (((date.getHours()-6)*50) + (date.getMinutes()/parseFloat(60)*50));
	var today = $('.calendar-body td:nth-child(' + (7-currentTD) + ')');	 
	today.css('background-color', '#eee'); 
	today.append('<div id="current-time" style="top:'+ currentTimePx + 'px; "></hr>')


	postDates(weekofEvents).complete(function(xhr, textStatus) {  
		var eventsObj = new eventFormat(xhr.responseText);

		for (i=0; i < eventsObj.size(); i++) {
			eventsObj.sDateTime(i);
			eventsObj.eDateTime(i);
			var stime = eventsObj.startTime(i);
			var etime = eventsObj.endTime(i);
			var sdate = eventsObj.date;
			var eventLength = eventsObj.eventLength(i);
			var yPos = eventsObj.getYPos();
			var xPos = eventsObj.getXPos(dates.getDate()-i);
			
			if (currentTimePx > yPos && date.getDate() == sdate) {
				$('.calendar-body td:nth-child(' + (xPos) + ')').append('<div class="cal-event" style="top:' + yPos + 'px; height:'+ eventLength + 'px; background-color:#ccc; border-color:#aaa"><p>' + stime + ' - ' + etime + '<br><strong>' + json[i]['name']+'</strong><!--<a href="/deletevent/' + json[i]['id'] + '">Delete</a> --></p></div>');
			} else {
			$('.calendar-body td:nth-child(' + (xPos) + ')').append('<div class="cal-event" style="top:' + yPos + 'px; height:'+ eventLength + 'px"><p>' + stime + ' - ' + etime + '<br><strong>' + eventsObj.Name(i) +'</strong><!--<a href="/deletevent/' + eventsObj.id(i) + '">Delete</a> --></p></div>');
			}
		}
	});

	
	$('.cal-dates th').each(function(){
		$(this).removeClass('cal-nav-select');
		if ($(this).find('#date').text() == date.getDate()) {
			$(this).addClass('cal-nav-select');
		}
	});


	for (i = 0; i < times.length; i++){
		$('.times tr td').append("<div>" + times[i] + "</div>");
	}

	

	$(".cal-dates th").click(function(){
		$(".cal-dates th").removeClass("cal-nav-select");
		$(this).toggleClass("cal-nav-select")
	});

	$(".prev-week").click(function(){
		$('.calendar-body .cal-event').remove();
		var endweek = $('.week li:nth-child(7)').text();

		if ((date.getDate()+Math.abs(diff)) != endweek) {
			dates.setDate(dates.getDate()-14);
		} else {
			dates.setDate(date.getDate()+Math.abs(diff)-14);
		}

		weekofEvents = [];
		for(i = 1; i < 8; i++) {
			dates.setDate(dates.getDate()+1);

			datesjson = JSON.stringify({ day: dates.getDate()  , month: (dates.getMonth()+1), year: dates.getFullYear() });
			weekofEvents.push(datesjson);

			if (dates.getDate() == date.getDate() && dates.getMonth() == date.getMonth() && dates.getFullYear() == date.getFullYear()) {
				$('.cal-dates th:nth-child(' + i + ')').replaceWith('<th class="cal-nav-select">' + (dates.getDate()) + ' ' + weekDay[dates.getDay()] + ' ' + monthName[dates.getMonth()] + '</th>');

			} else {
				$('.cal-dates th:nth-child(' + i + ')').replaceWith('<th>' + (dates.getDate()) + ' ' + weekDay[dates.getDay()] + ' ' + monthName[dates.getMonth()] + '</th>');
			}
		}
		console.log(weekofEvents);

		postDates(weekofEvents).complete(function(xhr, textStatus) {  
		var eventsObj = new eventFormat(xhr.responseText);
			for (i=0; i < eventsObj.size(); i++) {
				eventsObj.sDateTime(i);
				eventsObj.eDateTime(i);
				var stime = eventsObj.startTime(i);
				var etime = eventsObj.endTime(i);
				var sdate = eventsObj.date;
				var eventLength = eventsObj.eventLength(i);
				var yPos = eventsObj.getYPos();
				var xPos = eventsObj.getXPos(dates.getDate()-i);
				
				if (currentTimePx > yPos && date.getDate() == sdate) {
					$('.calendar-body td:nth-child(' + (xPos) + ')').append('<div class="cal-event" style="top:' + yPos + 'px; height:'+ eventLength + 'px; background-color:#ccc; border-color:#aaa"><p>' + stime + ' - ' + etime + '<br><strong>' + json[i]['name']+'</strong><!--<a href="/deletevent/' + json[i]['id'] + '">Delete</a> --></p></div>');
				} else {
				$('.calendar-body td:nth-child(' + (xPos) + ')').append('<div class="cal-event" style="top:' + yPos + 'px; height:'+ eventLength + 'px"><p>' + stime + ' - ' + etime + '<br><strong>' + eventsObj.Name(i) +'</strong><!--<a href="/deletevent/' + eventsObj.id(i) + '">Delete</a> --></p></div>');
				}
			}
		});
		$(".cal-dates th").click(function(){
			$(".cal-dates th").removeClass("cal-nav-select");
			$(this).toggleClass("cal-nav-select");
		});
			
		});

	$(".next-week").click(function(){
		$('.calendar-body .cal-event').remove();		
		var endweek = $('.cal-dates td:nth-child(7)').text();

		if ((date.getDate()+Math.abs(diff)) != endweek) {
			dates.setDate(dates.getDate());
		} else {
			dates.setDate(date.getDate()+Math.abs(diff));
		}

		weekofEvents = [];
		for (i = 1; i < 8; i++) {
			dates.setDate(dates.getDate()+1);
			datesjson = JSON.stringify({ day: dates.getDate()  , month: (dates.getMonth()+1), year: dates.getFullYear() });
			weekofEvents.push(datesjson);
			if (dates.getDate() == date.getDate() && dates.getMonth() == date.getMonth() && dates.getFullYear() == date.getFullYear()) {
				$('.cal-dates th:nth-child(' + i + ')').replaceWith('<th class="cal-nav-select">' + (dates.getDate()) + ' ' + weekDay[dates.getDay()] + ' ' + monthName[dates.getMonth()] + '</th>');

			} else {
			$('.cal-dates th:nth-child(' + i + ')').replaceWith('<th>' + (dates.getDate()) + ' ' + weekDay[dates.getDay()] + ' ' + monthName[dates.getMonth()] + '</th>');
			}
		}
		console.log(weekofEvents);
		postDates(weekofEvents).complete(function(xhr, textStatus) {  
			var eventsObj = new eventFormat(xhr.responseText);
			for (i=0; i < eventsObj.size(); i++) {
				eventsObj.sDateTime(i);
				eventsObj.eDateTime(i);
				var stime = eventsObj.startTime(i);
				var etime = eventsObj.endTime(i);
				var sdate = eventsObj.date;
				var eventLength = eventsObj.eventLength(i);
				var yPos = eventsObj.getYPos();
				var xPos = eventsObj.getXPos(dates.getDate()-i);
				
				if (currentTimePx > yPos && date.getDate() == sdate) {
					$('.calendar-body td:nth-child(' + (xPos) + ')').append('<div class="cal-event" style="top:' + yPos + 'px; height:'+ eventLength + 'px; background-color:#ccc; border-color:#aaa"><p>' + stime + ' - ' + etime + '<br><strong>' + json[i]['name']+'</strong><!--<a href="/deletevent/' + json[i]['id'] + '">Delete</a> --></p></div>');
				} else {
				$('.calendar-body td:nth-child(' + (xPos) + ')').append('<div class="cal-event" style="top:' + yPos + 'px; height:'+ eventLength + 'px"><p>' + stime + ' - ' + etime + '<br><strong>' + eventsObj.Name(i) +'</strong><!--<a href="/deletevent/' + eventsObj.id(i) + '">Delete</a> --></p></div>');
				}
			}
		});
		$(".cal-dates th").click(function(){
			$(".cal-dates th").removeClass("cal-nav-select");
			$(this).toggleClass("cal-nav-select");
		});

	});
});
