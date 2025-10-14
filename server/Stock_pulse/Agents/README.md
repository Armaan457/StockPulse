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
  - Errors:
    - 400: validation errors (missing/invalid `stocks_name`)
    - 500: server/tool errors with `{ "error": "<message>" }`

- `POST agents/predict`
  - Purpose: Produce a simple prediction for a single stock ticker/name.
  - Request body (example input):
    ```json
    {
      "stocks_name": "AAPL"
    }
    ```
  - Successful response (200) — example output (matches `StockPredictionResponseSerializer`):
    ```json
    {
      "prediction": "RISE",
      "explanation_technical": "Short-term moving averages are crossing up, volume is increasing.",
      "explanation_sentiment": "News sentiment and social chatter are positive after earnings."
    }
    ```
  - Errors:
    - 400: validation errors
    - 500: server errors with `{ "error": "<message>" }`

- `POST agents/analyze`
  - Purpose: Analyze a portfolio composed of multiple stock tickers/names.
  - Request body (example input):
    ```json
    {
      "portfolio_tickers": ["AAPL", "MSFT", "TSLA"]
    }
    ```
  - Successful response (200) — example output (matches `PortfolioAnalysisResponseSerializer`):
    ```json
    {
      "summary": "Portfolio shows moderate diversification. AAPL and MSFT provide stability while TSLA adds volatility. Consider trimming 5% in TSLA for risk control."
    }
    ```
  - Errors:
    - 400: validation errors (e.g., not a list)
    - 500: server errors with `{ "error": "<message>" }`

- `POST agents/chat`
  - Purpose: Query the RAG-powered chatbot for a conversational answer.
  - Request body (example input):
    ```json
    {
      "query": "How is AAPL doing?",
      "session_id": "session-123"
    }
    ```
  - Successful response (200) — example output (matches `ChatQueryResponseSerializer`):
    ```json
    {
      "session_id": "session-123",
      "query": "How is AAPL doing?",
      "answer": "AAPL shows strength over the past quarter driven by better-than-expected earnings and improving margins. Technical indicators are bullish in the short term."
    }
    ```
  - Errors:
    - 400: validation errors
    - 500: server errors with `{ "error": "<message>" }`





