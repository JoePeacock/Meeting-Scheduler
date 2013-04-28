/* This Meeting Schedule is written by Joseph Peacock CEN/EE 2016' 
For the University at Buffalo (SUNY) - Computer Science and Engineering Department 

Date: April 2013 
Author: Joseph Peacock 
Contact: japeacoc@buffalo.edu
Page: events.js

*/

function formatTime(timePos) {
	if (timePos[0] > 12) {
		if(timePos[1] == '00') {
			timePos[0] = (timePos[0] - 12) + 'p';
		} else {
			timePos[0] = (timePos[0] - 12) + ':' + timePos[1] + 'p'
		}		
	} else {
		if (timePos[1] == '00') {1
			timePos[0] = timePos[0] + 'a';
		} else {
			timePos[0] = timePos[0] + ':' + timePos[1] + 'a';
		}
	}
	if (timePos[0] == '12') {
			timePos[0] += 'p';
	}

	return timePos[0]
}


function eventFormat(eventsarray) {
	this.eventsarray = eventsarray;
	this.json = JSON.parse(eventsarray);
	this.sdateTime;
	this.edateTime;
	this.date;
	this.stime;
	this.etime;
	this.dateTime;
	this.date;
}

eventFormat.prototype.size = function() {
	return this.json.length;
};

eventFormat.prototype.sDateTime = function(i) {
	this.sdateTime = this.json[i]['start'].split('T');
	this.date = this.sdateTime[0].split('-');
	return this.sdateTime;
};

eventFormat.prototype.eDateTime = function(i) {
	this.edateTime = this.json[i]['end'].split('T');
	return this.edateTime;
};

eventFormat.prototype.startTime = function(i) {
	this.stime = this.sdateTime[1].split(':');
  	var sdateTime = this.json[i]['start'].split('T');
	var stime = sdateTime[1].split(':');
	return formatTime(stime);
};	

eventFormat.prototype.endTime = function(i) {
	this.etime = this.edateTime[1].split(':');
	var edateTime = this.json[i]['end'].split('T');
	var etime = edateTime[1].split(':');
	return formatTime(etime);
};

eventFormat.prototype.getXPos = function(day) {
	diff = Math.ceil(Math.abs((7 - (Math.abs(this.date[2] - day)))));
	if (diff > 6) {
		diff = diff-16;
	}
	return diff;
};

eventFormat.prototype.getYPos = function() {
	return ((this.stime[1]/parseFloat(60))*50) + ((this.stime[0]-6)*50);
};

eventFormat.prototype.eventLength = function(i) {
	return ((this.etime[0] - this.stime[0])*50) + ((((this.etime[1]/parseFloat(60)) - ((this.stime[1]/parseFloat(60))))*50));
};

eventFormat.prototype.Name = function(i) {
	return this.json[i]['name'];
};

eventFormat.prototype.id = function(i) {
	return this.json[i]['id'];
};

