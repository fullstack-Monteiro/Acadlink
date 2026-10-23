from django.contrib import admin
from .models import Post, Comment, PostLike, SavedPost


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['id', 'author', 'likes_count', 'comments_count', 'created_at']
    list_filter = ['created_at']
    search_fields = ['author__username', 'content']
    readonly_fields = ['likes_count', 'comments_count', 'shares_count', 'created_at', 'updated_at']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'post', 'author', 'likes_count', 'created_at']
    list_filter = ['created_at']
    search_fields = ['author__username', 'content']
    readonly_fields = ['likes_count', 'created_at', 'updated_at']


@admin.register(PostLike)
class PostLikeAdmin(admin.ModelAdmin):
    list_display = ['post', 'user', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username']


@admin.register(SavedPost)
class SavedPostAdmin(admin.ModelAdmin):
    list_display = ['user', 'post', 'collection', 'created_at']
    list_filter = ['collection', 'created_at']
    search_fields = ['user__username']
