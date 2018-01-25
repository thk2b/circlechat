from flask import jsonify, request

from main import db
from main.models import Message
from main.api import api_blueprint

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
