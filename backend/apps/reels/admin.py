from django.contrib import admin
from .models import Reel, ReelCategory, ReelComment, ReelLike, ReelSave, ReelView, ReelReport


@admin.register(ReelCategory)
class ReelCategoryAdmin(admin.ModelAdmin):
    list_display = ['key', 'label', 'icon']


@admin.register(Reel)
class ReelAdmin(admin.ModelAdmin):
    list_display = ['id', 'creator', 'category', 'moderation_status', 'views_count', 'likes_count', 'created_at']
    list_filter = ['moderation_status', 'category', 'created_at']
    search_fields = ['creator__username', 'description']
    readonly_fields = ['views_count', 'likes_count', 'comments_count', 'shares_count', 'saves_count', 'report_count', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Content', {'fields': ('creator', 'video', 'thumbnail', 'description', 'category', 'hashtags', 'duration')}),
        ('Stats', {'fields': ('views_count', 'likes_count', 'comments_count', 'shares_count', 'saves_count', 'report_count')}),
        ('Moderation', {'fields': ('moderation_status', 'moderation_reason')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )


@admin.register(ReelComment)
class ReelCommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'reel', 'author', 'likes_count', 'created_at']
    list_filter = ['created_at']
    search_fields = ['author__username', 'content']


@admin.register(ReelLike)
class ReelLikeAdmin(admin.ModelAdmin):
    list_display = ['reel', 'user', 'created_at']
    list_filter = ['created_at']


@admin.register(ReelSave)
class ReelSaveAdmin(admin.ModelAdmin):
    list_display = ['reel', 'user', 'created_at']
    list_filter = ['created_at']


@admin.register(ReelView)
class ReelViewAdmin(admin.ModelAdmin):
    list_display = ['reel', 'user', 'watch_time', 'completed', 'created_at']
    list_filter = ['completed', 'created_at']


@admin.register(ReelReport)
class ReelReportAdmin(admin.ModelAdmin):
    list_display = ['reel', 'reporter', 'reason', 'created_at']
    list_filter = ['reason', 'created_at']
    search_fields = ['reporter__username']
