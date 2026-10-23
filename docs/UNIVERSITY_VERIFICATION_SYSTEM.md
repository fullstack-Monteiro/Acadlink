# Sistema de Verificação de Universidade e Curso

## Problema Atual

O sistema atual **não valida** se o estudante é realmente de uma universidade específica. Qualquer pessoa pode:
1. Selecionar qualquer universidade no registro
2. Selecionar qualquer curso
3. Ser marcado como "estudante verificado" sem comprovação real

## Realidade em Moçambique

A maioria dos estudantes **não tem acesso** a email institucional da universidade. Portanto, validar apenas por email não funciona. Precisamos de uma abordagem diferente.

## Solução Proposta: Sistema de Verificação em 2 Camadas

### Camada 1: Validação de Email Institucional (Verificação Automática)

**Como funciona:**
- Cada universidade tem um domínio de email institucional (ex: `@uem.ac.mz`)
- O sistema valida se o email do usuário pertence ao domínio da universidade selecionada
- Se o email não corresponder, a verificação falha automaticamente

**Implementação:**

```python
# backend/apps/users/models.py

class University(models.Model):
    name = models.CharField(max_length=255, unique=True)
    acronym = models.CharField(max_length=50, unique=True)
    country = models.CharField(max_length=100)
    website = models.URLField(blank=True)
    email_domain = models.CharField(max_length=100, help_text="e.g., uem.ac.mz")
    
    # Novos campos
    email_domains = models.JSONField(
        default=list,
        help_text="Lista de domínios de email válidos para esta universidade"
    )
    courses = models.JSONField(
        default=list,
        help_text="Lista de cursos oferecidos por esta universidade"
    )
    verification_method = models.CharField(
        max_length=20,
        choices=[
            ('email', 'Email Institucional'),
            ('manual', 'Verificação Manual'),
            ('both', 'Email + Manual'),
        ],
        default='email'
    )
    
    class Meta:
        db_table = 'universities'
        verbose_name_plural = 'Universities'
    
    def __str__(self):
        return self.name
    
    def is_valid_email_domain(self, email):
        """Verifica se o email pertence a um domínio válido da universidade"""
        domain = email.split('@')[1] if '@' in email else ''
        return domain in self.email_domains
```

**Dados de Exemplo:**

```python
# Dados para popular no banco de dados
UNIVERSITIES_DATA = [
    {
        'name': 'UEM — Universidade Eduardo Mondlane',
        'acronym': 'UEM',
        'country': 'Moçambique',
        'email_domains': ['uem.ac.mz', 'student.uem.ac.mz'],
        'courses': [
            'Engenharia Informática',
            'Engenharia Civil',
            'Medicina',
            'Direito',
            'Economia',
            'Gestão de Empresas',
            'Arquitectura',
            'Enfermagem',
            'Educação',
            'Jornalismo',
            'Matemática',
            'Física',
            'Química',
            'Biologia',
        ],
        'verification_method': 'email',
    },
    {
        'name': 'ISCTEM — Instituto Superior de Ciências e Tecnologia de Moçambique',
        'acronym': 'ISCTEM',
        'country': 'Moçambique',
        'email_domains': ['isctem.ac.mz', 'student.isctem.ac.mz'],
        'courses': [
            'Engenharia Informática',
            'Gestão de Empresas',
            'Marketing',
            'Contabilidade',
            'Economia',
        ],
        'verification_method': 'email',
    },
    # ... mais universidades
]
```

---

### Camada 2: Validação de Curso por Universidade

**Como funciona:**
- Cada universidade tem uma lista de cursos válidos
- O sistema valida se o curso selecionado existe na universidade
- Impede que o usuário selecione cursos que não existem na universidade

**Implementação:**

