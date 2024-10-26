from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerilizer
from .models import User
import jwt,datetime
# Create your views here.

class Register(APIView):
    def post(self , request):
        serializer = UserSerilizer(data = request.data)
        
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data)
    
import datetime
import jwt
from django.conf import settings

class LoginView(APIView):
    def post(self, request):
        username = request.data['username']
        password = request.data['password']

        user = User.objects.filter(username=username).first()

        if user is None:
            raise AuthenticationFailed('User not found')

        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password')

        # Access token with a shorter expiration time (e.g., 15 minutes)
        access_payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=15),
            'iat': datetime.datetime.utcnow()
        }
        access_token = jwt.encode(access_payload, settings.SECRET_KEY, algorithm='HS256')

        # Refresh token with a longer expiration time (e.g., 7 days)
        refresh_payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
            'iat': datetime.datetime.utcnow()
        }
        refresh_token = jwt.encode(refresh_payload, settings.SECRET_KEY, algorithm='HS256')

        # Return both tokens in the response
        response = Response()
        response.set_cookie(key='jwt_access', value=access_token, httponly=True)
        response.set_cookie(key='jwt_refresh', value=refresh_token, httponly=True)
        response.data = {
            'access_token': access_token,
            'refresh_token': refresh_token
        }

        return response

class RefreshTokenView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('jwt_refresh')

        if not refresh_token:
            raise AuthenticationFailed('Refresh token is missing')

        try:
            payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Refresh token has expired')

        # Issue a new access token
        access_payload = {
            'id': payload['id'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=15),
            'iat': datetime.datetime.utcnow()
        }
        access_token = jwt.encode(access_payload, settings.SECRET_KEY, algorithm='HS256')

        response = Response()
        response.set_cookie(key='jwt_access', value=access_token, httponly=True)
        response.data = {
            'access_token': access_token
        }

        return response


class UserView(APIView):
    
    def get(self , request):
        token = request.COOKIES.get('jwt')
        
        if not token:
            raise AuthenticationFailed('Unauthenticated')
        
        try:
            payload = jwt.decode(token, 'secret' , algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated')
        
        user = User.objects.filter(id = payload['id']).first()
        serializer = UserSerilizer(user)
        
        return Response(serializer.data)
    
class Logout(APIView):
    def post(self , request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'successfully logged out'
        }
        
        return response