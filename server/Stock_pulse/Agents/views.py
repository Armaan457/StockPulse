import ast
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from langchain_community.tools import YouTubeSearchTool
from .Crews.prediction_crew import PredictionCrew
from .utils import get_rag_response
from .serializers import (
    ChatQueryRequestSerializer,
    ChatQueryResponseSerializer,
    StocksQueryRequestSerializer, 
    YouTubeResponseSerializer,
    StockPredictionResponseSerializer,
)


class StockPredictionView(APIView):

    # Temporary Disable authentication
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = StocksQueryRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        stocks_name = serializer.validated_data['stocks_name']

        try:
            crew = PredictionCrew().crew()
            result = crew.kickoff(inputs={"ticker": stocks_name})
            result = result.json_dict

            response_serializer = StockPredictionResponseSerializer(data=result)
            if not response_serializer.is_valid():
                return Response(response_serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response(response_serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VideosView(APIView):    

    # Temporary Disable authentication
    permission_classes = [AllowAny]
    authentication_classes = []

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

    # Temporary Disable authentication
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = ChatQueryRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        query = serializer.validated_data["query"]
        session_id = serializer.validated_data["session_id"]

        try:
            answer = get_rag_response(query, session_id)
            response_data = {
                "session_id": session_id,
                "query": query,
                "answer": answer,
            }
            response_serializer = ChatQueryResponseSerializer(response_data)
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