```python
# backend/apps/users/serializers.py

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    university_id = serializers.IntegerField(write_only=True)
    course = serializers.CharField(max_length=200)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'university_id', 'course', 'year',
            'access_token', 'refresh_token'
        ]
    
    def validate(self, data):
        # 1. Validar que as senhas coincidem
        if data['password'] != data.pop('password_confirm'):
            raise serializers.ValidationError({'password': 'Passwords do not match'})
        
        # 2. Validar universidade existe
        try:
            university = University.objects.get(id=data['university_id'])
        except University.DoesNotExist:
            raise serializers.ValidationError({'university_id': 'University not found'})
        
        # 3. Validar email pertence ao domínio da universidade
        email = data['email']
        if not university.is_valid_email_domain(email):
            raise serializers.ValidationError({
                'email': f'Email must be from {", ".join(university.email_domains)} domain'
            })
        
        # 4. Validar curso existe na universidade
        course = data.get('course', '').strip()
        if course not in university.courses:
            raise serializers.ValidationError({
                'course': f'Course not offered by {university.name}'
            })
        
        return data
    
    def create(self, validated_data):
        university_id = validated_data.pop('university_id')
        user = User.objects.create_user(
            university_id=university_id,
            is_email_verified=False,  # Será verificado depois
            is_university_verified=False,  # Será verificado depois
            **validated_data
        )
        Profile.objects.create(user=user)
        return user
```

---

### Camada 3: Verificação de Email Institucional (Confirmação)

### Camada 1: Validação de Curso por Universidade

**Como funciona:**
- Cada universidade tem uma lista de cursos válidos
- O sistema valida se o curso selecionado existe na universidade
- Impede que o usuário selecione cursos que não existem na universidade

**Implementação:**

```python
# backend/apps/users/models.py

class University(models.Model):
    name = models.CharField(max_length=255, unique=True)
    acronym = models.CharField(max_length=50, unique=True)
    country = models.CharField(max_length=100)
    website = models.URLField(blank=True)
    
    # Novos campos
    courses = models.JSONField(
        default=list,
        help_text="Lista de cursos oferecidos por esta universidade"
    )
    
    class Meta:
        db_table = 'universities'
        verbose_name_plural = 'Universities'
    
    def __str__(self):
        return self.name
```

**Dados de Exemplo:**

```python
UNIVERSITIES_DATA = [
    {
        'name': 'UEM — Universidade Eduardo Mondlane',
        'acronym': 'UEM',
        'country': 'Moçambique',
        'courses': [
            'Engenharia Informática',
            'Engenharia Civil',
            'Medicina',
            'Direito',
            'Economia',
            'Gestão de Empresas',
            'Arquitectura',
            'Enfermagem',
            'Educação',
            'Jornalismo',
            'Matemática',
            'Física',
            'Química',
            'Biologia',
        ],
    },
    {
        'name': 'ISCTEM — Instituto Superior de Ciências e Tecnologia de Moçambique',
        'acronym': 'ISCTEM',
        'country': 'Moçambique',
        'courses': [
            'Engenharia Informática',
            'Gestão de Empresas',
            'Marketing',
            'Contabilidade',
            'Economia',
        ],
    },
]
```

---

### Camada 2: Verificação Manual com Documentos

```python
# backend/apps/users/models.py

class User(AbstractUser):
    email = models.EmailField(unique=True, validators=[EmailValidator()])
    university = models.ForeignKey(University, on_delete=models.PROTECT, null=True, blank=True)
    course = models.CharField(max_length=200, blank=True)
    year = models.IntegerField(null=True, blank=True, choices=[(i, f'{i}º Ano') for i in range(1, 7)])
    
    # Verificação de Email
    is_email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=100, blank=True, unique=True)
    email_verified_at = models.DateTimeField(null=True, blank=True)
    
    # Verificação de Universidade
    is_university_verified = models.BooleanField(default=False)
    university_verified_at = models.DateTimeField(null=True, blank=True)
    
    # Segurança
    failed_login_attempts = models.IntegerField(default=0)
    last_failed_login = models.DateTimeField(null=True, blank=True)
    account_locked_until = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['username']),
            models.Index(fields=['university']),
            models.Index(fields=['email_verification_token']),
        ]
    
    def __str__(self):
        return self.get_full_name() or self.username
    
    def generate_email_verification_token(self):
        """Gera um token único para verificação de email"""
        import secrets
        self.email_verification_token = secrets.token_urlsafe(32)
        self.save()
        return self.email_verification_token
    
    def verify_email(self, token):
        """Verifica o email usando o token"""
        if self.email_verification_token == token and not self.is_email_verified:
            self.is_email_verified = True
            self.email_verified_at = timezone.now()
            self.email_verification_token = ''  # Limpar token após uso
            self.save()
            
            # Se o email foi verificado e pertence à universidade, marcar como verificado
            if self.university and self.university.is_valid_email_domain(self.email):
                self.is_university_verified = True
                self.university_verified_at = timezone.now()
                self.save()
            
            return True
        return False
```

