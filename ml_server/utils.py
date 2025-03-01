import os
import requests
from dotenv import load_dotenv

load_dotenv()
ONDEMAND_API_KEY = os.getenv('ONDEMAND_API_KEY')

user_sessions = {}

def get_headers():
    return {
        'apikey': ONDEMAND_API_KEY,
        'Content-Type': 'application/json'
    }

def get_or_create_session(external_user_id: str):
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
    response_data = response.json()
    
    session_id = response_data['data']['id']
    user_sessions[external_user_id] = session_id
    return session_id

def send_query(session_id: str, query: str, plugin_ids: list):
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
