from rest_framework import serializers


class PortfolioPerformanceResponseSerializer(serializers.Serializer):
    dates = serializers.ListField(child=serializers.CharField())
    portfolio_value = serializers.ListField(child=serializers.FloatField())
    daily_return = serializers.ListField(child=serializers.FloatField())
    cumulative_return = serializers.ListField(child=serializers.FloatField())


class TopStockSerializer(serializers.Serializer):
    ticker = serializers.CharField()
    start_price = serializers.FloatField()
    end_price = serializers.FloatField()
    pct_change = serializers.FloatField()
    volume = serializers.IntegerField()


class TopStocksResponseSerializer(serializers.Serializer):
    period = serializers.CharField()
    stocks = TopStockSerializer(many=True)
