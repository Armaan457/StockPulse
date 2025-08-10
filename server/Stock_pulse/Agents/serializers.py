from rest_framework import serializers


class QueryRequestSerializer(serializers.Serializer):
    external_user_id = serializers.CharField(max_length=255)
    query = serializers.CharField()


class ChatResponseSerializer(serializers.Serializer):
    answer = serializers.CharField()


class StocksQueryRequestSerializer(serializers.Serializer):
    external_user_id = serializers.CharField(max_length=255)
    stocks_name = serializers.CharField()


class NewsChatResponseSerializer(serializers.Serializer):
    summary = serializers.CharField()
    sentiment = serializers.CharField()


class YouTubeResponseSerializer(serializers.Serializer):
    videos = serializers.ListField(child=serializers.CharField())


class AnalysisResponseSerializer(serializers.Serializer):
    report = serializers.CharField()
