from flask import Blueprint

api_blueprint = Blueprint('api', __name__)

import main.api.ping
import main.api.message
import main.api.messages
