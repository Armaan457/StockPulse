# Investment Section API Documentation

## Base URL

```
/api/investment/
```

---

## Endpoint: Portfolio Performance

```
GET /portfolio-performance/
```

### Description

Returns historical portfolio performance based on stock tickers and investment amounts. Data starts from **2015-01-01** up to the specified end date.

### Request Specification

#### Query Parameters

| Parameter  | Type                  | Required | Description                                                  |
| ---------- | --------------------- | -------- | ------------------------------------------------------------ |
| companies  | string[]              | Yes      | Stock tickers (Yahoo Finance format, e.g. AAPL, MSFT)       |
| amounts    | number[]              | Yes      | Investment amount corresponding to each stock                |
| end_date   | string (YYYY-MM-DD)   | No       | End date for backtest (defaults to current date)             |

#### Important Constraints

- `companies.length === amounts.length`
- Order matters: `amounts[i]` corresponds to `companies[i]`

### Example Request

```
GET /api/investment/portfolio-performance/?companies=AAPL&companies=MSFT&companies=GOOGL&amounts=50000&amounts=30000&amounts=20000&end_date=2024-12-31
```

### Response Specification

#### Success Response (200 OK)

```json
{
  "dates": ["2015-01-02", "2015-01-05", "2015-01-06"],
  "portfolio_value": [100000, 100850, 101420],
  "daily_return": [0.0, 0.0085, 0.0056],
  "cumulative_return": [0.0, 0.0085, 0.0142]
}
```

#### Response Fields

| Field            | Type     | Description                |
| ---------------- | -------- | -------------------------- |
| dates            | string[] | Trading dates (YYYY-MM-DD) |
| portfolio_value  | number[] | Portfolio value per day    |
| daily_return     | number[] | Daily portfolio return     |
| cumulative_return| number[] | Cumulative portfolio return|

#### Error Responses

**400 - Missing Parameters**

```json
{
  "error": "companies and amounts query parameters are required"
}
```

**400 - Length Mismatch**

```json
{
  "error": "Each company must have a corresponding investment amount."
}
```

### Frontend Integration Notes

#### Parameter Encoding

Use repeated query parameters for arrays. Do **not** send arrays as comma-separated strings.

Correct:

```
?companies=AAPL&companies=MSFT&amounts=60000&amounts=40000
```

Incorrect:

```
?companies=AAPL,MSFT&amounts=60000,40000
```

#### Performance Notes

- API performs live historical data fetch via Yahoo Finance
- Response time may vary (1-3 seconds)
- Frontend should show a loading state

#### Example Frontend (JavaScript)

```javascript
const params = new URLSearchParams();
params.append("companies", "AAPL");
params.append("companies", "MSFT");
params.append("amounts", 60000);
params.append("amounts", 40000);

fetch(`/api/investment/portfolio-performance/?${params}`)
  .then(res => res.json())
  .then(data => {
    console.log(data.portfolio_value);
  });
```

### Test Cases

#### Valid Input

```
companies = ["AAPL", "MSFT"]
amounts = [60000, 40000]
```

- Expected: HTTP 200, non-empty `portfolio_value`

#### Invalid Input (Mismatch)

```
companies = ["AAPL", "MSFT"]
amounts = [60000]
```

- Expected: HTTP 400, error message

#### Invalid Ticker

```
companies = ["INVALID"]
amounts = [10000]
```

- Expected: HTTP 200, empty arrays (frontend should handle gracefully)

---

## Endpoint: Top Stocks

```
GET /top-stocks/
```

> **Note:** This endpoint is mounted at the project root, not under `/api/investment/`. Full URL: `GET /top-stocks/`

### Description

Returns price performance and volume data for a list of stocks over a given time period. Results are sorted by percentage change (highest first).

### Request Specification

#### Query Parameters

| Parameter | Type     | Required | Description                                              |
| --------- | -------- | -------- | -------------------------------------------------------- |
| tickers   | string[] | No       | Stock tickers (defaults to top 10: AAPL, MSFT, GOOGL, AMZN, NVDA, META, TSLA, JPM, V, WMT) |
| period    | string   | No       | Time period (defaults to `1mo`). Valid: `1d`, `5d`, `1mo`, `3mo`, `6mo`, `1y`, `2y`, `5y`, `10y`, `ytd`, `max` |

### Example Request

```
GET /top-stocks/?tickers=AAPL&tickers=MSFT&tickers=NVDA&period=3mo
```

### Response Specification

#### Success Response (200 OK)

```json
{
  "period": "3mo",
  "stocks": [
    {
      "ticker": "NVDA",
      "start_price": 120.50,
      "end_price": 140.25,
      "pct_change": 16.39,
      "volume": 5823410000
    },
    {
      "ticker": "AAPL",
      "start_price": 178.20,
      "end_price": 195.10,
      "pct_change": 9.48,
      "volume": 3412500000
    }
  ]
}
```

#### Response Fields

| Field       | Type     | Description                              |
| ----------- | -------- | ---------------------------------------- |
| period      | string   | Requested time period                    |
| stocks      | object[] | Array of stock performance objects       |
| stocks[].ticker      | string  | Stock ticker symbol              |
| stocks[].start_price | number  | Price at start of period         |
| stocks[].end_price   | number  | Price at end of period           |
| stocks[].pct_change  | number  | Percentage change over period    |
| stocks[].volume      | number  | Total volume over period         |

#### Error Responses

**500 - Data Fetch Failure**

```json
{
  "error": "Failed to fetch stock data: <error details>"
}
```

### Test Cases

#### Default (no params)

```
GET /top-stocks/
```

- Expected: HTTP 200, returns data for 10 default stocks

#### Custom tickers and period

```
GET /top-stocks/?tickers=AAPL&tickers=TSLA&period=6mo
```

- Expected: HTTP 200, returns data for AAPL and TSLA

#### Invalid ticker

```
GET /top-stocks/?tickers=INVALID&period=1mo
```

- Expected: HTTP 200, empty `stocks` array (ticker is skipped)
