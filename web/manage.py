import os
import unittest

from flask_script import Manager
from main import create_app, db, redis
from main.models import Message

app = create_app()
manager = Manager(app)

@manager.command
def recreate_db():
    db.drop_all()
    db.create_all()
    db.session.commit()

@manager.command
def delete_redis():        
    redis.flushdb()

@manager.command
def test():
    os.environ['TESTING'] = '1'
    tests = unittest.TestLoader().discover('main/test','test*.py')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        return 0
    return 1

@manager.command
def seed_db():
    message = Message(text="hello world")
    db.session.add(message)
    db.session.commit()

if __name__ == '__main__':
    manager.run()