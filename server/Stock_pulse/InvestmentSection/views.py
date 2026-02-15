import os
from django.shortcuts import render
from datetime import datetime
from rest_framework.response import Response
from rest_framework.views import APIView
import yfinance as yf
import pandas as pd
from rest_framework import status

class PortfolioPerformanceView(APIView):
    def get(self, request):
        companies = request.query_params.getlist('companies')
        amounts = request.query_params.getlist('amounts')

        if not companies or not amounts:
            return Response(
                {"error": "companies and amounts query parameters are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(companies) != len(amounts):
            return Response(
                {"error": "Each company must have a corresponding investment amount."},
                status=status.HTTP_400_BAD_REQUEST
            )

        amounts = list(map(float, amounts))
        total_investment = sum(amounts)

        weights = [amount / total_investment for amount in amounts]
        tickers = companies

        start_date = '2015-01-01'
        end_date = request.query_params.get(
            'end_date',
            datetime.today().strftime('%Y-%m-%d')
        )

        data = yf.download(tickers, start=start_date, end=end_date)['Close']

        daily_returns = data.pct_change()
        portfolio_returns = (daily_returns * weights).sum(axis=1)
        cumulative_returns = (1 + portfolio_returns).cumprod() - 1
        portfolio_value = total_investment * (1 + cumulative_returns)

        return Response({
            "dates": portfolio_value.index.strftime('%Y-%m-%d').tolist(),
            "portfolio_value": portfolio_value.tolist(),
            "daily_return": portfolio_returns.tolist(),
            "cumulative_return": cumulative_returns.tolist(),
        })


class TopStocksView(APIView):
    DEFAULT_TICKERS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'JPM', 'V', 'WMT']

    def get(self, request):
        tickers = request.query_params.getlist('tickers') or self.DEFAULT_TICKERS
        period = request.query_params.get('period', '1mo')

        try:
            data = yf.download(tickers, period=period, group_by='ticker')
        except Exception as e:
            return Response(
                {"error": f"Failed to fetch stock data: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        results = []
        for ticker in tickers:
            try:
                if len(tickers) == 1:
                    ticker_data = data
                else:
                    ticker_data = data[ticker]

                if ticker_data.empty or ticker_data['Close'].dropna().empty:
                    continue

                close_prices = ticker_data['Close'].dropna()
                start_price = close_prices.iloc[0]
                end_price = close_prices.iloc[-1]
                pct_change = ((end_price - start_price) / start_price) * 100

                results.append({
                    "ticker": ticker,
                    "start_price": round(float(start_price), 2),
                    "end_price": round(float(end_price), 2),
                    "pct_change": round(float(pct_change), 2),
                    "volume": int(ticker_data['Volume'].sum()),
                })
            except (KeyError, IndexError):
                continue

        results.sort(key=lambda x: x['pct_change'], reverse=True)

        return Response({
            "period": period,
            "stocks": results,
        })