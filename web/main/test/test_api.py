import json

from main import db
from main.api.models import Message
from main.test.base import BaseUnitTest

class TestApi(BaseUnitTest):
    ENDPOINT = '/api'
    def test_get_ping_endpoint_with_valid_request(self):
        with self.client:
            res = self.client.get(f'{self.ENDPOINT}/ping')
            self.assert_200(res)
            data = json.loads(res.data)
            self.assertIn('success', data['status'])
            self.assertIn('pong', data['message'])
    
    def test_post_message_with_valid_data(self):
        with self.client:
            res = self.client.post(
                f'{self.ENDPOINT}/message',
                data=json.dumps({ 'text': 'test' }),
                content_type='application/json'
            )
            self.assertEqual(res.status_code, 201)
            data = json.loads(res.data)
            self.assertIn('success', data['status'])
            self.assertTrue('id' in data['message'])
            self.assertIn('test', data['message']['text'])

    def test_post_message_with_no_data(self):
        with self.client:
            res = self.client.post(f'{self.ENDPOINT}/message')
            self.assertEqual(res.status_code, 400)
            data = json.loads(res.data)
            self.assertIn('fail', data['status'])
            self.assertIn('Invalid data.', data['message'])

    def test_post_empty_message(self):
        with self.client:
            res = self.client.post(
                f'{self.ENDPOINT}/message',
                data=json.dumps({'message': None}),
                content_type='application/json'
            )
            self.assertEqual(res.status_code, 400)
            data = json.loads(res.data)
            self.assertIn('fail', data['status'])
            self.assertIn('Invalid data.', data['message'])

    def test_post_message_with_invalid_data(self):
        with self.client:
            res = self.client.post(
                f'{self.ENDPOINT}/message', 
                data=json.dumps({ 'wrong': 'wrong' }),
                content_type='application/json'
            )
            self.assertEqual(res.status_code, 400)
            data = json.loads(res.data)
            self.assertIn('fail', data['status'])
            self.assertIn('Invalid data.', data['message'])

    def test_post_message_with_no_json(self):
        with self.client:
            res = self.client.post(
                f'{self.ENDPOINT}/message', 
                data='wrong'
            )
            self.assertEqual(res.status_code, 400)
            data = json.loads(res.data)
            self.assertIn('fail', data['status'])
            self.assertIn('Invalid data.', data['message'])

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