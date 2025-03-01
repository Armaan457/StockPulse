from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.tools import YouTubeSearchTool
import ast

from models import QueryRequest, ChatResponse, StocksQueryRequest, NewsChatResponse, YouTubeResponse, AnalysisResponse
from utils import get_or_create_session, send_query

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat", response_model=ChatResponse)
async def chatbot(request: QueryRequest):
    try:
        session_id = get_or_create_session(request.external_user_id)
        query = request.query + " Answer only if the question is from stocks, commodities, and trading, otherwise don't answer."
        answer = send_query(session_id, query, [
            "plugin-1713962163", "plugin-1729875364", "plugin-1728287833",
            "plugin-1726253762", "plugin-1716429542", "plugin-1716434059"
        ])
        return ChatResponse(answer=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/stock-news", response_model=NewsChatResponse)
async def stock_news(request: StocksQueryRequest):
    try:
        session_id = get_or_create_session(request.external_user_id)
        query = f"You are a bot whose job is to provide the summary of the news of a given stock in 1 paragraph only. After this, perform sentiment analysis on the summary and return the answer as positive, negative, or neutral (only 1 word) in the next line.\n{request.stocks_name} stocks news"
        
        answer = send_query(session_id, query, ["plugin-1712327325", "plugin-1713962163", "plugin-1729887147"])
        summary, sentiment = answer.split("\n")[0], answer.split("\n")[-1]

        return NewsChatResponse(summary=summary, sentiment=sentiment)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/videos", response_model=YouTubeResponse)
async def videos(request: StocksQueryRequest):
    try:
        tool = YouTubeSearchTool()
        results = tool.run(request.stocks_name + ", 5")
        videos = ast.literal_eval(results)
        return YouTubeResponse(videos=videos)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/portfolio-analyser", response_model=AnalysisResponse)
async def portfolio_analyser(request: StocksQueryRequest):
    try:
        session_id = get_or_create_session(request.external_user_id)
        query = f"You are a bot designed to provide insights on a portfolio. Analyze the given stocks, suggest weaknesses, and recommend an improved portfolio with an updated list of stocks: {request.stocks_name}"
        
        answer = send_query(session_id, query, [
            "plugin-1712327325", "plugin-1713962163", "plugin-1729875364",
            "plugin-1728314839", "plugin-1728287833", "plugin-1726253762",
            "plugin-1716429542", "plugin-1716434059", "plugin-1729887147"
        ])

        return AnalysisResponse(report=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
