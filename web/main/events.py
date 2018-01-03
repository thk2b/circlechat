import json
from flask_socketio import send, emit

from main import io, db
from main.models import Message


@io.on('connect')
def connect():
    emit('CONNECT_SUCCESS', 'connected scessfully')

@io.on('SUBMIT_MESSAGE')
def submit_message(data):
    text = data['text']
    if text is None:
        return 0
    message = Message(text)
    db.session.add(message)
    db.session.commit()
    
    emit('ADD_MESSAGE', json.dumps({
        'message': {
            'text': message.text,
            'id': message.id,
            'created_at': str(message.created_at)
        }
    }), broadcast=True)
    return 1