from django.urls import path
from .views import ChatbotView, StockNewsView, VideosView, PortfolioAnalyserView

urlpatterns = [
    path('chat/', ChatbotView.as_view(), name='chatbot'),
    path('stock-news/', StockNewsView.as_view(), name='stock-news'),
    path('videos/', VideosView.as_view(), name='videos'),
    path('portfolio-analyser/', PortfolioAnalyserView.as_view(), name='portfolio-analyser'),
]
