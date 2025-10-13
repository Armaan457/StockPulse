from rest_framework import serializers


class StocksQueryRequestSerializer(serializers.Serializer):
    stocks_name = serializers.CharField()

class YouTubeResponseSerializer(serializers.Serializer):
    videos = serializers.ListField(child=serializers.CharField())

class StockPredictionResponseSerializer(serializers.Serializer):
    prediction = serializers.ChoiceField(choices=['RISE', 'FALL', 'STABLE'])
    explanation_technical = serializers.CharField()
    explanation_sentiment = serializers.CharField()