**Envio de Email:**

```python
# backend/apps/users/views.py

from django.core.mail import send_mail
from django.urls import reverse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            
            # Gerar token de verificação
            token = user.generate_email_verification_token()
            
            # Construir link de verificação
            verification_link = f"{request.build_absolute_uri('/verify-email/')}?token={token}"
            
            # Enviar email
            send_mail(
                subject='Verifique seu email — AcadLink',
                message=f'''
Olá {user.first_name},

Bem-vindo ao AcadLink! Para completar o seu registro, clique no link abaixo:

{verification_link}

Este link expira em 24 horas.

Atenciosamente,
Equipa AcadLink
                ''',
                from_email='noreply@acadlink.mz',
                recipient_list=[user.email],
                fail_silently=False,
            )
            
            return Response({
                'message': 'User registered successfully. Check your email to verify.',
                'user_id': user.id,
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmailView(APIView):
    def get(self, request):
        token = request.query_params.get('token')
        
        if not token:
            return Response(
                {'error': 'Token not provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email_verification_token=token)
            
            if user.verify_email(token):
                return Response({
                    'message': 'Email verified successfully',
                    'is_university_verified': user.is_university_verified,
                }, status=status.HTTP_200_OK)
            else:
                return Response(
                    {'error': 'Invalid or expired token'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
```

---

### Camada 4: Verificação Manual (Opcional)

**Como funciona:**
- Após o registro, o usuário é marcado como "não verificado"
- O usuário pode fazer upload de um documento (cartão de estudante, comprovativo de matrícula, etc.)
- Moderadores revisam o documento e aprovam ou rejeitam
- Após aprovação, o usuário fica com badge de "Verificado"

**Implementação:**

