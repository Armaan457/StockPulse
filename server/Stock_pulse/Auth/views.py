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
    
class Loginview(APIView):
    def post(self , request):
        username = request.data['username']
        password = request.data['password']
        
        user = User.objects.filter(username=username).first()
        
        if user is None:
            raise AuthenticationFailed('User Not found')
        
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect Password')
        
        payload = {
            'id':user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=600),
            'iat' : datetime.datetime.utcnow()
        }
        
        token = jwt.encode(payload , 'secret' , algorithm='HS256')
        
        response = Response()
        response.set_cookie(key='jwt', value=token,httponly=True)
        response.data = {
            'jwt': token
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