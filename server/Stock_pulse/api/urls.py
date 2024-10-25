# from Auth.views import 
from django.urls import path
from Auth.views import Register, Loginview ,UserView , Logout

urlpatterns = [
    path('register/', Register.as_view()),
    path('login/',Loginview.as_view()),
    path('user/',UserView.as_view() ),
    path('logout/' , Logout.as_view())
]
