from urllib.parse import parse_qs
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
        group_receiver = to + '_notifications_group'
        if nf_type == 'contact_request':
            message = data['message'] + data['created_by']
        elif nf_type == 'contact_request_accepted':
            message = data['created_by'] + data['message']
        elif nf_type == 'appointment_created':
            message = data['message'] + data['created_by']
        elif nf_type == 'appointment_update':
            message = data['message']
        elif nf_type == 'received_message':
            message = data['message']
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

    # Handlers
    def notification(self, event):
        self.send({
            'type': 'websocket.send',
            'text': event['text']
        })


class ChatWS(SyncConsumer):

    def websocket_connect(self, event):
        pk = parse_qs(self.scope['query_string'].decode('utf-8'))['pk'][0]
        group_name = 'chat_room_' + pk
        async_to_sync(self.channel_layer.group_add)(group_name, self.channel_name)
        self.send({
            'type': 'websocket.accept'
        })

    def websocket_receive(self, event):
        data = json.loads(event['text'])
        pk = data['pk']
        message = data['message']
        username = data['username']
        group_receiver = 'chat_room_' + pk
        async_to_sync(self.channel_layer.group_send)(group_receiver, {
            'type': 'message',
            'text': json.dumps({'message': message, 'username': username}),
        })

    def websocket_disconnect(self, event):
        pk = parse_qs(self.scope['query_string'].decode('utf-8'))['pk'][0]
        group_name = 'chat_room_' + pk
        async_to_sync(self.channel_layer.group_discard)(group_name, self.channel_name)
        self.send({
            'type': 'websocket.close'
        })
        raise StopConsumer

    # Handlers
    def message(self, event):
        self.send({
            'type': 'websocket.send',
            'text': event['text'],
        })