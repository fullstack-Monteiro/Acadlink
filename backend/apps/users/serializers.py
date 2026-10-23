from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Profile, University, PortfolioItem

User = get_user_model()


class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ['id', 'name', 'acronym', 'country', 'courses']


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            'avatar', 'cover', 'bio', 'website',
            'connections_count', 'posts_count', 'reels_count',
            'profile_visibility', 'receive_notifications', 'receive_emails'
        ]


class PortfolioItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioItem
        fields = ['id', 'title', 'description', 'url', 'image', 'created_at']


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    university = UniversitySerializer(read_only=True)
    portfolio_items = PortfolioItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'university', 'course', 'year',
            'is_email_verified', 'is_university_verified',
            'profile', 'portfolio_items',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'is_email_verified', 'is_university_verified']


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    university_id = serializers.IntegerField(write_only=True)
    access_token = serializers.SerializerMethodField(read_only=True)
    refresh_token = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'university_id', 'course', 'year',
            'access_token', 'refresh_token'
        ]
    
    def validate(self, data):
        if data['password'] != data.pop('password_confirm'):
            raise serializers.ValidationError({'password': 'Passwords do not match'})
        
        # Validate Gmail only
        email_domain = data['email'].split('@')[1] if '@' in data['email'] else ''
        if email_domain != 'gmail.com':
            raise serializers.ValidationError({
                'email': 'Apenas emails Gmail são aceitos'
            })
        
        # Validate university exists
        try:
            university = University.objects.get(id=data['university_id'])
        except University.DoesNotExist:
            raise serializers.ValidationError({'university_id': 'University not found'})
        
        # Validate course exists in university
        course = data.get('course', '').strip()
        if course and not university.has_course(course):
            raise serializers.ValidationError({
                'course': f'This course is not offered by {university.name}'
            })
        
        return data
    
    def get_access_token(self, obj):
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(obj)
        return str(refresh.access_token)
    
    def get_refresh_token(self, obj):
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(obj)
        return str(refresh)
    
    def create(self, validated_data):
        university_id = validated_data.pop('university_id')
        user = User.objects.create_user(
            university_id=university_id,
            **validated_data
        )
        Profile.objects.create(user=user)
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'course', 'year']


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    new_password_confirm = serializers.CharField(write_only=True, min_length=8)
    
    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError({'new_password': 'Passwords do not match'})
        return data



class LoginSerializer(serializers.Serializer):
    """Serializer de login — valida email e senha"""
    email = serializers.EmailField(required=True, max_length=254)
    # Sem min_length — não revelamos requisitos de senha no login
    password = serializers.CharField(write_only=True, required=True, max_length=128)
    
    def validate_email(self, value):
        return value.lower().strip()
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            raise serializers.ValidationError('Email e senha são obrigatórios')
        
        # Buscar utilizador pelo email
        User = get_user_model()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError('Email ou senha incorretos')
        
        if not user.check_password(password):
            raise serializers.ValidationError('Email ou senha incorretos')
        
        if not user.is_active:
            raise serializers.ValidationError('Utilizador inativo')
        
        data['user'] = user
        return data
    
    def create(self, validated_data):
        return validated_data['user']
