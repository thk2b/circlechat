from main import io

@io.on('connect')
def connect():
    print('connected')