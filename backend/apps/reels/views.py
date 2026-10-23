from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
# from django_ratelimit.decorators import ratelimit  # comentado para dev rápido
from django.utils.decorators import method_decorator
from django.db.models import Q

from .models import Reel, ReelCategory, ReelComment, ReelLike, ReelSave, ReelView, ReelReport
from .serializers import ReelSerializer, ReelUploadSerializer, ReelCategorySerializer, ReelCommentSerializer
# from .tasks import process_reel_video  # comentado para dev rápido - requer celery


class ReelPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class ReelCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ReelCategory.objects.all()
    serializer_class = ReelCategorySerializer
    permission_classes = [permissions.AllowAny]


class ReelViewSet(viewsets.ModelViewSet):
    queryset = Reel.objects.filter(moderation_status='approved')
    serializer_class = ReelSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = ReelPagination
    
    def get_serializer_class(self):
        if self.action == 'upload':
            return ReelUploadSerializer
        return ReelSerializer
    
    @action(detail=False, methods=['post'])
    def upload(self, request):
        """Upload new reel"""
        serializer = ReelUploadSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        reel = serializer.save()
        
        # Process video asynchronously (comentado para dev rápido - requer celery)
        # process_reel_video.delay(reel.id)
        
        return Response(
            ReelSerializer(reel, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=False, methods=['get'])
    def feed(self, request):
        """Get personalized reel feed"""
        reels = Reel.objects.filter(moderation_status='approved').order_by('-created_at')
        
        page = self.paginate_queryset(reels)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(reels, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def trending(self, request):
        """Get trending reels"""
        reels = Reel.objects.filter(moderation_status='approved').order_by('-likes_count', '-views_count')[:20]
        serializer = self.get_serializer(reels, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search reels by hashtag or description"""
        query = request.query_params.get('q', '')
        category = request.query_params.get('category', '')
        
        reels = Reel.objects.filter(moderation_status='approved')
        
        if query:
            reels = reels.filter(
                Q(description__icontains=query) |
                Q(hashtags__contains=query)
            )
        
        if category:
            reels = reels.filter(category__key=category)
        
        page = self.paginate_queryset(reels)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(reels, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        """Like a reel"""
        reel = self.get_object()
        like, created = ReelLike.objects.get_or_create(reel=reel, user=request.user)
        
        if created:
            reel.likes_count += 1
            reel.save(update_fields=['likes_count'])
            return Response({'detail': 'Reel liked'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'detail': 'Already liked'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def unlike(self, request, pk=None):
        """Unlike a reel"""
        reel = self.get_object()
        like = ReelLike.objects.filter(reel=reel, user=request.user).first()
        
        if like:
            like.delete()
            reel.likes_count = max(0, reel.likes_count - 1)
            reel.save(update_fields=['likes_count'])
            return Response({'detail': 'Reel unliked'})
        else:
            return Response({'detail': 'Not liked'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def save(self, request, pk=None):
        """Save a reel"""
        reel = self.get_object()
        save, created = ReelSave.objects.get_or_create(reel=reel, user=request.user)
        
        if created:
            reel.saves_count += 1
            reel.save(update_fields=['saves_count'])
            return Response({'detail': 'Reel saved'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'detail': 'Already saved'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def unsave(self, request, pk=None):
        """Unsave a reel"""
        reel = self.get_object()
        save = ReelSave.objects.filter(reel=reel, user=request.user).first()
        
        if save:
            save.delete()
            reel.saves_count = max(0, reel.saves_count - 1)
            reel.save(update_fields=['saves_count'])
            return Response({'detail': 'Reel unsaved'})
        else:
            return Response({'detail': 'Not saved'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def comment(self, request, pk=None):
        """Add comment to reel"""
        reel = self.get_object()
        serializer = ReelCommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        comment = ReelComment.objects.create(
            reel=reel,
            author=request.user,
            content=serializer.validated_data['content']
        )
        reel.comments_count += 1
        reel.save(update_fields=['comments_count'])
        
        return Response(
            ReelCommentSerializer(comment).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'])
    def view(self, request, pk=None):
        """Track reel view"""
        reel = self.get_object()
        watch_time = request.data.get('watch_time', 0)
        completed = request.data.get('completed', False)
        
        ReelView.objects.create(
            reel=reel,
            user=request.user,
            watch_time=watch_time,
            completed=completed
        )
        
        reel.views_count += 1
        reel.save(update_fields=['views_count'])
        
        return Response({'detail': 'View tracked'})
    
    @action(detail=True, methods=['post'])
    def report(self, request, pk=None):
        """Report a reel"""
        reel = self.get_object()
        reason = request.data.get('reason')
        description = request.data.get('description', '')
        
        if not reason:
            return Response({'reason': 'This field is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        report, created = ReelReport.objects.get_or_create(
            reel=reel,
            reporter=request.user,
            defaults={'reason': reason, 'description': description}
        )
        
        if created:
            reel.report_count += 1
            reel.save(update_fields=['report_count'])
            return Response({'detail': 'Report submitted'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'detail': 'Already reported'}, status=status.HTTP_400_BAD_REQUEST)
