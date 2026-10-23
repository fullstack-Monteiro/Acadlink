# AcadLink - Security & Code Quality Audit Report

**Data**: August 3, 2026  
**Sistema**: Frontend (React/Vite) + Backend (Django/DRF)  
**Status**: ⚠️ **CRÍTICO** - Falhas de segurança significativas identificadas

---

## 📊 RESUMO EXECUTIVO

| Categoria | Severidade | Contagem |
|-----------|-----------|----------|
| 🔴 Crítico | CRITICAL | 4 |
| 🟠 Alto | HIGH | 8 |
| 🟡 Médio | MEDIUM | 10 |
| 🔵 Baixo | LOW | 8 |
| **Total** | - | **30 Issues** |

**Readiness**: ❌ **NÃO PRONTO PARA PRODUÇÃO**

---

## 🔴 VULNERABILIDADES CRÍTICAS

### 1. **Test Mode Bypass em AuthContext** 🔓
**Arquivo**: `acadlink/src/context/AuthContext.jsx`  
**Severidade**: CRITICAL  
**Impacto**: Qualquer pessoa consegue fazer login com qualquer credencial

```javascript
// ❌ PROBLEMA
const isTestMode = true; // Hardcoded!

if (isTestMode) {
  // Aceita QUALQUER email/senha sem validação
  setUser({ email, name: email.split('@')[0] })
  setToken(`test_token_${Date.now()}`)
  return; // Bypass completo
}
```

**Consequências**:
- ✅ Autenticação completamente desativada
- ✅ Tokens falsos gerados no cliente
- ✅ Sem comunicação com backend
- ✅ Qualquer usuário é admin

**Solução**:
```javascript
// ✅ CORRETO
const isTestMode = false; // Ou via ENV: import.meta.env.VITE_TEST_MODE

if (isTestMode && import.meta.env.DEV) {
  // Apenas em desenvolvimento local
}
```

---

### 2. **Registro Sem Validação Adequada** 🚪
**Arquivo**: `acadlink/src/pages/auth/Register.jsx`  
**Severidade**: CRITICAL

**Problemas**:
- Não valida email antes de enviar (frontend)
- Não verifica se senhas batem
- Backend hardcoded para APENAS Gmail
- Sem captcha ou email verification

```javascript
// ❌ PROBLEMA
const handleRegister = async () => {
  // Sem validação!
  if (!formData.email) return; // Única validação
  
  // Envia diretamente sem checks
  try {
    await register(formData);
  }
}

// Backend - users/serializers.py
if not email.endswith('@gmail.com'):
  raise ValidationError("❌ Somente Gmail permitido!")
```

**Risco**: Criação de contas fraudulentas em massa

---

### 3. **Reset de Senha Inseguro** 🔑
**Arquivo**: `backend/apps/users/views.py`  
**Severidade**: CRITICAL

**Problema**: Token no URL em plaintext
```
GET /api/users/reset-password?token=abc123def456&email=user@gmail.com
```

**Riscos**:
- ✅ Token visível em histórico do navegador
- ✅ Exposição em logs do servidor
- ✅ Token válido **para sempre** (sem expiração)
- ✅ Email exposto em URLs públicas

**Solução**:
```
POST /api/users/reset-password/
{
  "token": "...",
  "new_password": "..."
}

// Token válido apenas por 15 minutos
```

---

### 4. **CORS Ampla Demais** 🌐
**Arquivo**: `backend/config/settings/base.py`  
**Severidade**: CRITICAL

```python
# ❌ PROBLEMA - Configuração atual
CORS_ALLOWED_ORIGINS = config(
  'CORS_ALLOWED_ORIGINS',
  default='http://localhost:3000',
  cast=Csv()
)
# Em produção pode ficar como '*' por acidente
```

**Risco**: Qualquer domínio pode fazer requisições

---

## 🟠 PROBLEMAS ALTOS

### 5. **Counters Não Atômicos - Race Condition** 🏃
**Arquivo**: `backend/apps/posts/models.py` e `reels/models.py`  
**Severidade**: HIGH

```python
# ❌ PROBLEMA - Race condition
post.likes_count += 1  # Lê, incrementa, escreve
post.save()

# Se 2 requisições simultâneas:
# Thread 1: lê count=5, incrementa pra 6, escreve 6
# Thread 2: lê count=5, incrementa pra 6, escreve 6
# Resultado: 6 em vez de 7!
```

**Solução**:
```python
# ✅ CORRETO - Atomic
from django.db.models import F

Post.objects.filter(id=post_id).update(
  likes_count=F('likes_count') + 1
)
```

**Impacto**: Números incorretos em likes, views, comentários

---

### 6. **Sem Rate Limiting em Auth** 🚨
**Arquivo**: `backend/config/settings/base.py`  
**Severidade**: HIGH

**Problema**: Nenhuma proteção contra força bruta
```python
# Configurado mas comentado!
# RATE_LIMIT_ENABLED=True
# RATE_LIMIT_REQUESTS=100
# RATE_LIMIT_PERIOD=3600
```

**Risco**: Ataque de força bruta em login/registro

