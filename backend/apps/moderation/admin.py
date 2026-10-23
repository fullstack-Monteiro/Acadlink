from django.contrib import admin
from .models import ModerationLog, UserBan


@admin.register(ModerationLog)
class ModerationLogAdmin(admin.ModelAdmin):
    list_display = ['moderator', 'action', 'content_type', 'created_at']
    list_filter = ['action', 'created_at']
    search_fields = ['moderator__username', 'reason']


@admin.register(UserBan)
class UserBanAdmin(admin.ModelAdmin):
    list_display = ['user', 'banned_by', 'is_permanent', 'banned_until', 'created_at']
    list_filter = ['is_permanent', 'created_at']
    search_fields = ['user__username']
