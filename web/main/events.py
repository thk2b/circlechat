from flask_socketio import send, emit

from main import io


@io.on('connect')
def connect():
    emit('action', 'connected scessfully')

@io.on('test')
def test(data):
    emit('message', 'tested')