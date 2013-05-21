/* This Meeting Schedule is written by Joseph Peacock CEN/EE 2016' 
For the University at Buffalo (SUNY) - Computer Science and Engineering Department 

Date: Janurary 2013 
Author: Joseph Peacock 
Contact: japeacoc@buffalo.edu
Page: base.js

*/

var times =  new Array (
				"12:00am", "1:00am", "2:00am", "3:00am", "4:00am", 
				"5:00am", "6:00am", "7:00 am", "8:00 am", "9:00 am", 
				"10:00 am",  "11:00 am",  "12:00 pm", "1:00 pm",  "2:00 pm", "3:00 pm",  "4:00 pm",  
				"5:00 pm",  "6:00 pm", "7:00 pm", "8:00 pm", "9:00pm", "10:00pm", "11:00pm"
			);
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

function getEventVars(response, dates) {
	var eventsSet = [];
	var eventsObj = new eventFormat(response);
	for (i=0; i < eventsObj.size(); i++) {
		eventsObj.sDateTime(i); // IMPORTANT: Set for relative date format from server
		eventsObj.eDateTime(i); // IMPORTANT: Set for relative date format from server
		var item = {
			name: eventsObj.name(i),
			stime: eventsObj.startTime(i),
			etime: eventsObj.endTime(i),
			sdate: eventsObj.date,
			eventLength: eventsObj.eventLength(i),
			yPos: eventsObj.getYPos(),
			xPos: eventsObj.getXPos(i) 
		};

		 eventsSet.push(item);
	}
	return eventsSet;
}

