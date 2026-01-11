from django.urls import path
from Auth.views import AllUsersView, RegisterUserView, LogoutView
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('users/', AllUsersView.as_view(), name='all_users'),
    path('logout/', LogoutView.as_view(), name='logout'),
]           