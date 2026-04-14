from rest_framework import serializers


class StocksQueryRequestSerializer(serializers.Serializer):
    stocks_name = serializers.CharField()


class PortfolioAnalysisRequestSerializer(serializers.Serializer):
    portfolio_tickers = serializers.ListField(
        child=serializers.CharField(), required=True
    )
    portfolio_stocks = serializers.JSONField(required=True)
    trader_profile = serializers.CharField(required=True)

class YouTubeResponseSerializer(serializers.Serializer):
    videos = serializers.ListField(child=serializers.CharField())

class StockPredictionResponseSerializer(serializers.Serializer):
    prediction = serializers.ChoiceField(choices=['RISE', 'FALL', 'STABLE'])
    explanation_technical = serializers.CharField()
    explanation_sentiment = serializers.CharField()


class PortfolioAnalysisResponseSerializer(serializers.Serializer):
    summary = serializers.CharField()


class ChatHistoryMessageSerializer(serializers.Serializer):
    role = serializers.ChoiceField(
        choices=["user", "assistant", "system", "bot"],
        help_text="Role of the message sender.",
    )
    content = serializers.CharField(
        allow_blank=False,
        trim_whitespace=True,
        help_text="Message text content.",
    )

class ChatQueryRequestSerializer(serializers.Serializer):
    query = serializers.CharField(required=True, help_text="User's question or message.")
    history = ChatHistoryMessageSerializer(
        many=True,
        required=False,
        allow_null=True,
        default=list,
        help_text="Optional conversation history as an array of role/content messages.",
    )

class ChatQueryResponseSerializer(serializers.Serializer):
    answer = serializers.CharField()
