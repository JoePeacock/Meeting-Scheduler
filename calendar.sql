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