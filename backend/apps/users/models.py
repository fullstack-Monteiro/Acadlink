from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import EmailValidator, URLValidator
from django.utils.translation import gettext_lazy as _

class University(models.Model):
    name = models.CharField(max_length=255, unique=True)
    acronym = models.CharField(max_length=50, unique=True)
    country = models.CharField(max_length=100)
    website = models.URLField(blank=True)
    email_domain = models.CharField(max_length=100, help_text="e.g., uem.ac.mz")
    courses = models.JSONField(default=list, help_text="Lista de cursos oferecidos")
    
    class Meta:
        db_table = 'universities'
        verbose_name_plural = 'Universities'
    
    def __str__(self):
        return self.name
    
    def has_course(self, course_name):
        """Verifica se a universidade oferece este curso"""
        return course_name in self.courses


class User(AbstractUser):
    email = models.EmailField(unique=True, validators=[EmailValidator()])
    university = models.ForeignKey(University, on_delete=models.PROTECT, null=True, blank=True)
    course = models.CharField(max_length=200, blank=True)
    year = models.IntegerField(null=True, blank=True, choices=[(i, f'{i}º Ano') for i in range(1, 7)])
    
    # Verification
    is_email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=100, blank=True)
    email_verified_at = models.DateTimeField(null=True, blank=True)
    
    # University verification
    is_university_verified = models.BooleanField(default=False)
    university_verified_at = models.DateTimeField(null=True, blank=True)
    
    # Security
    failed_login_attempts = models.IntegerField(default=0)
    last_failed_login = models.DateTimeField(null=True, blank=True)
    account_locked_until = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['username']),
            models.Index(fields=['university']),
        ]
    
    def __str__(self):
        return self.get_full_name() or self.username


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    cover = models.ImageField(upload_to='covers/', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    website = models.URLField(blank=True, validators=[URLValidator()])
    
    # Stats
    connections_count = models.IntegerField(default=0)
    posts_count = models.IntegerField(default=0)
    reels_count = models.IntegerField(default=0)
    
    # Privacy
    VISIBILITY_CHOICES = [
        ('public', _('Público')),
        ('connections', _('Apenas Conexões')),
        ('private', _('Privado')),
    ]
    profile_visibility = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default='public')
    
    # Preferences
    receive_notifications = models.BooleanField(default=True)
    receive_emails = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'profiles'
    
    def __str__(self):
        return f"Profile of {self.user.username}"


class PortfolioItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='portfolio_items')
    title = models.CharField(max_length=255)
    description = models.TextField()
    url = models.URLField(blank=True)
    image = models.ImageField(upload_to='portfolio/', null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'portfolio_items'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
