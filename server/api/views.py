from django.contrib.auth.models import AnonymousUser
from django.db.models import Count, Case, When, Value
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.db.models import CharField

from .models import VerbalMemoryTest, WordPool, ChimpTest
from .serializers.verbal_memory import VerbalMemoryTestSerializer, WordPoolSerializer
from .serializers.chimp import ChimpTestSerializer
import random


def index(request):
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
        return Response(serializer.errors, status=400)


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
    if not request.user.is_authenticated:
        return Response([], status=200)  # Return empty array for anonymous users
    tests = VerbalMemoryTest.objects.filter(user=request.user).order_by('created_at')
    data = [{
        'date': test.created_at.strftime('%Y-%m-%d'),
        'score': test.score
    } for test in tests]
    return Response(data or [])


@api_view(['GET'])
def score_distribution(request):
    bins = [0, 5, 10, 15, 20, 25, 30, 35, 40]
    distribution = VerbalMemoryTest.objects.all().annotate(
        bin=Case(
            *[When(score__gte=bin_min, score__lt=bin_max, then=Value(f'{bin_min}-{bin_max}'))
              for bin_min, bin_max in zip(bins[:-1], bins[1:])],
            default=Value(f'{bins[-1]}+'),
            output_field=CharField()
        )
    ).values('bin').annotate(count=Count('id')).order_by('bin')

    user_score = None
    if request.user.is_authenticated:
        user_score = VerbalMemoryTest.objects.filter(
            user=request.user
        ).order_by('-score').first()

    return Response({
        'distribution': list(distribution) or [],
        'user_score': user_score.score if user_score else None
    })