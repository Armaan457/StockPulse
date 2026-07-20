from rest_framework import serializers
from .models import Portfolio

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ['id', 'user', 'ticker_name', 'investment_amount']
        read_only_fields = ['user']  # Automatically set from the request user