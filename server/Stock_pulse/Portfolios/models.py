from django.db import models
# Create your models here.
from django.conf import settings

class Portfolio(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='portfolios')
    ticker_name = models.CharField(max_length=10)
    investment_amount = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.user.username}'s investment in {self.ticker_name} - Amount: {self.investment_amount}"
