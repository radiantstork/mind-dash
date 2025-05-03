from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from .serializers import UserSerializer, UserRegistrationSerializer
from django.middleware.csrf import get_token

def index(_):
    return HttpResponse("Hello, world. You're at the app index.")

class LoginView(APIView):
    def post(self, request):
        print(request.data)
        username = request.data["body"].get('username')
        password = request.data["body"].get('password')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            serializer = UserSerializer(user)
            return Response({
                'detail': 'Successfully logged in',
                'user': serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'detail': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )


class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data["body"])
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'detail': 'User created successfully'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response(
            {'detail': 'Successfully logged out'},
            status=status.HTTP_200_OK
        )