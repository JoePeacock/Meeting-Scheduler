import requests
import os
import flask
import datetime
import time

from tornado.database import Connection
from flask import Flask, g 

import config

app = Flask(__name__)
app.debug= True
app.config['TRAP_BAD_REQUEST_ERRORS'] = True


@app.before_request
def open_db():
	g.db = Connection(config.DB_HOST,
							 config.DB_NAME,
							 config.DB_USER,
							 config.DB_PASSWD)


@app.after_request
def close_db(response):
	g.db.close()
	return response


@app.route('/', methods=['POST', 'GET'])
def hello():
	if flask.request.method == 'POST':
		search = flask.request.form['searchquery']
		s = search.lower().replace(' ', '')
		s = "%"+s+"%"
		user_list = g.db.query('SELECT * FROM users WHERE username LIKE %s', s)
	else:
		user_list = g.db.iter('select * from users')		
	return flask.render_template('index.html', user_list = user_list)


@app.route('/calendar/<username>')
def view_Calendar(username):

	events = []
	calendar = g.db.iter('select * from events')
	for event in calendar:
		item = event['name'] + ' ' + event['date'] + ' ' + event['start'] + ' ' + event['end']
		events.append(item)
	return flask.render_template('addevent.html', events = events)




@app.route('/addevent/<username>', methods=["GET", "POST"])
def addEvent(username):
	message = None;
	values = g.db.get('SELECT username, id from users where username = %s', username) 
	if len(values) == 0:
		error =  "No User! It seems that you were trying to acces a page that doesn't exist!"
		return flask.render_template("404.html", error=error)
	else:
		if flask.request.method == 'POST':
			title = flask.request.form['eventTitle']
			desc = flask.request.form['eventDesc']
			location = flask.request.form['eventLocation']
			date = flask.request.form['eventDate'].replace("/", '')
			start = flask.request.form['startTime'].replace(":", '').replace(" ", '')
			end = flask.request.form['endTime'].replace(":", '').replace(" ", '')
			startdaytime = datetime.datetime.strptime(date+start, "%m%d%Y%I%M%p")
			enddaytime = datetime.datetime.strptime(date+end, "%m%d%Y%I%M%p")
			calid = values["id"]
			addevent = g.db.execute('INSERT INTO events (name, location, description, start, end, calid) values (%s, %s, %s, %s, %s, %s)', title, location, desc, startdaytime, enddaytime, calid)
			if addevent:
				message = "Event added succesfully"
		return flask.render_template("addevent.html", message=message)	

	# if g.db.iter('SELECT username FROM users where username = %s', username) == None:
	# 	error = "User was not found in our databse. Please Select a User"
	# 	#flask.render_template('404.html', error = error)
	
		

@app.route('/adduser', methods=['POST', 'GET'])
def addUser():
	error = None
	output = None
	if flask.request.method == 'POST':
		name = flask.request.form['userName']
		title = flask.request.form['userTitle']
		username = name.lower().replace(' ', '')
		datetoday = datetime.date.today()
		checkuser = g.db.query('SELECT username FROM users WHERE username = %s', username)
		if checkuser:
			error = "There is a user with that name already. Please try again."
		else:
			query = g.db.execute('INSERT INTO users (name, username, title, dateadded) VALUES (%s, %s, %s, %s)', name, username, title, str(datetoday))
			if query:
				output = "User " + name + " was added succesfully!"
			else:
				error = 'There was an error adding the user to the database'
	return flask.render_template('adduser.html', error=error, output=output)


@app.route('/deleteuser/<int:userid>', methods=["GET"])
def deleteuser(userid):
	g.db.execute('DELETE FROM users WHERE id = %s', userid)
	print "User with id: " + str(userid) + 'was deleted!'
	return flask.redirect(flask.url_for('hello'))


if __name__ == '__main__':
	port = int(os.environ.get('PORT', 5001))
	app.run(host='0.0.0.0', port=port)





