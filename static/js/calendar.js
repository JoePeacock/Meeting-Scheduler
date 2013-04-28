/*

This Meeting Scheduler is written by Joseph Peacock CEN/EE 2016' 
For the University at Buffalo (SUNY) - Computer Science and Engineering Department 

Date: Janurary 2013 
Author: Joseph Peacock 
Contact: japeacoc@buffalo.edu
Page: calendar.js  */

function put(data) {
	return $.ajax({
	        type: "GET",
	        url: "/search/query",
	        data: data,	           
	});
}

$(document).ready(function() {
		var times = [
		"8:00 am",
		"8:30 am",
		"9:00 am",
		"9:30 am",
		"10:00 am",
		"10:30 am",
		"11:00 am",
		"11:30 am",
		"12:00 pm",
		"12:30 pm",
		"1:00 pm",
		"1:30 pm",
		"2:00 pm",
		"2:30 pm",
		"3:00 pm",
		"3:30 pm",
		"4:00 pm",
		"4:30 pm",
		"5:00 pm",
		"5:30 pm",
		"6:00 pm"
	];

	$('.datepicker').datepicker();


	$('.timeinput').focus(function(){
		$(this).autocomplete({
			source:times
		});
	});

	$("#appendedInputButton").keyup(function() {
		put("q=" + $(this).val()).complete(function(xhr, textStatus) {
			var res = JSON.parse(xhr.responseText);
			$('#results').empty();
			if (res.length > 0) {
				for (i =0; i < 5; i++) {
					if (res[i] != null) {
						var name = res[i]['name'];
						console.log(name);
						$('#results').append('<li><a  name="' + res[i]['username'] + '">' 
						+ res[i]['name'] + '</a><br><span>' + res[i]['title'] + '</span></div></div></li>');
						$('#results li a').click(function(){
							var eventType;
							username = $(this).attr("name");
							$(this).attr('href', url + username + "?eventType=" + eventType + '&name=' + name);
						});
					}
				}	 
			} else {
				$('#results').append('<li><h5>No results were found for your search</h5></li>');
			}
	    });  


	});		

	var url = window.location.href;

	$('.event-types li a').click(function() {
		eventType= $(this).attr("name");
		$(this).attr('href', url + "general?eventType=" + eventType);
	});

	var page = window.location.href.match(/.*\?(.*)/)[1];
	var splitArray = page.split('=');
	var again = splitArray[1].split('&');
	splitArray[1] = again[0];
	var eType = String(splitArray[1]).replace(/%20/g, " ");

	if (splitArray[1] != "undefined") {
		$('.topinfo').prepend('<h3>Creating event: ' + eType + '</h3>');
	} else {
		$('.topinfo').prepend('<h3>Creating event for: ' + splitArray[2].replace(/%20/g, " ") + '</h3>');

	}
	$('.step2').append('<input type="hidden" name="' + splitArray[0] + '" value="' + eType + '">');



});
