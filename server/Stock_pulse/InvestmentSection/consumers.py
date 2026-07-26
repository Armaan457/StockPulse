import json
from channels.generic.websocket import AsyncWebsocketConsumer

class CommunityConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = "community_chatroom"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        # print(f"Connection accepted: {self.channel_name}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        # print(f"Connection closed: {self.channel_name} with code {close_code}")

    async def receive(self, text_data):
        # print(f" Received message payload: {text_data}")
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json['message']

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                }
            )
            # print(f"Broadcasted message to group: {message}")
        except Exception as e:
            # print(f"Error in receive: {e}")
            pass

    async def chat_message(self, event):
        message = event['message']
        # print(f"Sending event message to client: {message}")
        await self.send(text_data=json.dumps({ 
            'message': message
        }))
