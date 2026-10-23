from django.contrib import admin
from .models import Conversation, Message, MessageReaction


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ['id', 'is_group', 'name', 'updated_at']
    list_filter = ['is_group', 'created_at']
    search_fields = ['name', 'participants__username']


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'conversation', 'sender', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['sender__username', 'content']


@admin.register(MessageReaction)
class MessageReactionAdmin(admin.ModelAdmin):
    list_display = ['message', 'user', 'emoji', 'created_at']
    list_filter = ['emoji', 'created_at']