$(document).ready(function(){
	var diff = date.getDay();
	var ul = $('.cal-nav');
	var calSize = 7;
	var pos = 0;
	var neg = 0;
	var index = 0;
	var weekofEvents = new Array()
	var calendarWidth = screen.width-15;
	var dayWidth = Math.floor(($('.cal-wrap').width()-62)/7);

	$(function () {
			window.scrollTo(0, 400);
	});
	$('.calendar-head .allday td').css("width", dayWidth + 'px');
	$('.cal-wrap').css('width', calendarWidth + "px");
	$('.calendar td').css('width', dayWidth + "px");
	$('.calendar-body td').css('height', times.length*50 + 'px');

	weekofEvents = [];
	for(i = 0; i < 7; i++) {
		var dates = new Date(date.getFullYear(), date.getMonth(), date.getDate()-diff);		
		var datesjson = JSON.stringify({ day: dates.getDate()  , month: (dates.getMonth()+1), year: dates.getFullYear() });
		weekofEvents.push(datesjson);
		$(".cal-dates").append('<td name="' + dates.getDate() + '">' + weekDay[dates.getDay()] + ' ' +  (dates.getDate()) + ' ' + monthName[dates.getMonth()] + '');
		$('.calendar-head .cal-dates td').css("width", dayWidth + 'px');
		console.log("Hello");
		$('.calendar-body td:nth-child(' + (i+1) + ')').attr('id', dates.getDate());
		diff--;		
	}

	var startDay = JSON.parse(weekofEvents[0]);
	$('.current-week').append(startDay['day'] + " of " + monthName[startDay['month']-1] + ", " + startDay['year']);
	var currentTD = Math.ceil(Math.abs((date - dates)/(1000*60*60*24)));
	var Hours = date.getHours()*50;
	var minutes = (date.getMinutes()/parseFloat(60))*50; 

	console.log(Hours);
	console.log(minutes);
	console.log(Hours + minutes);

	var currentTimePx = Hours + minutes;
	var today = $('.calendar-body td:nth-child(' + (7-currentTD) + ')');	
	today.css('background-color', '#efefef'); 

	today.append('<div id="current-time" style="top:'+ currentTimePx + 'px; "></hr>');

	postDates(weekofEvents).complete(function(xhr, textStatus) {  
		var eventsObj = getEventVars(xhr.responseText, dates.getDate());
		for (i=0; i < eventsObj.length; i++) {
			console.log(eventsObj[i]['xPos']);
			var yPos  = eventsObj[i]['yPos'];
			var sdate  = eventsObj[i]['sdate'];
			if (currentTimePx > yPos && date.getDate() == sdate) {
				$('#' + (eventsObj[i]['xPos'])).append('<div class="cal-event" style="top:' + eventsObj[i]['yPos'] + 'px; height:'+ (eventsObj[i]['eventLength']-2)+ 'px; background-color:#ccc; border-color:#aaa"><p>' + eventsObj[i]['stime'] + ' - ' + eventsObj[i]['etime'] + '<br><span>' + json[i]['name']+'</span><!--<a href="/deletevent/' + json[i]['id'] + '">Delete</a> --></p></div>');
			} else {
			$('#' + (eventsObj[i]['xPos'])).append('<div class="cal-event" style="top:' + eventsObj[i]['yPos'] + 'px; height:'+ (eventsObj[i]['eventLength']-2) + 'px"><p>' + eventsObj[i]['stime'] + ' - ' + eventsObj[i]['etime'] + '<br><span>' + eventsObj[i]['name'] +'</span><!--<a href="/deletevent/' + eventsObj[i] + '">Delete</a> --></p></div>');
			}
		}
	});

	$('.cal-dates td').each(function(){
		$(this).removeClass('cal-nav-select');
		if ($(this).attr('name') == date.getDate()) {
			$(this).addClass('cal-nav-select');
		}
	});


	for (i = 0; i < times.length; i++){
		$('.times tr td').append("<div>" + times[i] + "</div>");
	}

		$(".prev-week").click(function(){
		$('.calendar-body td:nth-child(' + (7-currentTD) + ')').css('background-color', '#FFF');
		$('.calendar-body td:nth-child(' + (7-currentTD) + ') #current-time').remove();

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
				$('.cal-dates td:nth-child(' + i + ')').replaceWith('<td class="cal-nav-select">' + (dates.getDate()) + ' ' + weekDay[dates.getDay()] + ' ' + monthName[dates.getMonth()] + '</td>');
				$('.calendar-head .cal-dates td').css("width", dayWidth + 'px');
				var currentTimePx = (((date.getHours()-6)*50) + (date.getMinutes()/parseFloat(60)*50));
				var today = $('.calendar-body td:nth-child(' + (7-currentTD) + ')');	
				today.css('background-color', '#efefef'); 
				today.append('<div id="current-time" style="top:'+ currentTimePx + 'px; "></hr>')

			} else {
				$('.cal-dates td:nth-child(' + i + ')').replaceWith('<td>' + (dates.getDate()) + ' ' + weekDay[dates.getDay()] + ' ' + monthName[dates.getMonth()] + '</td>');
				$('.calendar-head .cal-dates td').css("width", dayWidth + 'px');

			}
		}

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
		$(".cal-dates td").click(function(){
			$(".cal-dates td").removeClass("cal-nav-select");
			$(this).toggleClass("cal-nav-select");
		});
			
		});

	$(".next-week").click(function(){
		$('.calendar-body td:nth-child(' + (7-currentTD) + ')').css('background-color', '#FFF');
		$('.calendar-body td:nth-child(' + (7-currentTD) + ') #current-time').remove();

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
				$('.cal-dates td:nth-child(' + i + ')').replaceWith('<td class="cal-nav-select">' + (dates.getDate()) + ' ' + weekDay[dates.getDay()] + ' ' + monthName[dates.getMonth()] + '</td>');
				$('.calendar-head .cal-dates td').css("width", dayWidth + 'px');
				var currentTimePx = (((date.getHours()-6)*50) + (date.getMinutes()/parseFloat(60)*50));
				var today = $('.calendar-body td:nth-child(' + (7-currentTD) + ')');	
				today.css('background-color', '#efefef'); 
				today.append('<div id="current-time" style="top:'+ currentTimePx + 'px; "></hr>')

			} else {
				$('.cal-dates td:nth-child(' + i + ')').replaceWith('<td>' + (dates.getDate()) + ' ' + weekDay[dates.getDay()] + ' ' + monthName[dates.getMonth()] + '</td>');
				$('.calendar-head .cal-dates td').css("width", dayWidth + 'px');

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
					$('.calendar-head .cal-dates td').css("width", dayWidth + 'px');

				} else {
					$('.calendar-body td:nth-child(' + (xPos) + ')').append('<div class="cal-event" style="top:' + yPos + 'px; height:'+ eventLength + 'px"><p>' + stime + ' - ' + etime + '<br><strong>' + eventsObj.Name(i) +'</strong><!--<a href="/deletevent/' + eventsObj.id(i) + '">Delete</a> --></p></div>');
					$('.calendar-head .cal-dates td').css("width", dayWidth + 'px');
				}
			}
		});
		$(".cal-dates td").click(function(){
			$(".cal-dates td").removeClass("cal-nav-select");
			$(this).toggleClass("cal-nav-select");
		});

	});
});
