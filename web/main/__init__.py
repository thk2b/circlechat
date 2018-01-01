import os

from flask import Flask
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()
io = SocketIO()

def create_app():
    app = Flask(__name__)

    if 'CORS' in os.environ:
        CORS(app)
    
    config = os.environ.get('CONFIG')
    app.config.from_object(config)
    
    io.init_app(app)
    db.init_app(app)
    
    import main.events
    from main.api import api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api')

    return app