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

        data = yf.download(tickers, start=start_date, end=end_date)['Adj Close']

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



        