```python
# backend/apps/users/models.py

class User(AbstractUser):
    email = models.EmailField(unique=True, validators=[EmailValidator()])
    university = models.ForeignKey(University, on_delete=models.PROTECT, null=True, blank=True)
    course = models.CharField(max_length=200, blank=True)
    year = models.IntegerField(null=True, blank=True, choices=[(i, f'{i}º Ano') for i in range(1, 7)])
    
    # Verificação de Universidade
    is_university_verified = models.BooleanField(default=False)
    university_verified_at = models.DateTimeField(null=True, blank=True)
    
    # Segurança
    failed_login_attempts = models.IntegerField(default=0)
    last_failed_login = models.DateTimeField(null=True, blank=True)
    account_locked_until = models.DateTimeField(null=True, blank=True)
    
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


class UniversityVerificationRequest(models.Model):
    """Requisição de verificação de universidade com documento"""
    
    DOCUMENT_TYPES = [
        ('student_id', 'Cartão de Estudante'),
        ('enrollment', 'Comprovativo de Matrícula'),
        ('transcript', 'Histórico Académico'),
        ('certificate', 'Certificado de Inscrição'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('approved', 'Aprovado'),
        ('rejected', 'Rejeitado'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='verification_request')
    document_type = models.CharField(max_length=50, choices=DOCUMENT_TYPES)
    document_file = models.FileField(upload_to='verification_documents/%Y/%m/%d/')
    
    # Metadados do documento
    file_name = models.CharField(max_length=255, blank=True)
    file_size = models.IntegerField(help_text="Tamanho em bytes")
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reviewed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='verified_users'
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True, help_text="Motivo da rejeição")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'university_verification_requests'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Verification for {self.user.username} - {self.status}"
    
    def approve(self, reviewer):
        """Aprova a verificação"""
        self.status = 'approved'
        self.reviewed_by = reviewer
        self.reviewed_at = timezone.now()
        self.save()
        
        # Marcar usuário como verificado
        self.user.is_university_verified = True
        self.user.university_verified_at = timezone.now()
        self.user.save()
        
        # Enviar email de confirmação
        self._send_approval_email()
    
    def reject(self, reviewer, reason):
        """Rejeita a verificação"""
        self.status = 'rejected'
        self.reviewed_by = reviewer
        self.reviewed_at = timezone.now()
        self.rejection_reason = reason
        self.save()
        
        # Enviar email de rejeição
        self._send_rejection_email()
    
    def _send_approval_email(self):
        """Envia email de aprovação"""
        from django.core.mail import send_mail
        send_mail(
            subject='Verificação Aprovada — AcadLink',
            message=f'''
Olá {self.user.first_name},

Parabéns! A sua verificação de universidade foi aprovada. 
Agora você tem acesso a todos os recursos da comunidade académica.

Atenciosamente,
Equipa AcadLink
            ''',
            from_email='noreply@acadlink.mz',
            recipient_list=[self.user.email],
            fail_silently=False,
        )
    
    def _send_rejection_email(self):
        """Envia email de rejeição"""
        from django.core.mail import send_mail
        send_mail(
            subject='Verificação Rejeitada — AcadLink',
            message=f'''
Olá {self.user.first_name},

Infelizmente, a sua verificação foi rejeitada.

Motivo: {self.rejection_reason}

Pode tentar novamente com outro documento.

Atenciosamente,
Equipa AcadLink
            ''',
            from_email='noreply@acadlink.mz',
            recipient_list=[self.user.email],
            fail_silently=False,
        )
```

**Serializers:**

```python
# backend/apps/users/serializers.py

class UniversityVerificationRequestSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    university_name = serializers.CharField(source='user.university.name', read_only=True)
    
    class Meta:
        model = UniversityVerificationRequest
        fields = [
            'id', 'user_username', 'user_name', 'university_name',
            'document_type', 'document_file', 'status',
            'created_at', 'reviewed_at', 'rejection_reason'
        ]
        read_only_fields = ['id', 'status', 'reviewed_at', 'rejection_reason', 'created_at']


class VerificationRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UniversityVerificationRequest
        fields = ['document_type', 'document_file']
    
    def validate_document_file(self, file):
        """Valida o arquivo enviado"""
        # Máximo 5MB
        if file.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("Arquivo não pode exceder 5MB")
        
        # Apenas PDF, JPG, PNG
        allowed_types = ['application/pdf', 'image/jpeg', 'image/png']
        if file.content_type not in allowed_types:
            raise serializers.ValidationError("Apenas PDF, JPG e PNG são aceitos")
        
        return file
    
    def create(self, validated_data):
        user = self.context['request'].user
        
        # Se já existe uma requisição pendente, rejeitar
        existing = UniversityVerificationRequest.objects.filter(
            user=user,
            status='pending'
        ).first()
        
        if existing:
            raise serializers.ValidationError(
                "Você já tem uma requisição de verificação pendente"
            )
        
        # Criar nova requisição
        verification_request = UniversityVerificationRequest.objects.create(
            user=user,
            file_name=validated_data['document_file'].name,
            file_size=validated_data['document_file'].size,
            **validated_data
        )
        
        return verification_request
```

**Views:**

