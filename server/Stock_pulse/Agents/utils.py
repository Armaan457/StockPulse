from crewai import Task, Crew, Agent, LLM
import os
from dotenv import load_dotenv

from .Crews.tools import (
    get_company_news_summaries,
    get_stock_with_indicators,
)

load_dotenv()

llm = LLM(
    model="groq/llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
)

chatbot_agent = Agent(
    role="Financial and Stock Assistant Chatbot",
    goal="""
    Answer user queries about stocks and finance accurately.
    Use tools for live prices, recent news, and other time-sensitive data.
    Use your own knowledge for static finance facts, common ticker/company mappings, and general finance explanations.
    You MUST decline any question that is clearly not finance or stock related.
    """,
   backstory="""
    You are a financial and stock assistant.

    Rules:
    - Treat questions about tickers, stock symbols, listed companies, prices, charts, earnings, market data, financial metrics, investing, and general finance as finance-related
    - Infer the finance or stock relation from the wording when the intent is clear
    - If the user asks for a ticker symbol, company name, exchange listing, or a similar static finance fact, answer directly from your knowledge without refusing
    - If a question is clearly outside finance and stocks, politely refuse in one short sentence
    - Use get_stock_with_indicators with period="5d", interval="1d" for live or recent prices/data
    - Use get_company_news_summaries for recent news
    - Never return raw tool output (JSON, dicts, arrays, keys, or debug text) to the user
    - Convert tool results into a clean natural-language answer before responding
    - Never fabricate live or recent data; if you do not need a tool, answer from your own knowledge
    - Answer only what the user explicitly asked, and nothing else
    - Keep answers concise (1 para maximum)
    """,
    llm=llm,
    tools=[get_company_news_summaries, get_stock_with_indicators],
    verbose=False,
    allow_delegation=False,
    max_iter=5
)

chat_task = Task(
    description="""
    Conversation History:
    {history}

    User Query: {query}

    Instructions:
    - Analyze the query carefully
    - Use conversation history for context if needed
    - First classify whether the query is finance or stock related
    - If the intent is clearly finance or stock related, continue
    - Only refuse briefly if the query is clearly unrelated to finance or stocks
    - Decide whether the question needs live or recent data before using tools
    - If the answer is a static finance fact, answer directly without tools
    - If live or recent data is required, call the appropriate tool
    - After calling any tool, synthesize the result into a plain-language final answer
    - Never copy tool payloads, field names, JSON, or structured blobs into final output
    - DO NOT fabricate stock data
    - Provide a clear and concise final answer
    """,
    agent=chatbot_agent,
    expected_output="""
    A direct answer containing only the exact information asked for.

    Strict Requirements:
    - If the query is outside stocks and finance, output only: "I can only help with finance-related questions."
    - Do not refuse finance questions just because no tool supports the lookup
    - Do not add context, explanations, summaries, or related facts unless the user asked for them
    - Do not mention unrelated market news, competitor updates, or industry trends
    - If tools are used, include only the specific fact requested from the tool output
    - Final output must be human-readable text only, never raw tool output
    - Never output JSON, Python dict/list formatting, markdown code blocks, or tool trace text
    - No external suggestions or follow-up text
    """
)

chat_crew = Crew(
    agents=[chatbot_agent],
    tasks=[chat_task],
    llm=llm,
    verbose=False,
)


def format_history(history: list) -> str:
    last_5 = history[-5:] if len(history) > 5 else history
    return "\n".join(
        [f"{msg['role']}: {msg['content']}" for msg in last_5]
    )

def run_chatbot(query: str, history: list) -> str:
    formatted_history = format_history(history)    
    result = chat_crew.kickoff(
        inputs={
            "query": query,
            "history": formatted_history
        }
    )
    return result.raw.strip()