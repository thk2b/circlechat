from datetime import datetime
from uuid import uuid4

from main import db

class Message(db.Model):
    __tablename__ = 'messages'
    id = db.Column(db.String, primary_key=True, nullable=False)
    text = db.Column(db.String(492), nullable=False)
    created_at = db.Column(db.String(), nullable=False)

    def __init__(self, text):
        self.id = str(uuid4())
        self.text = text
        self.created_at = datetime.utcnow()