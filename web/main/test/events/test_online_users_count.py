from main.test.base import BaseUnitTest

class TestOnlineUsersCount(BaseUnitTest):
    def test_online_users_count(self):
        client = self.create_io_client()
        pre_count = None
        for event in client.get_received():
            if event['name'] == 'UPDATE_ONLINE_USERS_COUNT':
                pre_count = event['args'][0]

        client1 = self.create_io_client()

        received = client.get_received()
        self.assertTrue(1 <= len(received))
        count = received[0]['args'][0]
        self.assertEqual(pre_count + 1, count)
        
        client1.disconnect()

        received = client.get_received()
        count = received[0]['args'][0]
        self.assertEqual(pre_count, count)

        client.disconnect()