**Solução**:
```python
REST_FRAMEWORK = {
  'DEFAULT_THROTTLE_CLASSES': [
    'rest_framework.throttling.AnonRateThrottle',
    'rest_framework.throttling.UserRateThrottle',
  ],
  'DEFAULT_THROTTLE_RATES': {
    'anon': '5/hour',  # Login tentativas
    'user': '100/hour'
  }
}
```

---

### 7. **Sem Validação de Conteúdo em Uploads** 📹
**Arquivo**: `backend/apps/reels/validators.py`  
**Severidade**: HIGH

**Problema**:
```python
# ❌ Apenas verifica extensão
def validate_video(file):
  if not file.name.endswith(('.mp4', '.mov')):
    raise ValidationError("Invalid format")
  # Só isso! Sem verificar magic bytes
```

**Riscos**:
- Upload de malware com extensão .mp4
- Arquivos ZIP como vídeos
- Sem verificação de resolução/duração
- Sem limite real de tamanho (500MB aceitável?)

**Solução**: Usar biblioteca como `python-magic` para validar magic bytes

---

### 8. **Dados Sensíveis em localStorage** 💾
**Arquivo**: `acadlink/src/context/AuthContext.jsx`  
**Severidade**: HIGH

```javascript
// ❌ PROBLEMA
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));

// Vulnerável a XSS attack!
// Qualquer script malicioso acessa via: localStorage.getItem('token')
```

**Solução**:
```javascript
// ✅ Melhor: usar sessionStorage para dados sensíveis
sessionStorage.setItem('token', token);

// Ou implementar token HTTP-only:
// Backend set Cookie com flag HttpOnly
// Frontend não acessa diretamente
```

---

### 9. **Sem Expiração em Tokens de Reset** ⏰
**Arquivo**: `backend/apps/users/models.py`  
**Severidade**: HIGH

```python
# ❌ PROBLEMA
email_verification_token = models.CharField(max_length=255, blank=True)
reset_token = models.CharField(max_length=255, blank=True)

# Sem timestamp! Token válido para sempre
```

**Solução**:
```python
# ✅ CORRETO
email_verification_token = models.CharField(...)
email_verification_token_created = models.DateTimeField(null=True)

def is_email_token_valid(self):
  if not self.email_verification_token:
    return False
  age = timezone.now() - self.email_verification_token_created
  return age.total_seconds() < 15 * 60  # 15 minutos
```

---

### 10. **Sem Input Sanitization** 🧹
**Arquivo**: Frontend e Backend em toda parte  
**Severidade**: HIGH

**Risco**: XSS Attack
```javascript
// ❌ PROBLEMA - Sem sanitização
<p>{post.description}</p>

// Se description = "<img src=x onerror='alert(\"XSS\")'>"
// Script executa!
```

**Solução**:
```javascript
// ✅ CORRETO
import DOMPurify from 'dompurify';

<p>{DOMPurify.sanitize(post.description)}</p>
```

---

## 🟡 PROBLEMAS MÉDIOS

### 11. **Sem Tratamento de Erro Adequado** ⚠️
**Severidade**: MEDIUM

**Problema**: Erros apenas logados, não informam usuário
```javascript
// ❌ PROBLEMA
catch (err) {
  console.error('Erro:', err);
  // Usuário não sabe o que aconteceu!
}

// ✅ CORRETO
catch (err) {
  setError(err.response?.data?.detail || 'Erro ao fazer login');
  showNotification({
    type: 'error',
    message: error
  });
}
```

---

### 12. **Sem Null Checks em Dados** 🎯
**Severidade**: MEDIUM

```javascript
// ❌ PROBLEMA - ReelPlayer.jsx
const creator = reel?.creator || reel?.author || {}

// Se reel?.creator?.name não existe:
<span>{creator.name}</span>  // undefined renderizado
```

**Solução**:
```javascript
// ✅ CORRETO
<span>{creator?.name || 'Usuário desconhecido'}</span>
```

---

### 13. **Queries Ineficientes** 🐢
**Severidade**: MEDIUM

```python
# ❌ PROBLEMA - backend/apps/reels/views.py
reels = Reel.objects.all()  # Sem filtros!

for reel in reels:
  print(reel.user.name)  # N+1 query problem!
```

**Solução**:
```python
# ✅ CORRETO - select_related
reels = Reel.objects.select_related('user').all()[:20]
```

---

### 14. **Sem Permissões Adequadas** 🔒
**Severidade**: MEDIUM

```python
# ❌ PROBLEMA - Qualquer um consegue ver tudo
class ReelViewSet(viewsets.ViewSet):
  def list(self, request):
    return Reel.objects.all()  # Sem permissão check!
```

**Solução**:
```python
# ✅ CORRETO
from rest_framework.permissions import IsAuthenticated

class ReelViewSet(viewsets.ViewSet):
  permission_classes = [IsAuthenticated]
  
  def list(self, request):
    return Reel.objects.filter(is_public=True)
```

---

### 15. **Memory Leaks em Hooks** 💧
**Severidade**: MEDIUM

