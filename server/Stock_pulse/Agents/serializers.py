from decimal import Decimal

from rest_framework import serializers


class StocksQueryRequestSerializer(serializers.Serializer):
    stocks_name = serializers.CharField()


class PortfolioHoldingSerializer(serializers.Serializer):
    ticker = serializers.CharField(help_text="Stock ticker symbol for the holding.")
    allocation = serializers.DecimalField(
        max_digits=12,
        decimal_places=6,
        allow_null=False,
        required=True,
        min_value=Decimal("0"),
    )


class PortfolioAnalysisRequestSerializer(serializers.Serializer):
    portfolio_stocks = PortfolioHoldingSerializer(many=True, required=True)
    trader_profile = serializers.CharField(required=True)

    def validate(self, attrs):
        portfolio_stocks = attrs["portfolio_stocks"]

        if not portfolio_stocks:
            raise serializers.ValidationError(
                {"portfolio_stocks": "At least one holding is required."}
            )

        normalized_holdings = []
        holding_tickers = []
        total_allocation = Decimal("0")

        for holding in portfolio_stocks:
            ticker = holding["ticker"].strip().upper()
            allocation = Decimal(str(holding["allocation"]))

            if allocation <= 0:
                raise serializers.ValidationError(
                    {"portfolio_stocks": "Each allocation must be greater than 0."}
                )

            normalized_holdings.append(
                {"ticker": ticker, "allocation": float(allocation)}
            )
            holding_tickers.append(ticker)
            total_allocation += allocation

        if len(set(holding_tickers)) != len(holding_tickers):
            raise serializers.ValidationError(
                {"portfolio_stocks": "Duplicate tickers are not allowed."}
            )

        if total_allocation not in (Decimal("100"), Decimal("1")):
            raise serializers.ValidationError(
                {
                    "portfolio_stocks": (
                        "Allocations must add up to either 100 or 1. "
                        f"Current total is {total_allocation}."
                    )
                }
            )

        attrs["portfolio_stocks"] = normalized_holdings
        return attrs

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
