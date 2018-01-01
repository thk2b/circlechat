import json

from main.test.base import BaseUnitTest

class TestPingEndpoint(BaseUnitTest):
    ENDPOINT = '/api'
    def test_get_ping(self):
        with self.client:
            res = self.client.get(f'{self.ENDPOINT}/ping')
            self.assert_200(res)
            data = json.loads(res.data)
            self.assertIn('success', data['status'])
            self.assertIn('pong', data['message'])