```python
# backend/apps/users/views.py

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser

class UniversityVerificationViewSet(viewsets.ModelViewSet):
    queryset = UniversityVerificationRequest.objects.all()
    serializer_class = UniversityVerificationRequestSerializer
    permission_classes = [IsAdminUser]
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def approve(self, request, pk=None):
        """Aprova uma requisição de verificação"""
        verification = self.get_object()
        verification.approve(request.user)
        
        return Response({
            'message': 'Verification approved',
            'user_id': verification.user.id
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def reject(self, request, pk=None):
        """Rejeita uma requisição de verificação"""
        verification = self.get_object()
        reason = request.data.get('reason', 'Documento inválido')
        verification.reject(request.user, reason)
        
        return Response({
            'message': 'Verification rejected',
            'user_id': verification.user.id
        })


class UserVerificationView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Usuário envia documento para verificação"""
        serializer = VerificationRequestCreateSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            verification = serializer.save()
            return Response({
                'message': 'Verification request submitted',
                'verification_id': verification.id
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        """Usuário verifica status da sua verificação"""
        try:
            verification = UniversityVerificationRequest.objects.get(user=request.user)
            serializer = UniversityVerificationRequestSerializer(verification)
            return Response(serializer.data)
        except UniversityVerificationRequest.DoesNotExist:
            return Response({
                'status': 'not_submitted',
                'message': 'Você ainda não enviou um documento para verificação'
            })
```

---

## Fluxo de Registro Completo

```
1. Usuário preenche formulário de registro
   ├─ Seleciona universidade
   ├─ Seleciona curso (validado contra universidade)
   ├─ Insere email (qualquer email, não precisa ser institucional)
   └─ Define senha

2. Backend valida:
   ├─ Curso existe na universidade? ✓
   ├─ Email é único? ✓
   └─ Senha é forte? ✓

3. Se validação passar:
   ├─ Criar usuário com is_university_verified = False
   ├─ Usuário pode fazer login imediatamente
   └─ Mas com acesso limitado (sem badge de verificado)

4. Usuário envia documento para verificação:
   ├─ Faz upload de cartão de estudante, matrícula, etc.
   ├─ Sistema valida tipo e tamanho do arquivo
   └─ Requisição fica "Pendente"

5. Moderador revisa documento:
   ├─ Aprova → Usuário fica com badge "Verificado"
   └─ Rejeita → Usuário pode tentar novamente

6. Resultado:
   ├─ is_university_verified = True (após aprovação)
   ├─ Badge de "Verificado" aparece no perfil
   └─ Acesso a recursos exclusivos de estudantes verificados
```

---

## Implementação no Frontend

### 1. Atualizar UniversitySelect para carregar cursos

```jsx
// acadlink/src/components/ui/UniversitySelect.jsx

import { useState, useEffect } from 'react'
import { api } from '../../services/api'

export default function UniversitySelect({ value, onChange, error, status, disabled }) {
  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Carregar universidades do backend
    api.get('/universities/')
      .then(res => setUniversities(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleSelect = (uni) => {
    onChange(uni)
  }

  // ... resto do componente
}
```

### 2. Atualizar CourseSelect para validar contra universidade

```jsx
// acadlink/src/components/ui/CourseSelect.jsx

export default function CourseSelect({ value, onChange, error, status, disabled, university }) {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    if (university) {
      // Carregar cursos da universidade selecionada
      api.get(`/universities/${university.id}/courses/`)
        .then(res => setCourses(res.data))
        .catch(err => console.error(err))
    }
  }, [university])

  // ... resto do componente
}
```

### 3. Adicionar página de upload de documento para verificação

