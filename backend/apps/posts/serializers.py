from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Post, Comment, PostLike, SavedPost

User = get_user_model()


class UserMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']


class CommentSerializer(serializers.ModelSerializer):
    author = UserMinimalSerializer(read_only=True)
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'likes_count', 'is_liked', 'created_at']
        read_only_fields = ['id', 'author', 'likes_count', 'created_at']
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False


class PostSerializer(serializers.ModelSerializer):
    author = UserMinimalSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    is_liked = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = [
            'id', 'author', 'content', 'image',
            'likes_count', 'comments_count', 'shares_count',
            'is_liked', 'is_saved', 'comments',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'author', 'likes_count', 'comments_count', 'shares_count', 'created_at', 'updated_at']
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False
    
    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.saved_by.filter(user=request.user).exists()
        return False


class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['content', 'image']
    
    def validate_content(self, value):
        if not value or len(value.strip()) == 0:
            raise serializers.ValidationError('Content cannot be empty')
        if len(value) > 5000:
            raise serializers.ValidationError('Content cannot exceed 5000 characters')
        return value
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)
