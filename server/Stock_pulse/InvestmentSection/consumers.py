import json
from channels.generic.websocket import AsyncWebsocketConsumer

class CommunityConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # creating the WebSocket connection to automatically join the "community_chatroom"
        self.room_group_name = "community_chatroom"

        # Add this WebSocket connection to the group
        await self.channel_layer.group_add( # Channel layer here = the InMemoryChannelLayer of Django
            self.room_group_name,
            self.channel_name # channel_name = current WebSocket connection
        )

        # Accept this WebSocket connection
        await self.accept()

    async def disconnect(self, close_code):
        # Remove the connection from the group - happens when user leaves the chatgroup
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive a message from the WebSocket
    async def receive(self, text_data):
        # Parse the incoming JSON message (text_data)
        text_data_json = json.loads(text_data) # json.loads() converts the JSON string to Python dicionary
        message = text_data_json['message'] # accessing the message from the text data

        # Broadcast the message to everyone in the group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',  # This tells Django Channels which method to call when message is received by group
                'message': message,
            }
        )

    # This method handles sending the message to the WebSocket clients
    async def chat_message(self, event):
        message = event['message'] # extracting the message from the event dictionary
        # event dictionary contains message originally broadcasted to group

        # Send the message to the WebSocket
        await self.send(text_data=json.dumps({ 
            #json.dumps() convers the python dict to JSON
            'message': message
        }))
