from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.views import APIView
import yfinance as yf
import pandas as pd
from rest_framework import status

class PortfolioPerformanceView(APIView):
    def get(self, request):
        # Retrieve query parameters from the request
        tickers = request.query_params.getlist('tickers', ['AAPL', 'MSFT', 'GOOGL'])
        weights = request.query_params.getlist('weights', [0.4, 0.4, 0.2])
        start_date = request.query_params.get('start_date', '2020-01-01')
        end_date = request.query_params.get('end_date', '2023-01-01')
        
        # Convert weights to floats
        weights = list(map(float, weights))
        
        # Download data
        data = yf.download(tickers, start=start_date, end=end_date)['Adj Close']
        
        # Calculate portfolio performance
        daily_returns = data.pct_change()
        portfolio_returns = (daily_returns * weights).sum(axis=1)
        cumulative_returns = (1 + portfolio_returns).cumprod() - 1
        
        # Set initial investment and calculate portfolio value
        initial_investment = 10000
        portfolio_value = initial_investment * (1 + cumulative_returns)
        
        # Prepare the performance data as JSON serializable
        performance_data = {
            "dates": portfolio_value.index.strftime('%Y-%m-%d').tolist(),
            "portfolio_value": portfolio_value.tolist(),
            "daily_return": portfolio_returns.tolist(),
            "cumulative_return": cumulative_returns.tolist(),
        }
        
        return Response(performance_data)


class MovingAveragesView(APIView):
    def get(self, request, ticker, start_date, end_date, sma_window=10, ema_window=10):
        """
        Retrieve historical price data for a stock and calculate SMA and EMA.
        
        Parameters:
        - ticker: Stock ticker symbol.
        - start_date: Start date in the format 'YYYY-MM-DD'.
        - end_date: End date in the format 'YYYY-MM-DD'.
        - sma_window: Window for Simple Moving Average (SMA).
        - ema_window: Window for Exponential Moving Average (EMA).
        """
        try:
            # Download the historical price data
            data = yf.download(ticker, start=start_date, end=end_date)
            
            if data.empty:
                return Response({'error': 'No data found for the given ticker and date range.'}, status=status.HTTP_404_NOT_FOUND)

            # Calculate Simple and Exponential Moving Averages
            data[f'{sma_window}-day SMA'] = data['Adj Close'].rolling(window=sma_window).mean()
            data[f'{ema_window}-day EMA'] = data['Adj Close'].ewm(span=ema_window, adjust=False).mean()

            # Prepare response data
            response_data = data[['Adj Close', f'{sma_window}-day SMA', f'{ema_window}-day EMA']].reset_index().to_dict(orient='records')
            
            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)