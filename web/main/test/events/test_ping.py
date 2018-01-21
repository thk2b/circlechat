from main.test.base import BaseUnitTest

class TestPingMessage(BaseUnitTest):
    def test_ping(self):
        client = self.create_io_client()
        client.get_received()
        
        client.emit('PING')

        received = client.get_received()
        
        client.disconnect()

        self.assertIn('PONG', received[0]['name'])
        self.assertEqual( 1, len(received))
