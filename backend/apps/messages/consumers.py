from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Conversation, Message


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'chat_{self.conversation_id}'
        
        if not self.user.is_authenticated:
            await self.close()
            return
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
    
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive_json(self, content):
        message_type = content.get('type')
        
        if message_type == 'chat_message':
            message = await self.save_message(content['message'])
            
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message
                }
            )
    
    async def chat_message(self, event):
        await self.send_json({
            'type': 'chat_message',
            'message': event['message']
        })
    
    @database_sync_to_async
    def save_message(self, content):
        message = Message.objects.create(
            conversation_id=self.conversation_id,
            sender=self.user,
            content=content
        )
        return {
            'id': message.id,
            'sender': self.user.username,
            'content': message.content,
            'created_at': message.created_at.isoformat()
        }
