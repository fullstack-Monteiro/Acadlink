from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Connection
from .serializers import ConnectionSerializer

User = get_user_model()


class ConnectionViewSet(viewsets.ModelViewSet):
    serializer_class = ConnectionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Connection.objects.filter(status='accepted')
    
    @action(detail=False, methods=['post'])
    def send_request(self, request):
        to_user_id = request.data.get('to_user_id')
        
        try:
            to_user = User.objects.get(id=to_user_id)
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        connection, created = Connection.objects.get_or_create(
            from_user=request.user,
            to_user=to_user,
            defaults={'status': 'pending'}
        )
        
        if created:
            return Response(
                ConnectionSerializer(connection).data,
                status=status.HTTP_201_CREATED
            )
        else:
            return Response({'detail': 'Request already sent'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        connection = self.get_object()
        
        if connection.to_user != request.user:
            return Response({'detail': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        
        connection.status = 'accepted'
        connection.save()
        
        return Response(ConnectionSerializer(connection).data)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        connection = self.get_object()
        
        if connection.to_user != request.user:
            return Response({'detail': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        
        connection.delete()
        return Response({'detail': 'Request rejected'})
    
    @action(detail=True, methods=['post'])
    def remove(self, request, pk=None):
        """Remove a connection"""
        connection = self.get_object()
        
        # Verificar se o usuário é um dos envolvidos
        if connection.from_user != request.user and connection.to_user != request.user:
            return Response({'detail': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        
        connection.delete()
        return Response({'detail': 'Connection removed'})
    
    @action(detail=False, methods=['get'])
    def pending_requests(self, request):
        """Get pending connection requests"""
        pending = Connection.objects.filter(to_user=request.user, status='pending')
        serializer = self.get_serializer(pending, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def sent_requests(self, request):
        """Get sent connection requests"""
        sent = Connection.objects.filter(from_user=request.user, status='pending')
        serializer = self.get_serializer(sent, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def block(self, request, pk=None):
        """Block a user"""
        connection = self.get_object()
        
        if connection.from_user != request.user and connection.to_user != request.user:
            return Response({'detail': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        
        connection.status = 'blocked'
        connection.save()
        
        return Response(ConnectionSerializer(connection).data)
