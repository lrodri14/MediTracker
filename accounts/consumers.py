from channels.consumer import SyncConsumer
from channels.exceptions import StopConsumer
from asgiref.sync import async_to_sync
import json


class WSNotifications(SyncConsumer):

    def websocket_connect(self, event):
        group_name = self.scope['user'].username + '_notifications_group'
        async_to_sync(self.channel_layer.group_add)(group_name, self.channel_name)
        self.send({
            'type': 'websocket.accept'
        })

    def websocket_receive(self, event):
        data = json.loads(event['text'])
        nf_type = data['nf_type']
        to = data['to']
        if nf_type == 'contact_request':
            message = data['message'] + self.scope['user'].username
        elif nf_type == 'contact_request_accepted':
            message = self.scope['user'].username + data['message']
        elif nf_type == 'appointment_created':
            message = data['message'] + self.scope['user'].username
        elif nf_type == 'appointment_update':
            message = data['message']
        group_receiver = to + '_notifications_group'
        async_to_sync(self.channel_layer.group_send)(group_receiver, {
            'type': 'notification',
            'text': message
        })

    def websocket_disconnect(self, event):
        group_name = self.scope['user'].username + '_notifications_group'
        async_to_sync(self.channel_layer.group_discard)(group_name, self.channel_name)
        self.send({
            'type': 'websocket.close'
        })
        raise StopConsumer

    def notification(self, event):
        self.send({
            'type': 'websocket.send',
            'text': event['text']
        })