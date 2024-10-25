<<<<<<< HEAD
from django.shortcuts import render
from Stock_pulse.tasks import download_nasdaq_data
# Create your views here.
=======
from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Portfolio
from .serializers import PortfolioSerializer

class PortfolioListCreateView(generics.ListCreateAPIView):
    serializer_class = PortfolioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Portfolio.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PortfolioDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PortfolioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Portfolio.objects.filter(user=self.request.user)
>>>>>>> 0d3988a61fcb90863a28b5476317e66bdc471686
