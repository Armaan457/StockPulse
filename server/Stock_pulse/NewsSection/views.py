from django.shortcuts import render
from Stock_pulse.tasks import download_nasdaq_data
# Create your views here.
from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Portfolio
from .serializers import PortfolioSerializer

class PortfolioListCreateView(generics.ListCreateAPIView):
    serializer_class = PortfolioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Portfolio.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PortfolioDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PortfolioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Portfolio.objects.filter(user=self.request.user)


import requests
from django.http import JsonResponse
from django.views import View
from django.conf import settings
import os
from dotenv import loadenv
loadenv()

class ChatSessionView(View):
    def get(self, request, *args, **kwargs):
        # Get or create the external user ID
        external_user_id = request.user.id if request.user.is_authenticated else 'anonymous'

        # Fetch user's areas of interest; assuming they are stored in a list in the User model or a related model
        user_areas_of_interest = request.user.profile.areas_of_interest  # Adjust based on your data model

        # Prepare API key and headers
        create_session_headers = {
            'apikey': os.getenv("API_KEY")
        }
        submit_query_headers = {
            'apikey': settings.API_KEY
        }

        responses = []

        # Iterate over each area of interest
        for interest in user_areas_of_interest:
            # Step 1: Create Chat Session
            create_session_url = 'https://api.on-demand.io/chat/v1/sessions'
            create_session_body = {
                "pluginIds": [],
                "externalUserId": external_user_id
            }

            # Make the request to create a chat session
            session_response = requests.post(create_session_url, headers=create_session_headers, json=create_session_body)
            session_data = session_response.json()

            if 'data' not in session_data:
                responses.append({'interest': interest, 'error': 'Failed to create chat session'})
                continue

            # Extract session ID
            session_id = session_data['data']['id']

            # Step 2: Submit Query for each area of interest
            submit_query_url = f'https://api.on-demand.io/chat/v1/sessions/{session_id}/query'
            submit_query_body = {
                "endpointId": "predefined-openai-gpt4o",
                "query": f"You are a bot whose job is to provide the summary of the news of a given stock in 1 paragraph only. After this perform sentiment analysis on the summary and return the answer as positive, negative, or neutral (only 1 word).\n{interest} stocks news",
                "pluginIds": ["plugin-1712327325", "plugin-1713962163", "plugin-1729887147"],
                "responseMode": "sync"
            }

            # Make the request to submit a query
            query_response = requests.get(submit_query_url, headers=submit_query_headers, json=submit_query_body)
            query_data = query_response.json()

            if 'data' not in query_data:
                responses.append({'error': 'Failed to submit query'})
            else:
                # Append successful response
                answer = query_data['data']['answer']
                responses.append({'answer': answer})

        # Return all responses for each area of interest
        return JsonResponse({'responses': responses})
