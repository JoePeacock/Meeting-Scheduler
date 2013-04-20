/*

This Meeting Scheduler is written by Joseph Peacock CEN/EE 2016' 
For the University at Buffalo (SUNY) - Computer Science and Engineering Department 

Date: Janurary 2013 
Author: Joseph Peacock 
Contact: japeacoc@buffalo.edu
Page: calendar.sql

*/
CREATE TABLE IF NOT EXISTS users (
	id SERIAL,
	name VARCHAR(255),
	username VARCHAR(255),
	title VARCHAR(255),
	dateadded DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
	id SERIAL,
	name VARCHAR(255),
	location VARCHAR(255),
	description TEXT,
	start TIMESTAMP,
	end TIMESTAMP,
	calid INT(8)
);


CREATE TABLE IF NOT EXISTS posts (
	id SERIAL,
	name VARCHAR(255),
	song TEXT,
	url VARCHAR(255),
	date TIMESTAMP,
);