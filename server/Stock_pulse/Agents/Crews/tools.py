from typing import List
from datetime import datetime, timedelta
import os
import yfinance as yf
import pandas as pd
from crewai.tools import tool
from dotenv import load_dotenv
import finnhub
load_dotenv()

finnhub_client = finnhub.Client(api_key=os.getenv("FINNHUB_API_KEY"))

@tool
def get_stock_with_indicators(ticker: str, period: str = "3m", interval: str = "1d") -> str:
    """Fetch historical stock data for a ticker and return a string table with technical indicators.

    Args:
        ticker: Stock ticker symbol (e.g. 'AAPL').
        period: Data period to download (passed to yfinance, default '3m').
        interval: Data interval (passed to yfinance, default '1d').

    Returns:
        A string representation of a pandas DataFrame containing the Close price and
        several technical indicators (SMA, EMA, RSI, MACD, Bollinger Bands), or
        an error message string on failure.
    """

    try:
        df = yf.download(ticker, period=period, interval=interval)
        df = df.dropna()
        df['SMA_20'] = df['Close'].rolling(window=20).mean()
        df['SMA_50'] = df['Close'].rolling(window=50).mean()
        df['EMA_20'] = df['Close'].ewm(span=20, adjust=False).mean()
        df['EMA_50'] = df['Close'].ewm(span=50, adjust=False).mean()
        delta = df['Close'].diff()
        gain = delta.clip(lower=0)
        loss = -1 * delta.clip(upper=0)
        avg_gain = gain.rolling(window=14).mean()
        avg_loss = loss.rolling(window=14).mean()
        rs = avg_gain / avg_loss
        df['RSI_14'] = 100 - (100 / (1 + rs))
        ema_12 = df['Close'].ewm(span=12, adjust=False).mean()
        ema_26 = df['Close'].ewm(span=26, adjust=False).mean()
        df['MACD'] = ema_12 - ema_26
        df['MACD_Signal'] = df['MACD'].ewm(span=9, adjust=False).mean()
        df['BB_Middle'] = df['Close'].rolling(window=20).mean()
        df['BB_Std'] = df['Close'].rolling(window=20).std()
        df['BB_Upper'] = df['BB_Middle'] + (2 * df['BB_Std'])
        df['BB_Lower'] = df['BB_Middle'] - (2 * df['BB_Std'])
        return df.to_string()
    except Exception as e:
        return f"An error occurred while fetching stock data: {e}"

@tool
def get_company_news_summaries(ticker: str, days: int = 2) -> List[str]:
    """Retrieve recent company news for a ticker and return a list of headline/summary strings.

    Args:
        ticker: Company ticker symbol for Finnhub (e.g. 'AAPL').
        days: Number of past days to fetch news for (default 2).

    Returns:
        A list of strings where each item contains the headline and short summary,
        or a single-item list with an error message on failure.
    """

    to_date = datetime.today().strftime('%Y-%m-%d')
    from_date = (datetime.today() - timedelta(days=days)).strftime('%Y-%m-%d')
    try:
        news_data = finnhub_client.company_news(ticker, _from=from_date, to=to_date)
        summaries = [f"Headline: {article['headline']}\nSummary: {article['summary']}" for article in news_data]
        return summaries
    except Exception as e:
        return [f"An error occurred while fetching news: {e}"]