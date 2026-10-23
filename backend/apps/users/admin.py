from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, University, Profile, PortfolioItem


@admin.register(University)
class UniversityAdmin(admin.ModelAdmin):
    list_display = ['name', 'acronym', 'country', 'email_domain']
    search_fields = ['name', 'acronym']
    list_filter = ['country']


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'university', 'is_email_verified', 'is_university_verified', 'created_at']
    list_filter = ['is_email_verified', 'is_university_verified', 'university', 'created_at']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('University Info', {'fields': ('university', 'course', 'year', 'is_university_verified')}),
        ('Verification', {'fields': ('is_email_verified', 'email_verification_token', 'email_verified_at')}),
        ('Security', {'fields': ('failed_login_attempts', 'last_failed_login', 'account_locked_until')}),
    )


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'connections_count', 'posts_count', 'reels_count', 'profile_visibility']
    list_filter = ['profile_visibility', 'receive_notifications']
    search_fields = ['user__username', 'user__email']


@admin.register(PortfolioItem)
class PortfolioItemAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'created_at']
    list_filter = ['created_at']
    search_fields = ['title', 'user__username']
