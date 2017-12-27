from flask import Blueprint, jsonify, request

from main import db
from main.api.models import Message

api_blueprint = Blueprint('api', __name__)

@api_blueprint.route('/ping')
def ping_pong():
    return jsonify({
        'status': 'success',
        'message': 'pong'
    }), 200

@api_blueprint.route('/message', methods=['POST'])
def post_message():
    data = request.get_json()
    if not (data and data.get('text', None)):
        return jsonify({
            'status': 'fail',
            'message': 'Invalid data.'
        }), 400

    text = data.get('text')
    try: 
        message = Message(text=text)
        db.session.add(message)
        db.session.commit()
        return jsonify({
            'status': 'success',
            'message': {
                'id': message.id,
                'text': message.text,
                'created_at': message.created_at
            }
        }), 201
    except Exception as e:
        return jsonify({
            'status': 'fail',
            'message': 'Database error.'
        }), 500

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