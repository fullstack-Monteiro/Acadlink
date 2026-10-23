from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()


class ReelCategory(models.Model):
    CATEGORY_CHOICES = [
        ('StudyTips', 'Dicas de Estudo'),
        ('ProjectShowcase', 'Projetos'),
        ('CampusLife', 'Vida no Campus'),
        ('CareerAdvice', 'Carreira'),
        ('ResearchHighlights', 'Pesquisa'),
        ('SkillDemo', 'Habilidades'),
    ]
    
    key = models.CharField(max_length=50, unique=True, choices=CATEGORY_CHOICES)
    label = models.CharField(max_length=100)
    icon = models.CharField(max_length=10)
    color = models.CharField(max_length=7)
    
    class Meta:
        db_table = 'reel_categories'
        verbose_name_plural = 'Reel Categories'
    
    def __str__(self):
        return self.label


class Reel(models.Model):
    MODERATION_STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('approved', 'Aprovado'),
        ('rejected', 'Rejeitado'),
        ('flagged', 'Marcado'),
    ]
    
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reels')
    video = models.FileField(upload_to='reels/videos/')
    thumbnail = models.ImageField(upload_to='reels/thumbnails/', null=True, blank=True)
    
    description = models.TextField(max_length=500, blank=True)
    category = models.ForeignKey(ReelCategory, on_delete=models.PROTECT)
    hashtags = models.JSONField(default=list)
    
    duration = models.IntegerField(validators=[MinValueValidator(15), MaxValueValidator(90)])
    
    # Stats
    views_count = models.IntegerField(default=0)
    unique_views_count = models.IntegerField(default=0)
    likes_count = models.IntegerField(default=0)
    comments_count = models.IntegerField(default=0)
    shares_count = models.IntegerField(default=0)
    saves_count = models.IntegerField(default=0)
    
    # Moderation
    moderation_status = models.CharField(max_length=20, choices=MODERATION_STATUS_CHOICES, default='pending')
    moderation_reason = models.TextField(blank=True)
    report_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'reels'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['creator', '-created_at']),
            models.Index(fields=['category', '-created_at']),
            models.Index(fields=['moderation_status']),
        ]
    
    def __str__(self):
        return f"Reel by {self.creator.username}"


class ReelLike(models.Model):
    reel = models.ForeignKey(Reel, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'reel_likes'
        unique_together = ['reel', 'user']
    
    def __str__(self):
        return f"{self.user.username} liked reel {self.reel.id}"


class ReelComment(models.Model):
    reel = models.ForeignKey(Reel, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(max_length=300)
    
    likes_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'reel_comments'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Comment on reel {self.reel.id}"


class ReelSave(models.Model):
    reel = models.ForeignKey(Reel, on_delete=models.CASCADE, related_name='saves')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'reel_saves'
        unique_together = ['reel', 'user']
    
    def __str__(self):
        return f"{self.user.username} saved reel {self.reel.id}"


class ReelView(models.Model):
    reel = models.ForeignKey(Reel, on_delete=models.CASCADE, related_name='view_records')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    watch_time = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    skipped = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'reel_views'
        indexes = [
            models.Index(fields=['reel', 'user']),
        ]
    
    def __str__(self):
        return f"View of reel {self.reel.id}"


class ReelReport(models.Model):
    REPORT_REASON_CHOICES = [
        ('inappropriate', 'Conteúdo Inapropriado'),
        ('spam', 'Spam'),
        ('harassment', 'Assédio'),
        ('copyright', 'Violação de Direitos Autorais'),
        ('other', 'Outro'),
    ]
    
    reel = models.ForeignKey(Reel, on_delete=models.CASCADE, related_name='reports')
    reporter = models.ForeignKey(User, on_delete=models.CASCADE)
    reason = models.CharField(max_length=50, choices=REPORT_REASON_CHOICES)
    description = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'reel_reports'
        unique_together = ['reel', 'reporter']
    
    def __str__(self):
        return f"Report on reel {self.reel.id}"
