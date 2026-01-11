from django.urls import path
from .views import PortfolioPerformanceView

urlpatterns = [
    path('portfolio-performance/', PortfolioPerformanceView.as_view(), name='portfolio-performance'),
]
