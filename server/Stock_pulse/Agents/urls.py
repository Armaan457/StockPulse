from django.urls import path
from .views import ChatBotView, StockPortfolioAnalysisView, VideosView, StockPredictionView

urlpatterns = [
    path('videos', VideosView.as_view(), name='videos'),
    path('predict', StockPredictionView.as_view(), name='predict'),
    path('chat', ChatBotView.as_view(), name='chat'),
    path('analyze', StockPortfolioAnalysisView.as_view(), name='analyze'),
]
