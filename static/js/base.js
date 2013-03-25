/* This Meeting Scheduler is written by Joseph Peacock CEN/EE 2016' 
For the University at Buffalo (SUNY) - Computer Science and Engineering Department 

Date: Janurary 2013 
Author: Joseph Peacock 
Contact: japeacoc@buffalo.edu
Page: base.html

*/

var times =  new Array("7:00 am", "7:30 am", "8:00 am", "9:00 am", "10:00 am",  "11:00 am",  "12:00 pm", "1:00 pm",  "2:00 pm", "3:00 pm",  "4:00 pm",  "5:00 pm",  "6:00 pm");
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
	} else {
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
	var weekofEvents = new Array();

	weekofEvents = [];
	for(i = 0; i < 7; i++) {
		var dates = new Date(date.getFullYear(), date.getMonth(), date.getDate()-diff);		
		var datesjson = JSON.stringify({ day: dates.getDate()  , month: (dates.getMonth()+1), year: dates.getFullYear() });
		weekofEvents.push(datesjson);
		$(".cal-dates").append('<th><span class ="date-num">' + (dates.getDate()) + ' </span><span class="date-day">' + weekDay[dates.getDay()] + '<bR>' + monthName[dates.getMonth()] + '</span></th>');
		diff--;		
	}

	postDates(weekofEvents).complete(function(xhr, textStatus) {  
		var results = xhr.responseText;
		var json = JSON.parse(results);
		console.log(results);
		for (i=0; i < json.length; i++) {
			var sdateTime = json[i]['start'].split('T');
			var edateTime = json[i]['end'].split('T');
			var sdate = sdateTime[0].split('-');
			var stime = sdateTime[1].split(':');
			var eventLength = ((edateTime[1].split(':')[0] - stime[0])*50) + ((((edateTime[1].split(':')[1]/parseFloat(60)) - ((stime[1]/parseFloat(60))))*50));
			console.log(eventLength);
			var yPos = ((stime[1]/parseFloat(60))*50) + ((stime[0]-6)*50)
			var xPos = 7 - (Math.abs(sdate[2] - dates.getDate()));
			$('.calendar-body td:nth-child(' + (xPos) + ')').append('<div class="cal-event" style="top:' + yPos + 'px; height:'+ eventLength + 'px">'+json[i]['name']+'<br>' + sdateTime[1] + '<br>' + edateTime[1] + '</div>');
		}
	});

	
	$('.cal-dates th').each(function(){
		$(this).removeClass('cal-nav-select');
		if ($(this).find('.date-num').text() == date.getDate()) {
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
				$('.cal-dates th:nth-child(' + i + ')').replaceWith('<th class="cal-nav-select"><span class ="date-num">' + (dates.getDate()) + '</span><span class="date-day">' + weekDay[dates.getDay()] + '<bR>' + monthName[dates.getMonth()] + '</span></th>');

			} else {
				$('.cal-dates th:nth-child(' + i + ')').replaceWith('<th><span class ="date-num">' + (dates.getDate()) + '</span><span class="date-day">' + weekDay[dates.getDay()] + '<bR>' + monthName[dates.getMonth()] + '</span></th>');
			}
		}

		postDates(weekofEvents).complete(function(xhr, textStatus) {  
		var results = xhr.responseText;
		var json = JSON.parse(results);
		console.log(results);
		for (i=0; i < json.length; i++) {
			var sdateTime = json[i]['start'].split('T');
			var edateTime = json[i]['end'].split('T');
			var sdate = sdateTime[0].split('-');
			var stime = sdateTime[1].split(':');
			var eventLength = ((edateTime[1].split(':')[0] - stime[0])*50) + ((((edateTime[1].split(':')[1]/parseFloat(60)) - ((stime[1]/parseFloat(60))))*50));
			console.log(eventLength);
			var yPos = ((stime[1]/parseFloat(60))*50) + ((stime[0]-6)*50)
			var xPos = 7 - (Math.abs(sdate[2] - dates.getDate()));
			$('.calendar-body td:nth-child(' + (xPos) + ')').append('<div class="cal-event" style="top:' + yPos + 'px; height:'+ eventLength + 'px">'+json[i]['name']+'<br>' + sdateTime[1] + '<br>' + edateTime[1] + '</div>');
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
				$('.cal-dates th:nth-child(' + i + ')').replaceWith('<th class="cal-nav-select"><span class ="date-num">' + (dates.getDate()) + '</span><span class="date-day">' + weekDay[dates.getDay()] + '<bR>' + monthName[dates.getMonth()] + '</span></th>');

			} else {
			$('.cal-dates th:nth-child(' + i + ')').replaceWith('<th><span class ="date-num">' + (dates.getDate()) + '</span><span class="date-day">' + weekDay[dates.getDay()] + '<bR>' + monthName[dates.getMonth()] + '</span></th>');
			}
		}
		
		postDates(weekofEvents).complete(function(xhr, textStatus) {  
		var results = xhr.responseText;
		var json = JSON.parse(results);
		console.log(results);
		for (i=0; i < json.length; i++) {
			var sdateTime = json[i]['start'].split('T');
			var edateTime = json[i]['end'].split('T');
			var sdate = sdateTime[0].split('-');
			var stime = sdateTime[1].split(':');
			var eventLength = ((edateTime[1].split(':')[0] - stime[0])*50) + ((((edateTime[1].split(':')[1]/parseFloat(60)) - ((stime[1]/parseFloat(60))))*50));
			console.log(eventLength);
			var yPos = ((stime[1]/parseFloat(60))*50) + ((stime[0]-6)*50)
			var xPos = 7 - (Math.abs(sdate[2] - dates.getDate()));
			$('.calendar-body td:nth-child(' + (xPos) + ')').append('<div class="cal-event" style="top:' + yPos + 'px; height:'+ eventLength + 'px">'+json[i]['name']+'<br>' + sdateTime[1] + '<br>' + edateTime[1] + '</div>');
		}
	});
		$(".cal-dates th").click(function(){
			$(".cal-dates th").removeClass("cal-nav-select");
			$(this).toggleClass("cal-nav-select");
		});

	});
});
