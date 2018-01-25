from flask import jsonify

from main import db
from main.models import Message
from main.api import api_blueprint

@api_blueprint.route('/messages', methods=['GET'])
def get_messages():
    try:
        messages = Message.query.all()
        return jsonify({
            'status': 'success',
            'messages': [{
                'id': message.id,
                'text': message.text,
                'created_at': message.created_at
            } for message in messages]
        })
    except Exception as e:
        return jsonify({
            'status': 'fail',
            'message': 'Database error.'
        }), 500