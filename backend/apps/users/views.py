from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.conf import settings
import uuid
import requests  # Para validar token do Google
from django.utils.decorators import method_decorator

from .models import Profile, University, PortfolioItem
from .serializers import (
    UserSerializer, UserRegisterSerializer, UserUpdateSerializer,
    PasswordChangeSerializer, UniversitySerializer, PortfolioItemSerializer,
    LoginSerializer
)

User = get_user_model()


class UniversityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = University.objects.all()
    serializer_class = UniversitySerializer
    permission_classes = [permissions.AllowAny]
    search_fields = ['name', 'acronym', 'country']


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user profile"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request):
        """Login com JWT tokens no body + HttpOnly cookies"""
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        
        response = Response(
            {
                'user': UserSerializer(user).data,
                'access_token': access_token,
                'refresh_token': refresh_token,
                'detail': 'Login realizado com sucesso'
            },
            status=status.HTTP_200_OK
        )
        
        # Também guardar em HttpOnly cookies (dupla protecção)
        response.set_cookie(
            'access_token',
            access_token,
            max_age=15 * 60,
            httponly=True,
            secure=not settings.DEBUG,
            samesite='Lax'
        )
        response.set_cookie(
            'refresh_token',
            refresh_token,
            max_age=24 * 60 * 60,
            httponly=True,
            secure=not settings.DEBUG,
            samesite='Lax'
        )
        
        return response
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def logout(self, request):
        """Logout e limpar cookies"""
        response = Response(
            {'detail': 'Logout realizado com sucesso'},
            status=status.HTTP_200_OK
        )
        
        # Remover cookies
        response.delete_cookie('access_token', samesite='Lax')
        response.delete_cookie('refresh_token', samesite='Lax')
        
        return response
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def refresh(self, request):
        """Refresh access token usando refresh token do cookie"""
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            
            if not refresh_token:
                return Response(
                    {'detail': 'Refresh token não encontrado'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            refresh = RefreshToken(refresh_token)
            
            response = Response(
                {'detail': 'Token refreshed com sucesso'},
                status=status.HTTP_200_OK
            )
            
            # Atualizar access token
            response.set_cookie(
                'access_token',
                str(refresh.access_token),
                max_age=15 * 60,
                httponly=True,
                secure=not settings.DEBUG,
                samesite='Lax'
            )
            
            return response
        except Exception as e:
            return Response(
                {'detail': f'Token inválido: {str(e)}'},
                status=status.HTTP_401_UNAUTHORIZED
            )
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        """Cria conta e inicia sessão (JWT no body + cookies)."""
        serializer = UserRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response = Response(
            {
                'user': UserSerializer(user).data,
                'access_token': access_token,
                'refresh_token': refresh_token,
                'detail': 'Conta criada com sucesso',
            },
            status=status.HTTP_201_CREATED,
        )
        response.set_cookie(
            'access_token',
            access_token,
            max_age=15 * 60,
            httponly=True,
            secure=not settings.DEBUG,
            samesite='Lax',
        )
        response.set_cookie(
            'refresh_token',
            refresh_token,
            max_age=24 * 60 * 60,
            httponly=True,
            secure=not settings.DEBUG,
            samesite='Lax',
        )
        return response
    
    @action(detail=False, methods=['put'])
    def update_profile(self, request):
        """Update user profile"""
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(request.user).data)
    
    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """Change user password"""
        serializer = PasswordChangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        if not request.user.check_password(serializer.validated_data['old_password']):
            return Response(
                {'old_password': 'Incorrect password'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        
        return Response({'detail': 'Password changed successfully'})
    
    @action(detail=True, methods=['get'])
    def public_profile(self, request, pk=None):
        """Get public profile of another user"""
        user = self.get_object()
        
        # Check visibility
        if user.profile.profile_visibility == 'private' and user != request.user:
            return Response(
                {'detail': 'This profile is private'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def forgot_password(self, request):
        """Request password reset"""
        email = request.data.get('email')
        
        if not email:
            return Response(
                {'email': 'Email is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email=email)
            # Gerar token de reset
            reset_token = str(uuid.uuid4())
            user.email_verification_token = reset_token
            user.save()
            
            # Enviar email
            reset_url = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}&email={email}"
            send_mail(
                'Recuperação de Senha - AcadLink',
                f'Clique no link para resetar sua senha: {reset_url}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
            
            return Response({
                'detail': 'Email de recuperação enviado com sucesso'
            })
        except User.DoesNotExist:
            # Não revelar se o email existe ou não (segurança)
            return Response({
                'detail': 'Se o email existe, você receberá um link de recuperação'
            })
        except Exception as e:
            return Response(
                {'detail': f'Erro ao enviar email: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def google_login(self, request):
        """
        Autenticação via Google OAuth 2.0
        
        Recebe: { "access_token": "google_access_token" }
        Retorna: { "access_token": "jwt", "refresh_token": "jwt", "user": {...} }
        """
        try:
            token = request.data.get('access_token')
            
            if not token:
                return Response(
                    {'detail': 'access_token é obrigatório'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validar token com Google API
            try:
                response = requests.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    headers={'Authorization': f'Bearer {token}'},
                    timeout=10
                )
                
                if response.status_code != 200:
                    return Response(
                        {'detail': 'Token do Google inválido'},
                        status=status.HTTP_401_UNAUTHORIZED
                    )
                
                google_user = response.json()
                
            except requests.exceptions.RequestException as e:
                return Response(
                    {'detail': f'Erro ao validar token com Google: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Extrair informações do usuário
            email = google_user.get('email')
            if not email:
                return Response(
                    {'detail': 'Email não encontrado no perfil do Google'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Verificar se email é verificado pelo Google
            email_verified = google_user.get('email_verified', False)
            if not email_verified:
                return Response(
                    {'detail': 'Email não verificado pelo Google'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Buscar ou criar usuário
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0] + '_' + get_random_string(4),
                    'first_name': google_user.get('given_name', ''),
                    'last_name': google_user.get('family_name', ''),
                    'is_email_verified': True,
                }
            )
            
            # Se usuário já existia, atualizar informações
            if not created:
                if not user.first_name and google_user.get('given_name'):
                    user.first_name = google_user.get('given_name')
                if not user.last_name and google_user.get('family_name'):
                    user.last_name = google_user.get('family_name')
                user.is_email_verified = True
                user.save()
            
            # Gerar JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
                'user': UserSerializer(user).data,
                'created': created  # Indica se é novo usuário
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'detail': f'Erro no login com Google: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def reset_password(self, request):
        """Reset password with token"""
        email = request.data.get('email')
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        
        if not all([email, token, new_password]):
            return Response(
                {'detail': 'Email, token e new_password são obrigatórios'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email=email, email_verification_token=token)
            user.set_password(new_password)
            user.email_verification_token = ''  # Invalidar token
            user.save()
            
            return Response({
                'detail': 'Senha alterada com sucesso'
            })
        except User.DoesNotExist:
            return Response(
                {'detail': 'Token inválido ou expirado'},
                status=status.HTTP_400_BAD_REQUEST
            )


class PortfolioViewSet(viewsets.ModelViewSet):
    serializer_class = PortfolioItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return PortfolioItem.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
