import json
from flask_socketio import send, emit

from main import io, db, redis
from main.models import Message

@io.on('connect')
def connect():
    online_count = redis.incr('online_users_count')
    connections_count = redis.incr('connections_count')
    emit('CONNECT_SUCCESS', 'connected scessfully')
    emit('UPDATE_ONLINE_USERS_COUNT', online_count, broadcast=True)
    emit('UPDATE_CONNECTIONS_COUNT', connections_count, broadcast=True)

@io.on('disconnect')
def disconnect():
    count = redis.incr('online_users_count', -1)
    emit('UPDATE_ONLINE_USERS_COUNT', count, broadcast=True)

@io.on('PING')
def ping():
    emit('PONG')

@io.on('SUBMIT_MESSAGE')
def submit_message(data):
    if not 'text' in data:
        return 0
    text = data['text']
    if text is None or len(text) is 0:
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