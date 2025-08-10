import ast
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from langchain_community.tools import YouTubeSearchTool

from .serializers import (
    QueryRequestSerializer, 
    ChatResponseSerializer,
    StocksQueryRequestSerializer, 
    NewsChatResponseSerializer,
    YouTubeResponseSerializer,
    AnalysisResponseSerializer
)
from .utils import get_or_create_session, send_query


class ChatbotView(APIView):
    """
    Handle general chatbot queries for stocks, commodities, and trading
    """
    
    def post(self, request):
        serializer = QueryRequestSerializer(data=request.data)
        if serializer.is_valid():
            try:
                session_id = get_or_create_session(serializer.validated_data['external_user_id'])
                query = serializer.validated_data['query'] + " Answer only if the question is from stocks, commodities, and trading, otherwise don't answer. Use minmum tool calls to get your answer."
                answer = send_query(session_id, query, [
                    "plugin-1713962163", "plugin-1729875364", "plugin-1728287833",
                    "plugin-1726253762", "plugin-1716429542", "plugin-1716434059"
                ])
                
                response_data = ChatResponseSerializer({"answer": answer}).data
                return Response(response_data, status=status.HTTP_200_OK)
                
            except Exception as e:
                return Response(
                    {"error": str(e)}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StockNewsView(APIView):
    """
    Get news summary and sentiment analysis for a specific stock
    """
    
    def post(self, request):
        serializer = StocksQueryRequestSerializer(data=request.data)
        if serializer.is_valid():
            try:
                session_id = get_or_create_session(serializer.validated_data['external_user_id'])
                query = f"You are a bot whose job is to provide the summary of the news of a given stock in 1 paragraph only. After this, perform sentiment analysis on the summary and return the answer as positive, negative, or neutral (only 1 word) in the next line.\n{serializer.validated_data['stocks_name']} stocks news"
                
                answer = send_query(session_id, query, ["plugin-1712327325", "plugin-1713962163", "plugin-1729887147"])
                lines = answer.split("\n")
                summary = lines[0] if lines else ""
                sentiment = lines[-1] if len(lines) > 1 else "neutral"

                response_data = NewsChatResponseSerializer({
                    "summary": summary, 
                    "sentiment": sentiment
                }).data
                return Response(response_data, status=status.HTTP_200_OK)
                
            except Exception as e:
                return Response(
                    {"error": str(e)}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VideosView(APIView):
    """
    Get YouTube videos related to a specific stock
    """
    
    def post(self, request):
        serializer = StocksQueryRequestSerializer(data=request.data)
        if serializer.is_valid():
            try:
                tool = YouTubeSearchTool()
                results = tool.run(serializer.validated_data['stocks_name'] + ", 5")
                videos = ast.literal_eval(results)
                
                response_data = YouTubeResponseSerializer({"videos": videos}).data
                return Response(response_data, status=status.HTTP_200_OK)
                
            except Exception as e:
                return Response(
                    {"error": str(e)}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PortfolioAnalyserView(APIView):
    """
    Analyze a portfolio and provide insights and recommendations
    """
    
    def post(self, request):
        serializer = StocksQueryRequestSerializer(data=request.data)
        if serializer.is_valid():
            try:
                session_id = get_or_create_session(serializer.validated_data['external_user_id'])
                query = f"You are a bot designed to provide insights on a portfolio. Analyze the given stocks, suggest weaknesses, and recommend an improved portfolio with an updated list of stocks: {serializer.validated_data['stocks_name']}"
                
                answer = send_query(session_id, query, [
                    "plugin-1712327325", "plugin-1713962163", "plugin-1729875364",
                    "plugin-1728314839", "plugin-1728287833", "plugin-1726253762",
                    "plugin-1716429542", "plugin-1716434059", "plugin-1729887147"
                ])

                response_data = AnalysisResponseSerializer({"report": answer}).data
                return Response(response_data, status=status.HTTP_200_OK)
                
            except Exception as e:
                return Response(
                    {"error": str(e)}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
