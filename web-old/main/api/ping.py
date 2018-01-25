from flask import jsonify

from main.api import api_blueprint

@api_blueprint.route('/ping', methods=['GET'])
def ping():
    return jsonify({
        "status": "success",
        "message": "pong"
    }), 200