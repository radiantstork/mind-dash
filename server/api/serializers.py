from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import WordPool, GameResult
# from .models import NumberMemoryTest, ChimpTest, VerbalMemoryTest

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user
    

class GameResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameResult
        fields = ['id', 'user', 'score', 'created_at', 'test_name']
        read_only_fields = ['user', 'created_at']  # These will be auto-populated


# class NumberMemoryTestSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = NumberMemoryTest
#         fields = ['id', 'user', 'score', 'created_at']
#         read_only_fields = ['user', 'created_at']

# class ChimpTestSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ChimpTest
#         fields = ['id', 'user', 'score', 'sequence_length', 'created_at']
#         read_only_fields = ['user']

# class VerbalMemoryTestSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = VerbalMemoryTest
#         fields = ['id', 'score', 'created_at']
#         # Remove user from fields since we handle it in the view

class WordPoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = WordPool
        fields = ['id', 'word']