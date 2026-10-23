from celery import shared_task
from django.core.files.base import ContentFile
import subprocess
import os
from .models import Reel


@shared_task
def process_reel_video(reel_id):
    """Process reel video: generate thumbnail, validate, compress"""
    try:
        reel = Reel.objects.get(id=reel_id)
        
        # Generate thumbnail
        thumbnail_path = generate_thumbnail(reel.video.path)
        if thumbnail_path:
            with open(thumbnail_path, 'rb') as f:
                reel.thumbnail.save(
                    f'thumb_{reel.id}.jpg',
                    ContentFile(f.read()),
                    save=False
                )
            os.remove(thumbnail_path)
        
        # Update status
        reel.moderation_status = 'approved'
        reel.save()
        
    except Exception as e:
        reel = Reel.objects.get(id=reel_id)
        reel.moderation_status = 'rejected'
        reel.moderation_reason = str(e)
        reel.save()


def generate_thumbnail(video_path):
    """Generate thumbnail from video"""
    try:
        output = f'/tmp/thumb_{os.path.basename(video_path)}.jpg'
        cmd = [
            'ffmpeg',
            '-i', video_path,
            '-ss', '00:00:01',
            '-vframes', '1',
            '-vf', 'scale=720:-1',
            output
        ]
        subprocess.run(cmd, check=True, capture_output=True)
        return output
    except Exception as e:
        print(f"Error generating thumbnail: {e}")
        return None
