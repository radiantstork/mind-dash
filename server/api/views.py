from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from .serializers import UserSerializer, UserRegistrationSerializer
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from django.utils.decorators import method_decorator

def index(_):
    return HttpResponse("Hello, world. You're at the app index.")

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({"message": "CSRF cookie set"})


@method_decorator(ensure_csrf_cookie, name='dispatch')
class ProtectedDataView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("User:", request.user)
        print("Is Authenticated:", request.user.is_authenticated)
        print("Session key:", request.session.session_key)
        print(request.data)
        # Only authenticated users can access this
        return Response({
            'data': 'This is protected data',
            'user': request.user.username
        }, status=status.HTTP_200_OK)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
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
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'detail': 'User created successfully'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("User:", request.user)
        print("Is Authenticated:", request.user.is_authenticated)
        print("Session key:", request.session.session_key)
        logout(request)
        return Response(
            {'detail': 'Successfully logged out'},
            status=status.HTTP_200_OK
        )
    

