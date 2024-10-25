from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()
ONDEMAND_API_KEY = os.getenv('ONDEMAND_API_KEY')

# In-memory store for user sessions
user_sessions = {}

class QueryRequest(BaseModel):
    external_user_id: str
    query: str

class ChatResponse(BaseModel):
    answer: str
    success : bool

@app.post("/chat", response_model=ChatResponse)
async def create_chat_session_and_query(request: QueryRequest):
    try:
        headers = {
            'apikey': ONDEMAND_API_KEY,
            'Content-Type': 'application/json'
        }

        # Step 1: Check if session exists for the user
        session_id = user_sessions.get(request.external_user_id)

        # Step 2: Create a new session if it doesn't exist
        if not session_id:
            create_session_url = 'https://api.on-demand.io/chat/v1/sessions'
            create_session_body = {
                "pluginIds": [],
                "externalUserId": request.external_user_id
            }

            session_response = requests.post(
                create_session_url, 
                headers=headers, 
                json=create_session_body
            )

            session_data = session_response.json()
            session_id = session_data['data']['id']
            
            # Store the new session ID for the user
            user_sessions[request.external_user_id] = session_id

        # Step 3: Submit Query using the existing or newly created session
        submit_query_url = f'https://api.on-demand.io/chat/v1/sessions/{session_id}/query'
        submit_query_body = {
            "endpointId": "predefined-openai-gpt4o",
            "query": request.query,
            "pluginIds": [
                "plugin-1712327325",
                "plugin-1713962163",
                "plugin-1728287833",
                "plugin-1726253762",
                "plugin-1716429542",
                "plugin-1716434059"
            ],
            "responseMode": "sync"
        }

        query_response = requests.post(
            submit_query_url, 
            headers=headers, 
            json=submit_query_body
        )
        
        if query_response.status_code != 200:
            raise HTTPException(
                status_code=query_response.status_code,
                detail="Failed to submit query"
            )

        query_data = query_response.json()

        return ChatResponse(
            answer=query_data["data"]["answer"],
            success = True
        )

    except requests.RequestException:
        raise HTTPException(status_code=500, detail="Failure")
    except Exception:
        raise HTTPException(status_code=500, detail="Failure")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
