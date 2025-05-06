from rest_framework import serializers
from ..models import NumberMemoryTest

class NumberMemoryTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = NumberMemoryTest
        fields = ['id', 'user', 'score', 'created_at']
        read_only_fields = ['user', 'created_at']