$(document).ready(function(){

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


	
	$('#eventDate').datepicker();
	

	$('.timeinput').focus(function(){
		$(this).autocomplete({
			source:times
		});
	});


});