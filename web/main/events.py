from flask_socketio import send

from main import io


@io.on('connect')
def connect():
    pass

@io.on('ping')
def ping():
    send('pong', json='true')

