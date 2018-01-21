from flask_testing import TestCase

from main import create_app, db, io

class BaseUnitTest(TestCase):
    def create_app(self):
        app = create_app()
        app.config.from_object('main.config.TestingConfig')
        # self.app = app
        return app

    def create_io_client(self):
        return io.test_client(self.app)

    def setUp(self):
        db.create_all()
    
    def tearDown(self):
        db.session.remove()
        db.drop_all()