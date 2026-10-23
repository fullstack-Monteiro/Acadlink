from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
# from django_ratelimit.decorators import ratelimit  # comentado para dev rápido
from django.utils.decorators import method_decorator
from django.db.models import Q

from .models import Post, Comment, PostLike, SavedPost
from .serializers import PostSerializer, PostCreateSerializer, CommentSerializer


class PostPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PostPagination
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PostCreateSerializer
        return PostSerializer
    
    def create(self, request, *args, **kwargs):
        """Create new post"""
        return super().create(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def feed(self, request):
        """Get personalized feed"""
        posts = Post.objects.all().order_by('-created_at')
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        """Like a post"""
        post = self.get_object()
        like, created = PostLike.objects.get_or_create(post=post, user=request.user)
        
        if created:
            post.likes_count += 1
            post.save(update_fields=['likes_count'])
            return Response({'detail': 'Post liked'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'detail': 'Already liked'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def unlike(self, request, pk=None):
        """Unlike a post"""
        post = self.get_object()
        like = PostLike.objects.filter(post=post, user=request.user).first()
        
        if like:
            like.delete()
            post.likes_count = max(0, post.likes_count - 1)
            post.save(update_fields=['likes_count'])
            return Response({'detail': 'Post unliked'})
        else:
            return Response({'detail': 'Not liked'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def save(self, request, pk=None):
        """Save a post"""
        post = self.get_object()
        saved, created = SavedPost.objects.get_or_create(post=post, user=request.user)
        
        if created:
            return Response({'detail': 'Post saved'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'detail': 'Already saved'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def unsave(self, request, pk=None):
        """Unsave a post"""
        post = self.get_object()
        saved = SavedPost.objects.filter(post=post, user=request.user).first()
        
        if saved:
            saved.delete()
            return Response({'detail': 'Post unsaved'})
        else:
            return Response({'detail': 'Not saved'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def comment(self, request, pk=None):
        """Add comment to post"""
        post = self.get_object()
        serializer = CommentSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        comment = Comment.objects.create(
            post=post,
            author=request.user,
            content=serializer.validated_data['content']
        )
        post.comments_count += 1
        post.save(update_fields=['comments_count'])
        
        return Response(
            CommentSerializer(comment, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=False, methods=['get'])
    def saved(self, request):
        """Get saved posts"""
        saved_posts = SavedPost.objects.filter(user=request.user).values_list('post_id', flat=True)
        posts = Post.objects.filter(id__in=saved_posts).order_by('-created_at')
        
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)
