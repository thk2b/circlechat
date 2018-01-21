import os

from flask import Flask
# from flask_cors import CORS
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
import redis

db = SQLAlchemy()
if os.getenv('TESTING', False) == '1':
    redis = redis.StrictRedis('redis', 6379, 1)
else: redis = redis.StrictRedis('redis')
io = SocketIO()

def create_app():
    app = Flask(__name__)

    # if 'CORS' in os.environ:
        # CORS(app)
    
    config = os.environ.get('CONFIG')
    app.config.from_object(config)
    
    db.init_app(app)
    from main.api import api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api')
    
    import main.events
    io.init_app(app)
    
    return app