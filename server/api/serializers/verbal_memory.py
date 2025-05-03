from rest_framework import serializers
from ..models import VerbalMemoryTest, WordPool

class VerbalMemoryTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerbalMemoryTest
        fields = ['id', 'score', 'created_at']
        # Remove user from fields since we handle it in the view

class WordPoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = WordPool
        fields = ['id', 'word']