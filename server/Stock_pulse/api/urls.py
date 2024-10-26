# from Auth.views import 
from django.urls import path
from Auth.views import Register,UserView , Logout ,RefreshTokenView , LoginView

urlpatterns = [
    path('register/', Register.as_view()),
    path('login/',LoginView.as_view()),
    path('user/',UserView.as_view() ),
    path('logout/' , Logout.as_view()),
    path('refresh-token/', RefreshTokenView.as_view(), name='refresh-token'),
]


