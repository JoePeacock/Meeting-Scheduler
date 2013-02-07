import _mysql
import sys

class DBConnection():
	def __init__(self):
		self.db = _mysql.connect('localhost', 'user', 'pass', 'database')
		self.cur = self.db.cursor()


	#Void Return Adds Event
	def add_user(self, name, title):
		username = name.replace(' ', '').lower()
		self.update('INSERT INTO users (name, username, title) VALUES (%s, %s)', (name, username, title))

	def get_users(self, search):
		search = search.replace(' ', '').lower()
		if search is None:
			return self.select('SELECT * FROM users')
		else:
			return self.select('SELECT * FROM usere WHERE username LIKE %s OR title LIKE %s', [%search%, %search%])

	
	#Void Return Adds Event		
	#Start and End variable are TIMESTAMP same date different times. Convert timezones
	def add_event(self, username, description, location, start, end):
		userid = self.select('SELECT id FROM users WHERE username = %s)', [username])
		self.update('INSERT INTO events (name, description, location, start, end, userid)', 
			(name, description, location, start, end, userid))

	
	def update_event(self, id):
		#TODO
		pass

	
	def get_Calendar(self, username):
		userid = self.select('SELECT id FROM users WHERE username = %s', [username])
		return self.select('SELECT * FROM events WHERE userid = %s ORDER BY TIMESTAMP', [userid])


	def select(self, query, params=None):
		#TODO
		pass
