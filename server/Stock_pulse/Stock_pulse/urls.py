"""
URL configuration for Stock_pulse project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from InvestmentSection.views import PortfolioPerformanceView , MovingAveragesView , TopStocksView , Top

urlpatterns = [
    path('api/', include('api.urls')),
    path('admin/', admin.site.urls),
    path('backtesting/' , PortfolioPerformanceView.as_view()),
    path('Movingaverages/' , MovingAveragesView.as_view()),
    path("top-stocks/" , TopStocksView.as_view()),
<<<<<<< HEAD
    path('NewsSection/', include('NewsSection.urls')),
=======
    path("top/" , Top.as_view())
>>>>>>> c053454899cbde0a686189314abb4cdae38ad4aa
]
