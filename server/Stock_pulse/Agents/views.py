import ast
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from langchain_community.tools import YouTubeSearchTool
from .Crews.crews import StockCrews
from .utils import run_chatbot
from .serializers import (
    ChatQueryRequestSerializer,
    ChatQueryResponseSerializer,
    PortfolioAnalysisResponseSerializer,
    StocksQueryRequestSerializer,
    PortfolioAnalysisRequestSerializer,
    YouTubeResponseSerializer,
    StockPredictionResponseSerializer,
)


class StockPredictionView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StocksQueryRequestSerializer

    def post(self, request):
        serializer = StocksQueryRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        stocks_name = serializer.validated_data['stocks_name']

        try:
            crew = StockCrews().PredictionCrew()
            result = crew.kickoff(inputs={"ticker": stocks_name})
            result = result.json_dict

            response_serializer = StockPredictionResponseSerializer(data=result)
            if not response_serializer.is_valid():
                return Response(response_serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response(response_serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StockPortfolioAnalysisView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PortfolioAnalysisRequestSerializer

    def post(self, request):
        serializer = PortfolioAnalysisRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data

        try:
            crew = StockCrews().PortfolioCrew()
            result = crew.kickoff(
                inputs={
                    "portfolio_stocks": validated_data["portfolio_stocks"],
                    "trader_profile": validated_data["trader_profile"],
                }
            )

            response_data = {"summary": result.raw}

            response_serializer = PortfolioAnalysisResponseSerializer(data=response_data)
            if not response_serializer.is_valid():
                return Response(response_serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response(response_serializer.data, status=status.HTTP_200_OK)


        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VideosView(APIView):    
    permission_classes = []
    serializer_class = StocksQueryRequestSerializer

    def post(self, request):
        serializer = StocksQueryRequestSerializer(data=request.data)
        if serializer.is_valid():
            try:
                tool = YouTubeSearchTool()
                results = tool.run(serializer.validated_data['stocks_name'] + " stock" + ", 5")
                videos = ast.literal_eval(results)
                
                response_data = YouTubeResponseSerializer({"videos": videos}).data
                return Response(response_data, status=status.HTTP_200_OK)
                
            except Exception as e:
                return Response(
                    {"error": str(e)}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChatBotView(APIView):
    permission_classes = []
    serializer_class = ChatQueryRequestSerializer

    def post(self, request):
        serializer = ChatQueryRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        query = serializer.validated_data["query"]
        history_data = serializer.validated_data.get("history") or []
        history = [
            {"role": msg["role"], "content": msg["content"]}
            for msg in history_data
        ]

        try:
            answer = run_chatbot(query, history)
            response_data = {"answer": answer}
            response_serializer = ChatQueryResponseSerializer(response_data)
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