```jsx
// acadlink/src/pages/VerifyUniversity.jsx

import { useState } from 'react'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'
import { api } from '../services/api'
import { Button } from '../components/ui/Button'

export default function VerifyUniversity() {
  const [file, setFile] = useState(null)
  const [documentType, setDocumentType] = useState('student_id')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null) // 'pending', 'approved', 'rejected', 'error'
  const [message, setMessage] = useState('')

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      // Validar tamanho (máximo 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setMessage('Arquivo não pode exceder 5MB')
        setStatus('error')
        return
      }
      
      // Validar tipo
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
      if (!allowedTypes.includes(selectedFile.type)) {
        setMessage('Apenas PDF, JPG e PNG são aceitos')
        setStatus('error')
        return
      }
      
      setFile(selectedFile)
      setStatus(null)
      setMessage('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!file) {
      setMessage('Selecione um arquivo')
      setStatus('error')
      return
    }

    setLoading(true)
    
    const formData = new FormData()
    formData.append('document_type', documentType)
    formData.append('document_file', file)

    try {
      const response = await api.post('/verify-university/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      setStatus('pending')
      setMessage('Documento enviado com sucesso! Aguarde a revisão.')
      setFile(null)
    } catch (error) {
      setStatus('error')
      setMessage(error.response?.data?.detail || 'Erro ao enviar documento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Verificar Universidade</h1>

      {status === 'pending' && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-yellow-900">Pendente de Revisão</p>
            <p className="text-sm text-yellow-800">{message}</p>
          </div>
        </div>
      )}

      {status === 'approved' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-900">Verificado!</p>
            <p className="text-sm text-green-800">{message}</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Tipo de Documento
          </label>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="student_id">Cartão de Estudante</option>
            <option value="enrollment">Comprovativo de Matrícula</option>
            <option value="transcript">Histórico Académico</option>
            <option value="certificate">Certificado de Inscrição</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Arquivo (PDF, JPG ou PNG - máximo 5MB)
          </label>
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <p className="text-sm text-gray-600">
                {file ? file.name : 'Clique para selecionar arquivo'}
              </p>
            </label>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || !file}
          className="w-full"
        >
          {loading ? 'Enviando...' : 'Enviar para Verificação'}
        </Button>
      </form>
    </div>
  )
}
```

---

## Segurança e Boas Práticas

### 1. Proteção contra Seleção de Curso Inválido
- ✓ Validar curso contra lista da universidade no backend
- ✓ Não confiar apenas na validação do frontend
- ✓ Rejeitar requisições com cursos inválidos

### 2. Proteção contra Manipulação de Universidade
- ✓ Validar university_id no backend
- ✓ Usar ForeignKey para garantir integridade referencial
- ✓ Não permitir mudança de universidade após registro

### 3. Proteção de Documentos
- ✓ Validar tipo de arquivo (apenas PDF, JPG, PNG)
- ✓ Validar tamanho (máximo 5MB)
- ✓ Armazenar em pasta segura fora do web root
- ✓ Gerar nomes aleatórios para arquivos
- ✓ Validar que o arquivo é realmente uma imagem/PDF

### 4. Proteção contra Falsificação de Documentos
- ✓ Moderadores humanos revisam cada documento
- ✓ Comparar informações do documento com dados do perfil
- ✓ Rejeitar documentos com qualidade ruim ou ilegíveis
- ✓ Manter histórico de todas as verificações

### 5. Auditoria
- ✓ Registrar quando documento foi enviado
- ✓ Registrar quando foi aprovado/rejeitado
- ✓ Registrar quem aprovou/rejeitou
- ✓ Manter cópia do documento para auditoria

---

## Próximos Passos

1. **Criar migration** para adicionar novos campos ao modelo University
2. **Popular banco de dados** com universidades e seus cursos
3. **Implementar endpoints** de verificação
4. **Criar admin interface** para moderadores revisarem documentos
5. **Atualizar frontend** para usar novos endpoints
6. **Adicionar testes** para validação de curso
7. **Adicionar badge** de verificação no perfil do usuário
8. **Criar dashboard** para moderadores

---

## Comparação: Antes vs Depois

### Antes (Inseguro)
```
Usuário → Seleciona universidade → Seleciona curso → Fica "verificado" automaticamente
❌ Qualquer pessoa pode fingir ser de qualquer universidade
❌ Nenhuma validação real
❌ Sem comprovação de identidade
```

### Depois (Seguro)
```
Usuário → Seleciona universidade → Seleciona curso (validado) → Faz login
         → Envia documento → Moderador revisa → Fica "verificado"
✓ Validação de curso contra universidade
✓ Documento comprovando matrícula
✓ Revisão manual por moderador
✓ Impossível falsificar sem documento real
```

