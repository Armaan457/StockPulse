### Endpoints

- `POST agent/videos`
  - Purpose: Search YouTube for videos related to a stock name.
  - Request body (example input):
    ```json
    {
      "stocks_name": "AAPL"
    }
    ```
  - Successful response (200) — example output:
    ```json
    {
      "videos": [
        "https://www.youtube.com/watch?v=abc123",
        "https://www.youtube.com/watch?v=def456",
        "https://www.youtube.com/watch?v=ghi789"
      ]
    }
    ```

- `POST agents/predict`
  - Purpose: Produce a simple prediction for a single stock ticker/name.
  - Request body (example input):
    ```json
    {
      "stocks_name": "AAPL"
    }
    ```
  - Successful response (200) — example output:
    ```json
    {
      "prediction": "RISE",
      "explanation_technical": "Short-term moving averages are crossing up, volume is increasing.",
      "explanation_sentiment": "News sentiment and social chatter are positive after earnings."
    }
    ```

- `POST agents/analyze`
  - Purpose: Analyze a portfolio composed of multiple stock tickers/names.
  - Request body (example input):
    ```json
    {
      "portfolio_tickers": ["AAPL", "MSFT", "TSLA"]
    }
    ```
  - Successful response (200) — example output:
    ```json
    {
      "summary": "Portfolio shows moderate diversification. AAPL and MSFT provide stability while TSLA adds volatility. Consider trimming 5% in TSLA for risk control."
    }
    ```
- `POST agents/chat`
  - Purpose: Query the RAG-powered chatbot for a conversational answer.
  - Request body (example input):
    ```json
    {
      "query": "How is AAPL doing?",
      "session_id": "session-123"
    }
    ```
  - Successful response (200) — example output:
    ```json
    {
      "session_id": "session-123",
      "answer": "AAPL shows strength over the past quarter driven by better-than-expected earnings and improving margins. Technical indicators are bullish in the short term."
    }
    ```






