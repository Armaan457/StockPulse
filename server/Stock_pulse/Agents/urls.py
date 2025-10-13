from django.urls import path
from .views import VideosView, StockPredictionView

urlpatterns = [
    path('videos', VideosView.as_view(), name='videos'),
    path('predict', StockPredictionView.as_view(), name='predict'),
]
