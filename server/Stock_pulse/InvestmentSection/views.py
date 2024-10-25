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
        # Retrieve company names and their individual investment amounts
        companies = request.query_params.getlist('companies')  # List of company names
        amounts = request.query_params.getlist('amounts')  # List of investment amounts for each company

        # Ensure we have the same number of companies and amounts
        if len(companies) != len(amounts):
            return Response({"error": "Each company must have a corresponding investment amount."}, status=400)

        # Convert amounts to floats and calculate total investment
        amounts = list(map(float, amounts))
        total_investment = sum(amounts)

        # Calculate weights for each company based on individual investment amount
        weights = [amount / total_investment for amount in amounts]

        # Generate tickers for each company (assuming `companies` contains tickers for simplicity)
        tickers = companies

        # Define start and end dates
        start_date = '2015-01-01'  # Fixed start date
        end_date = request.query_params.get('end_date', datetime.today().strftime('%Y-%m-%d'))  # Default to today's date

        # Download data
        data = yf.download(tickers, start=start_date, end=end_date)['Adj Close']

        # Calculate portfolio performance
        daily_returns = data.pct_change()
        portfolio_returns = (daily_returns * weights).sum(axis=1)
        cumulative_returns = (1 + portfolio_returns).cumprod() - 1

        # Calculate portfolio value based on total investment amount
        portfolio_value = total_investment * (1 + cumulative_returns)

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
        



from rest_framework.views import APIView
from rest_framework.response import Response
import pandas as pd
from django.conf import settings
import os

# views.py
import os
import pandas as pd
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class TopStocksView(APIView):
    def get(self, request):
        # Define the path to the CSV file dynamically
        file_path = os.path.join(settings.BASE_DIR, 'tickers.csv')  # Update this to your actual CSV file path

        try:
            # Load the data from the CSV file
            df = pd.read_csv('tickerss.csv')

            # Clean the '% Change' column by removing '%' and converting it to numeric
            df['% Change'] = pd.to_numeric(df['% Change'].str.replace('%', ''), errors='coerce')

            # Drop rows with NaN values in '% Change' column
            df_cleaned = df.dropna(subset=['% Change'])

            # Get top 4 stocks with the highest and lowest percentage changes
            top_4_high = df_cleaned.nlargest(4, '% Change')[['Symbol', 'Name', '% Change']]
            top_4_low = df_cleaned.nsmallest(4, '% Change')[['Symbol', 'Name', '% Change']]

            # Convert the result to a list of dictionaries
            response_data = {
                "top_4_high": top_4_high.to_dict(orient='records'),
                "top_4_low": top_4_low.to_dict(orient='records')
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except FileNotFoundError:
            return Response({"error": "CSV file not found. Please check the file path."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
