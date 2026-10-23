import os
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


class VideoValidator:
    """Validator for video files"""
    
    # Allowed video formats
    ALLOWED_FORMATS = ['mp4', 'webm', 'mov', 'avi', 'mkv']
    
    # Max file size: 500MB
    MAX_FILE_SIZE = 500 * 1024 * 1024
    
    # Min duration: 3 seconds
    MIN_DURATION = 3
    
    # Max duration: 10 minutes
    MAX_DURATION = 600
    
    # Min resolution: 480p
    MIN_WIDTH = 480
    MIN_HEIGHT = 480
    
    @staticmethod
    def validate_file_size(file):
        """Validate video file size"""
        if file.size > VideoValidator.MAX_FILE_SIZE:
            raise ValidationError(
                _('Video file size must be less than 500MB. Current size: %(size)sMB'),
                code='file_too_large',
                params={'size': round(file.size / (1024 * 1024), 2)},
            )
    
    @staticmethod
    def validate_file_format(file):
        """Validate video file format"""
        ext = os.path.splitext(file.name)[1].lower().lstrip('.')
        if ext not in VideoValidator.ALLOWED_FORMATS:
            raise ValidationError(
                _('Unsupported video format. Allowed formats: %(formats)s'),
                code='invalid_format',
                params={'formats': ', '.join(VideoValidator.ALLOWED_FORMATS)},
            )
    
    @staticmethod
    def validate_video(file):
        """Run all video validations"""
        VideoValidator.validate_file_size(file)
        VideoValidator.validate_file_format(file)


class ThumbnailValidator:
    """Validator for thumbnail images"""
    
    ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'webp']
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
    
    @staticmethod
    def validate_file_size(file):
        """Validate thumbnail file size"""
        if file.size > ThumbnailValidator.MAX_FILE_SIZE:
            raise ValidationError(
                _('Thumbnail file size must be less than 5MB'),
                code='file_too_large',
            )
    
    @staticmethod
    def validate_file_format(file):
        """Validate thumbnail file format"""
        ext = os.path.splitext(file.name)[1].lower().lstrip('.')
        if ext not in ThumbnailValidator.ALLOWED_FORMATS:
            raise ValidationError(
                _('Unsupported image format. Allowed formats: %(formats)s'),
                code='invalid_format',
                params={'formats': ', '.join(ThumbnailValidator.ALLOWED_FORMATS)},
            )
    
    @staticmethod
    def validate_thumbnail(file):
        """Run all thumbnail validations"""
        ThumbnailValidator.validate_file_size(file)
        ThumbnailValidator.validate_file_format(file)


class ReelDataValidator:
    """Validator for reel metadata"""
    
    MIN_TITLE_LENGTH = 3
    MAX_TITLE_LENGTH = 200
    MAX_DESCRIPTION_LENGTH = 5000
    MAX_TAGS = 10
    MAX_TAG_LENGTH = 50
    
    @staticmethod
    def validate_title(title):
        """Validate reel title"""
        if not title or len(title.strip()) < ReelDataValidator.MIN_TITLE_LENGTH:
            raise ValidationError(
                _('Title must be at least %(min)d characters'),
                code='title_too_short',
                params={'min': ReelDataValidator.MIN_TITLE_LENGTH},
            )
        
        if len(title) > ReelDataValidator.MAX_TITLE_LENGTH:
            raise ValidationError(
                _('Title must be less than %(max)d characters'),
                code='title_too_long',
                params={'max': ReelDataValidator.MAX_TITLE_LENGTH},
            )
    
    @staticmethod
    def validate_description(description):
        """Validate reel description"""
        if description and len(description) > ReelDataValidator.MAX_DESCRIPTION_LENGTH:
            raise ValidationError(
                _('Description must be less than %(max)d characters'),
                code='description_too_long',
                params={'max': ReelDataValidator.MAX_DESCRIPTION_LENGTH},
            )
    
    @staticmethod
    def validate_tags(tags):
        """Validate reel tags"""
        if not tags:
            return
        
        tag_list = [t.strip() for t in tags.split(',') if t.strip()]
        
        if len(tag_list) > ReelDataValidator.MAX_TAGS:
            raise ValidationError(
                _('Maximum %(max)d tags allowed'),
                code='too_many_tags',
                params={'max': ReelDataValidator.MAX_TAGS},
            )
        
        for tag in tag_list:
            if len(tag) > ReelDataValidator.MAX_TAG_LENGTH:
                raise ValidationError(
                    _('Tag "%(tag)s" is too long (max %(max)d characters)'),
                    code='tag_too_long',
                    params={'tag': tag, 'max': ReelDataValidator.MAX_TAG_LENGTH},
                )
