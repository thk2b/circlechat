import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    if 'CORS' in os.environ:
        CORS(app)
    
    config = os.environ.get('CONFIG')
    app.config.from_object(config)
    
    db.init_app(app)
    
    from main.api.views import api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api')

    return app