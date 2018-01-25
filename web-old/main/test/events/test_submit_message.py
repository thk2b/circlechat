from json import loads
from main.test.base import BaseUnitTest
from main.models.message import Message

class TestSubmitMessage(BaseUnitTest):
    EVENT_NAME = 'SUBMIT_MESSAGE'
    def test_submit_invalid_data(self):
        data = {'invalid': 'meow'}
        client = self.create_io_client()
        client.get_received()
        client.emit(self.EVENT_NAME, data)
        
        self.assertEqual(0, len(client.get_received()))
        client.disconnect()

    def test_submit_empty_text(self):
        data = {'text':''}
        client = self.create_io_client()
        client.get_received()
        client.emit(self.EVENT_NAME, data)

        self.assertEqual(0, len(client.get_received()))
        client.disconnect()

    def test_submit_invalit_text_type(self):
        data = {'text':None}
        client = self.create_io_client()
        client.get_received()
        client.emit(self.EVENT_NAME, data)

        self.assertEqual(0, len(client.get_received()))
        client.disconnect()
        
    def test_submit_valid_text(self):
        sender = self.create_io_client()
        receiver = self.create_io_client()
        sender.get_received()
        receiver.get_received()

        data = {'text': 'testing testing 123'}
        sender.emit(self.EVENT_NAME, data)

        # should emit message to sender and other clients
        received_message_sender = loads(sender.get_received()[0]['args'][0])['message']
        recieved_message_receiver = loads(receiver.get_received()[0]['args'][0])['message']
        self.assertEqual(recieved_message_receiver, received_message_sender)
        # should add to db
        saved_message = Message.query.filter_by(id=received_message_sender['id']).first()
        self.assertEqual({
            'id': saved_message.id,
            'text': saved_message.text,
            'created_at': saved_message.created_at,
        }, received_message_sender)
        
        sender.disconnect()
        receiver.disconnect()