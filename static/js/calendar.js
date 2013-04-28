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
	$("#appendedInputButton").keyup(function() {
		put("q=" + $(this).val()).complete(function(xhr, textStatus) {
			var res = JSON.parse(xhr.responseText);
			console.log(res.length);
			$('#results').empty();
			if (res.length > 0) {
				for (i =0; i < 5; i++) {
					if (res[i] != null) {
						$('#results').append('<li><a href="/addevent/' + res[i]['username'] + 
							'" name="' + res[i]['username'] + '">' 
						+ res[i]['name'] + '</a><br><span>' + res[i]['title'] + '</span></div></div></li>');

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

	$('#results li a').click(function(){
		eventType;
		name = $(this).attr("name");
		console.log(name);
		$(this).attr('href', url + name + "?eventType=" + eventType);
		// Doesnt work
	});

	var page = window.location.href.match(/.*\?(.*)/)[1];
	var splitArray = page.split('=');
	$('.step2').append('<input type="hidden" name="' + splitArray[0] + '" value="' + splitArray[1] + '">');


});

/*$(document).ready(function(){

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
		"6:00 pm",
	];


	
	$('.container #eventDate').datepicker();
	

	$('.timeinput').focus(function(){
		$(this).autocomplete({
			source:times
		});
	});


});*/
