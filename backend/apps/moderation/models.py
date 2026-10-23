from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class ModerationLog(models.Model):
    ACTION_CHOICES = [
        ('approve', 'Aprovado'),
        ('reject', 'Rejeitado'),
        ('flag', 'Marcado'),
        ('ban_user', 'Utilizador Banido'),
        ('warn_user', 'Utilizador Avisado'),
    ]
    
    moderator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='moderation_actions')
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    
    content_type = models.CharField(max_length=50)
    object_id = models.IntegerField()
    
    reason = models.TextField()
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'moderation_logs'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.action} by {self.moderator.username}"


class UserBan(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='ban')
    reason = models.TextField()
    banned_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='bans_issued')
    
    is_permanent = models.BooleanField(default=False)
    banned_until = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_bans'
    
    def __str__(self):
        return f"Ban for {self.user.username}"
