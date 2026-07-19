from django.urls import path
from .views import PortfolioPerformanceView, TopStocksView

urlpatterns = [
    path('portfolio-performance/', PortfolioPerformanceView.as_view(), name='portfolio-performance'),
    path('top-stocks/', TopStocksView.as_view(), name='top-stocks'),
]