from django.urls import path
from .views import PortfolioListCreateView, PortfolioDetailView

urlpatterns = [
    path('portfolio/', PortfolioListCreateView.as_view(), name='portfolio-list-create'),
    path('portfolio/<int:pk>/', PortfolioDetailView.as_view(), name='portfolio-detail'),
]