import json

from main.test.base import BaseUnitTest

class TestMessageEndpoint(BaseUnitTest):
    ENDPOINT = '/api'
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