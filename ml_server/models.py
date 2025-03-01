from pydantic import BaseModel
from typing import List

class QueryRequest(BaseModel):
    external_user_id: str
    query: str

class ChatResponse(BaseModel):
    answer: str

class StocksQueryRequest(BaseModel):
    external_user_id: str
    stocks_name: str

class NewsChatResponse(BaseModel):
    summary: str
    sentiment: str

class YouTubeResponse(BaseModel):
    videos: List[str]

class AnalysisResponse(BaseModel):
    report: str
