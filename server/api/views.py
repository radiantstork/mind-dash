from django.contrib.auth.models import AnonymousUser
from django.db.models import Count, Case, When, Value, Max, Min
from django.http import HttpResponse
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from django.db.models import CharField

from .models import VerbalMemoryTest, WordPool, ChimpTest
from .serializers.verbal_memory import VerbalMemoryTestSerializer
from .serializers.chimp import ChimpTestSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from .serializers.serializers import UserSerializer, UserRegistrationSerializer
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from django.utils.decorators import method_decorator

def index(_):
    return HttpResponse("Hello, world. You're at the app index.")


class VerbalMemoryTestView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        tests = VerbalMemoryTest.objects.all()  # Or filter as needed
        serializer = VerbalMemoryTestSerializer(tests, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = VerbalMemoryTestSerializer(data=request.data)
        if serializer.is_valid():
            # Handle user assignment properly
            user = request.user if not isinstance(request.user, AnonymousUser) else None
            serializer.save(user=user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=200)


class RandomWordView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        count = WordPool.objects.count()
        if count == 0:
            return WordPool.objects.none()

        #random_index = random.randint(0, count - 1)
        count = WordPool.objects.count()
        if count == 0:
            return Response({"error": "No words available"}, status=404)

        random_word = WordPool.objects.order_by('?').first()
        return Response({
            "word": random_word.word
        })

class ChimpTestView(generics.ListCreateAPIView):
    serializer_class = ChimpTestSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return ChimpTest.objects.all().order_by('-score')[:10]  # Top 10 scores

    def perform_create(self, serializer):
        serializer.save(user=self.request.user if self.request.user.is_authenticated else None)


@api_view(['GET'])
def user_score_history(request):
    game_name = request.GET.get('game')
    if not request.user.is_authenticated:
        return Response([], status=400)
    if game_name == 'verbal-memory':
        tests = VerbalMemoryTest.objects.filter(user=request.user).order_by('created_at')
    elif game_name == 'chimp-test':
        tests = ChimpTest.objects.filter(user=request.user).order_by('created_at')
    else:
        tests = []
    data = [{
        'date': test.created_at.strftime('%Y-%m-%d'),
        'score': test.score
    } for test in tests]
    return Response(data or [])


@api_view(['GET'])
def score_distribution(request):
    # Get the min and max high scores across all users
    game_name = request.GET.get('game')
    if game_name == 'verbal memory':
        model = VerbalMemoryTest
    elif game_name == 'chimp-test':
        model = ChimpTest
    else:
        model = VerbalMemoryTest
    stats = model.objects.values('user').annotate(
        high_score=Max('score')
    ).aggregate(
        min_score=Min('high_score'),
        max_score=Max('high_score')
    )

    min_score = stats['min_score'] or 0
    max_score = stats['max_score'] or 5  # Avoid division by zero

    # Calculate dynamic bins (max 10 bins)
    num_bins = min(10, max_score - min_score + 1)
    bin_size = max(1, (max_score - min_score) // num_bins)

    # Generate bin edges (integer values)
    bins = [min_score + i * bin_size for i in range(num_bins)]
    bins.append(max_score + 1)  # Add upper bound for the last bin

    # Get each user's high score
    high_scores = model.objects.values('user').annotate(
        high_score=Max('score')
    ).values_list('high_score', flat=True)

    # Create distribution dictionary
    distribution = {}
    for score in high_scores:
        for i in range(len(bins) - 1):
            if bins[i] <= score < bins[i + 1]:
                bin_label = f'{bins[i]}-{bins[i + 1]}'
                distribution[bin_label] = distribution.get(bin_label, 0) + 1
                break

    # Convert to ordered list of bins
    distribution_list = [
        {'bin': f'{bins[i]}-{bins[i + 1] }', 'count': distribution.get(f'{bins[i]}-{bins[i + 1]}', 0)}
        for i in range(len(bins) - 1)
    ]

    # Get current user's high score (if authenticated)
    user_high_score = None
    if request.user.is_authenticated:
        user_high_score = model.objects.filter(
            user=request.user
        ).aggregate(high_score=Max('score'))['high_score']

    return Response({
        'distribution': distribution_list,
        'user_high_score': user_high_score,
        'bin_info': {
            'min': min_score,
            'max': max_score,
            'num_bins': num_bins,
            'bin_size': bin_size
        }
    })

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
        print(serializer.errors)
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


