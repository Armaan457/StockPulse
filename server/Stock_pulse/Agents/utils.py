import os
import requests
from django.conf import settings

# User sessions stored in memory (consider using Django cache or database for production)
user_sessions = {}


def get_headers():
    """Get headers for OnDemand API requests"""
    return {
        'apikey': getattr(settings, 'ONDEMAND_API_KEY', os.getenv('ONDEMAND_API_KEY')),
        'Content-Type': 'application/json'
    }


def get_or_create_session(external_user_id: str):
    """Get existing session or create a new one for the user"""
    if external_user_id in user_sessions:
        print("Using existing session")
        return user_sessions[external_user_id]

    print("Creating new session")
    create_session_url = 'https://api.on-demand.io/chat/v1/sessions'
    create_session_body = {
        "pluginIds": [],
        "externalUserId": external_user_id
    }

    response = requests.post(create_session_url, headers=get_headers(), json=create_session_body)
    response.raise_for_status()
    response_data = response.json()
    
    session_id = response_data['data']['id']
    user_sessions[external_user_id] = session_id
    return session_id


def send_query(session_id: str, query: str, plugin_ids: list):
    """Send a query to the OnDemand API"""
    submit_query_url = f'https://api.on-demand.io/chat/v1/sessions/{session_id}/query'
    submit_query_body = {
        "endpointId": "predefined-openai-gpt4o",
        "query": query,
        "pluginIds": plugin_ids,
        "responseMode": "sync"
    }

    response = requests.post(submit_query_url, headers=get_headers(), json=submit_query_body)
    response.raise_for_status()
    
    return response.json()["data"]["answer"]
