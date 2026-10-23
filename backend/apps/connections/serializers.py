from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Connection

User = get_user_model()


class UserMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']


class ConnectionSerializer(serializers.ModelSerializer):
    from_user = UserMinimalSerializer(read_only=True)
    to_user = UserMinimalSerializer(read_only=True)
    
    class Meta:
        model = Connection
        fields = ['id', 'from_user', 'to_user', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']
