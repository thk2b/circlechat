import json

from main import db
from main.models import Message
from main.test.base import BaseUnitTest

class TestMessagesEndPoint(BaseUnitTest):
    ENDPOINT = '/api'
    def test_messages_endpoint_with_valid_request(self):
            message1 = Message('message1')
            message2 = Message('message2')
            db.session.add_all([message1, message2])
            db.session.commit()

            with self.client:
                res = self.client.get(f'{self.ENDPOINT}/messages')
                self.assert_200(res)
                data = json.loads(res.data)
                self.assertIn('success', data['status'])
                messages = data['messages']
                self.assertIn('message1', messages[0]['text'])
                self.assertIn(message1.id, messages[0]['id'])
                self.assertTrue(message1.created_at, messages[0]['created_at'])
                self.assertIn('message2', messages[1]['text'])
                self.assertIn(message2.id, messages[1]['id'])
                self.assertTrue(message2.created_at, messages[1]['created_at'])