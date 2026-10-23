# Rate Limiting com AXES - Segurança

## O que é AXES?

AXES é um middleware Django que protege contra **brute force attacks** no login.

Bloqueia temporariamente usuários/IPs após múltiplas tentativas falhadas.

---

## Como Funciona

### 1️⃣ Tentativa 1-4: Falham ✅
```
Usuário tenta: senha errada
Django registra: 1 falha
Status: Continue tentando
```

### 2️⃣ Tentativa 5: Bloqueado 🔒
```
Usuário tenta: senha errada (5ª vez)
Django registra: 5 falhas = BLOQUEADO
Status: Bloqueado por 15 minutos
```

### 3️⃣ Após 15 minutos: Desbloqueado ✅
```
Tempo passou: 15 minutos
Django: Reseta contador
Status: Pode tentar de novo
```

---

## Configuração

### `.env` (Padrão)

```env
# Máximo de tentativas antes de bloquear
AXES_FAILURE_LIMIT=5

# Tempo de bloqueio (minutos)
AXES_COOLOFF_MINUTES=15

# Ativar bloqueio automático
AXES_LOCK_OUT_AT_FAILURE=True
```

### Configurações de Segurança

| Configuração | Valor | Razão |
|--------------|-------|-------|
| FAILURE_LIMIT | 5 | Após 5 erros, bloqueia |
| COOLOFF | 15 min | Tempo de espera |
| LOCK_OUT | True | Bloqueia automaticamente |
| USE_USER_AGENT | True | Rastreia navegador também |
| BY_COMBINATION | True | Combina IP + Username |

---

## Exemplos de Proteção

### ❌ Sem AXES (Vulnerável):
```
Attacker tenta 1000x: senha123, senha456, password, admin...
Django aceita todas ❌
Conta comprometida em 5 minutos
```

### ✅ Com AXES (Protegido):
```
Attacker tenta:
1. senha123 - Falha
2. senha456 - Falha
3. password - Falha
4. admin - Falha
5. root - Falha + BLOQUEADO! 🔒

API resposta:
{
  "detail": "Muitas tentativas de login. Tente novamente em 15 minutos."
}
```

---

## Monitorar Bloqueios

### No Django Shell:

```python
python manage.py shell

from axes.models import AccessAttempt, AccessLog

# Ver tentativas falhadas
AccessAttempt.objects.all()

# Ver histórico de acessos
AccessLog.objects.all().order_by('-attempt_time')[:10]

# Limpar bloqueios (cuidado!)
AccessAttempt.objects.all().delete()
```

### Ver no Admin:

```
1. Ir para: http://localhost:8000/admin/
2. Procurar: "Access Attempts" ou "Access Log"
3. Ver usuários/IPs bloqueados
```

---

## Configurações Avançadas

### Aumentar Limite para Usuários de Confiança:

```python
# settings.py
AXES_FAILURE_LIMIT = 5  # Normal
AXES_FAILURE_LIMIT_ADMIN = 10  # Admin com mais tentativas

# Usar em view
from axes.decorators import axes_dispatch_decorator

@axes_dispatch_decorator
def login(request):
    # AXES vai proteger automaticamente
    pass
```

### Whitelist de IPs (Nunca Bloquear):

```python
# settings.py
AXES_IP_WHITELIST = [
    '192.168.1.100',  # IP da empresa
    '203.0.113.45',   # VPN da empresa
]
```

### Notificar Admin Quando Bloqueado:

```python
# settings.py
AXES_VERBOSE = True  # Log detalhado

# Adicionar logger customizado
import logging
logger = logging.getLogger('axes')

# signals.py
from axes.signals import axes_locked
@receiver(axes_locked)
def axes_locked_handler(sender, request, **kwargs):
    send_admin_email(f"IP {request.META['REMOTE_ADDR']} foi bloqueado!")
```

---

## Teste Local

### 1. Simular Brute Force:

```bash
# Terminal 1: Iniciar servidor
python manage.py runserver

# Terminal 2: 5 tentativas falhadas
for i in {1..5}; do
  curl -X POST http://localhost:8000/api/users/login/ \
    -H "Content-Type: application/json" \
    -d '{"email":"test@gmail.com", "password":"wrong'$i'"}'
done
```

### 2. Verificar Bloqueio:

```bash
# 6ª tentativa (deve ser bloqueada)
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com", "password":"correct"}'

# Resposta esperada:
# "Request blocked by AXES - too many login attempts"
```

---

## Resetar Bloqueios Manualmente

### Via Django Admin:

```
1. Admin → Access Attempts
2. Selecionar usuário/IP
3. Delete
```

### Via CLI:

```bash
python manage.py axes_reset_attempts  # Tudo
python manage.py axes_reset_attempts --ip 192.168.1.100  # Específico
```

---

## Melhores Práticas

✅ **Fazer:**
- Bloquear após 5 tentativas
- Cooloff de 15-30 minutos
- Usar IP + Username
- Log de tentativas
- Notificar admin

❌ **Evitar:**
- Limite muito alto (>10)
- Cooloff muito curto (<5 min)
- Apenas IP (VPNs compartilham IP)
- Sem logging
- Sem notificações

---

## Recursos

- [Django Axes Docs](https://django-axes.readthedocs.io/)
- [OWASP Brute Force](https://owasp.org/www-community/attacks/Brute_force_attack)
- [Rate Limiting Best Practices](https://en.wikipedia.org/wiki/Rate_limiting)
