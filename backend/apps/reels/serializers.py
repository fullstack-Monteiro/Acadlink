from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Reel, ReelCategory, ReelComment, ReelLike, ReelSave

User = get_user_model()


class UserMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']


class ReelCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ReelCategory
        fields = ['id', 'key', 'label', 'icon', 'color']


class ReelCommentSerializer(serializers.ModelSerializer):
    author = UserMinimalSerializer(read_only=True)
    
    class Meta:
        model = ReelComment
        fields = ['id', 'author', 'content', 'likes_count', 'created_at']
        read_only_fields = ['id', 'author', 'likes_count', 'created_at']


class ReelSerializer(serializers.ModelSerializer):
    creator = UserMinimalSerializer(read_only=True)
    category = ReelCategorySerializer(read_only=True)
    comments = ReelCommentSerializer(many=True, read_only=True)
    is_liked = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()
    
    class Meta:
        model = Reel
        fields = [
            'id', 'creator', 'video', 'thumbnail',
            'description', 'category', 'hashtags', 'duration',
            'views_count', 'likes_count', 'comments_count', 'shares_count', 'saves_count',
            'is_liked', 'is_saved', 'comments',
            'created_at'
        ]
        read_only_fields = [
            'id', 'creator', 'thumbnail',
            'views_count', 'likes_count', 'comments_count', 'shares_count', 'saves_count',
            'created_at'
        ]
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False
    
    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.saves.filter(user=request.user).exists()
        return False


class ReelUploadSerializer(serializers.ModelSerializer):
    category_id = serializers.IntegerField(write_only=True)
    hashtags = serializers.ListField(
        child=serializers.CharField(max_length=50),
        min_length=1,
        max_length=10
    )
    
    class Meta:
        model = Reel
        fields = ['video', 'description', 'category_id', 'hashtags', 'duration']
    
    def validate_description(self, value):
        if len(value) > 500:
            raise serializers.ValidationError('Description cannot exceed 500 characters')
        return value
    
    def validate_hashtags(self, value):
        hashtags = list(set(h.lower().strip('#') for h in value))
        if len(hashtags) < 1 or len(hashtags) > 10:
            raise serializers.ValidationError('Add between 1 and 10 hashtags')
        return hashtags
    
    def validate_duration(self, value):
        if value < 15 or value > 90:
            raise serializers.ValidationError('Video must be between 15 and 90 seconds')
        return value
    
    def create(self, validated_data):
        category_id = validated_data.pop('category_id')
        validated_data['creator'] = self.context['request'].user
        validated_data['category_id'] = category_id
        validated_data['moderation_status'] = 'pending'
        return super().create(validated_data)
