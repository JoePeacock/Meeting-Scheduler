import requests
import tornado.database
from flask import Flask 

app = Flask(__name__)
app.debug= True


@app.before_request
def open_db():
	g.db = database.Connection(config.DB_HOST,
							 config.DB_NAME,
							 config.DB_USER,
							 config.DP_PASSWD)


@app.after_request
def close_db(response):
	g.db.close()
	return response


@app.route('/', methods=['GET', 'POST'])
def hello():
	if request.method == 'GET':
		search = flask.request.form['searchquery']
		user_list = g.db.iter('select * from users where username like %' +  search + '%' +' or title like %' + search +'%' )
	else:
		user_list = g.db.iter('select * from users')		
	return flask.render_template('index.html', user_list = user_list)


@app.route('/<username>', methods=['GET', 'POST'])
def view_Calendar(username):
	events = []
	calendar = g.db.iter('select * from events')
	for event in calendar:
		item = event['name'] + ' ' + event['date'] + ' ' + event['start'] + ' ' + event['end']
		events.append(item)
	return flask.render_template('view_Calendar', events = events)


@app.route('/addEvent/<username>', methods=['POST'])
def add_Event(username):
	if g.db.check_user(username):
		if request.method == 'POST':
			pass
			#variable from request.form to add to database where username == username
	else:
		error = "User was not found in our databse. Please Select a User"
		flask.render_template('404.html', error = error)





