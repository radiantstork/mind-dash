from rest_framework import serializers
from ..models import ChimpTest

class ChimpTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChimpTest
        fields = ['id', 'user', 'score', 'sequence_length', 'created_at']
        read_only_fields = ['user']