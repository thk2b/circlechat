from main.test.base import BaseUnitTest

class TestOnlineUsersCount(BaseUnitTest):
    def test_online_users_count(self):
        client = self.create_io_client()

        client.get_received()

        client1 = self.create_io_client()

        received = client.get_received()

        self.assertTrue(1 <= len(received))
        count = received[0]['args'][0]
        self.assertEqual(2, count)
        
        client1.disconnect()

        received = client.get_received()
        count = received[0]['args'][0]
        self.assertEqual(1, count)

        client.disconnect()