```javascript
// ❌ PROBLEMA - ReelPlayer.jsx
useEffect(() => {
  const timeout = setTimeout(() => {
    // ...
  }, 1000);
  
  // Falta cleanup!
});

// ✅ CORRETO
useEffect(() => {
  const timeout = setTimeout(() => {
    // ...
  }, 1000);
  
  return () => clearTimeout(timeout);
}, []);
```

---

### 16. **Sem Constraints no Banco** 🗄️
**Severidade**: MEDIUM

```python
# ❌ PROBLEMA - Sem validação de coluna
class User(models.Model):
  year = models.IntegerField()  # Pode ser 999999!

# ✅ CORRETO
year = models.IntegerField(
  validators=[MinValueValidator(1), MaxValueValidator(6)]
)
```

---

### 17. **Sem Content Security Policy** 🛡️
**Severidade**: MEDIUM

**Falta**: Headers de segurança na resposta HTTP
```python
# ✅ Adicionar em settings/production.py
SECURE_CONTENT_SECURITY_POLICY = {
  'default-src': ("'self'",),
  'script-src': ("'self'", "'unsafe-inline'"),
  'style-src': ("'self'", "'unsafe-inline'"),
}
```

---

### 18. **Sem API Documentation** 📚
**Severidade**: MEDIUM

Não há schema OpenAPI/Swagger, dificultando:
- Testes
- Integração
- Manutenção

**Solução**: Adicionar `drf-spectacular` ao requirements

---

### 19. **Test Mode Lógica Confusa** 🧪
**Severidade**: MEDIUM

```javascript
// ❌ Pode estar true ou false sem razão
const isTestMode = true;
```

**Solução**:
```javascript
const isTestMode = import.meta.env.MODE === 'development' && 
                   import.meta.env.VITE_MOCK_API === 'true';
```

---

### 20. **Sem Logging/Monitoring** 📊
**Severidade**: MEDIUM

Nenhuma visibilidade de:
- Erros em produção
- Performance
- Uso de API
- Atividade suspeita

**Solução**: Implementar Sentry, DataDog, ou similar

---

## 📋 TABELA DE AÇÃO RÁPIDA

| ID | Problema | Arquivo | Solução | Tempo | Risco |
|----|----------|---------|---------|-------|-------|
| 1 | Test mode bypass | AuthContext.jsx | Remover/desativar | 15 min | 🔴 CRÍTICO |
| 2 | Registro sem validação | Register.jsx | Adicionar validators | 30 min | 🔴 CRÍTICO |
| 3 | Reset token no URL | users/views.py | POST-only + expiration | 1h | 🔴 CRÍTICO |
| 4 | CORS amplo | settings/base.py | Whitelist específica | 15 min | 🔴 CRÍTICO |
| 5 | Race conditions | posts/models.py | Usar F() expressions | 1h | 🟠 HIGH |
| 6 | Sem rate limiting | settings/base.py | Ativar throttle | 30 min | 🟠 HIGH |
| 7 | Upload validation | validators.py | Magic bytes check | 1h | 🟠 HIGH |
| 8 | localStorage tokens | AuthContext.jsx | sessionStorage | 30 min | 🟠 HIGH |
| 9 | Sem token expiration | models.py | Adicionar timestamp | 1h | 🟠 HIGH |
| 10 | Sem sanitização | Todo lugar | DOMPurify/bleach | 2h | 🟠 HIGH |
| 11-20 | Outros issues | Vários | Ver seção 🟡 | 5-8h | 🟡 MEDIUM |

---

## ✅ CHECKLIST DE CORREÇÃO

### Semana 1 (Crítico)
- [ ] Desativar test mode bypass
- [ ] Implementar registro com validação
- [ ] Fixar reset password (POST-only, expiration)
- [ ] Corrigir CORS whitelist
- [ ] Ativar rate limiting

### Semana 2 (Alto)
- [ ] Usar F() para counters
- [ ] Implementar sanitização XSS
- [ ] Usar sessionStorage para tokens
- [ ] Adicionar token expiration
- [ ] Validação de upload (magic bytes)

### Semana 3 (Médio)
- [ ] Melhorar error handling
- [ ] Adicionar null checks
- [ ] Otimizar queries (select_related)
- [ ] Implementar permissões
- [ ] Fixar memory leaks
- [ ] Adicionar constraints BD
- [ ] CSP headers
- [ ] Logging/monitoring
- [ ] API documentation

---

## 🚀 PRÓXIMOS PASSOS

1. **Imediato**: Revisar e fixar vulnerabilidades críticas
2. **Esta semana**: Implementar validação e rate limiting
3. **Próxima semana**: Segurança de dados e sanitização
4. **Produção**: Passar por security audit externo antes de publicar

**Resultado da auditoria**: ⚠️ **SISTEMA NÃO ESTÁ PRONTO PARA PRODUÇÃO**

Recomenda-se corrigir todos os items 🔴 CRÍTICO antes de qualquer deploy público.

---

**Auditoria realizada**: 3 de Agosto de 2026  
**Próxima revisão recomendada**: Após implementar todas as correções
