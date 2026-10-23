# APIs Implementadas - AcadLink

## ✅ Novas APIs Implementadas

### 1. Forgot Password
**Endpoint:** `POST /api/users/forgot_password/`
- **Body:** `{ email }`
- **Response:** `{ detail: "Email de recuperação enviado com sucesso" }`
- **Descrição:** Envia um email com um token de recuperação de senha
- **Implementação:**
  - Backend: `backend/apps/users/views.py` - método `forgot_password`
  - Frontend: `acadlink/src/components/modals/ForgotPasswordModal.jsx`
  - Context: `acadlink/src/context/AuthContext.jsx` - método `forgotPassword`

### 2. Reset Password
**Endpoint:** `POST /api/users/reset_password/`
- **Body:** `{ email, token, new_password }`
- **Response:** `{ detail: "Senha alterada com sucesso" }`
- **Descrição:** Reseta a senha usando o token recebido por email
- **Implementação:**
  - Backend: `backend/apps/users/views.py` - método `reset_password`
  - Frontend: `acadlink/src/components/modals/ForgotPasswordModal.jsx`
  - Context: `acadlink/src/context/AuthContext.jsx` - método `resetPassword`

### 3. Conexões - Remove
**Endpoint:** `POST /api/connections/{id}/remove/`
- **Response:** `{ detail: "Connection removed" }`
- **Descrição:** Remove uma conexão existente
- **Implementação:** `backend/apps/connections/views.py` - método `remove`

### 4. Conexões - Pending Requests
**Endpoint:** `GET /api/connections/pending_requests/`
- **Response:** `[{ id, from_user, to_user, status, created_at }, ...]`
- **Descrição:** Lista pedidos de conexão pendentes
- **Implementação:** `backend/apps/connections/views.py` - método `pending_requests`

### 5. Conexões - Sent Requests
**Endpoint:** `GET /api/connections/sent_requests/`
- **Response:** `[{ id, from_user, to_user, status, created_at }, ...]`
- **Descrição:** Lista pedidos de conexão enviados
- **Implementação:** `backend/apps/connections/views.py` - método `sent_requests`

### 6. Conexões - Block
**Endpoint:** `POST /api/connections/{id}/block/`
- **Response:** `{ id, from_user, to_user, status: "blocked", ... }`
- **Descrição:** Bloqueia um usuário
- **Implementação:** `backend/apps/connections/views.py` - método `block`

---

## 📧 Configuração de Email

Adicionadas as seguintes configurações em `backend/config/settings/base.py`:

```python
EMAIL_BACKEND = config('EMAIL_BACKEND', default='django.core.mail.backends.console.EmailBackend')
EMAIL_HOST = config('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='noreply@acadlink.com')
FRONTEND_URL = config('FRONTEND_URL', default='http://localhost:3000')
```

### Para usar com Gmail:
1. Ativa "Senhas de aplicação" na tua conta Google
2. Adiciona ao `.env`:
```
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=teu-email@gmail.com
EMAIL_HOST_PASSWORD=tua-senha-de-app
DEFAULT_FROM_EMAIL=teu-email@gmail.com
```

### Para desenvolvimento (padrão):
O backend usa `console.EmailBackend` que imprime os emails na consola.

---

## 🔄 Fluxo de Recuperação de Senha

1. **Usuário clica em "Esqueci a senha"**
   - Modal abre com campo de email

2. **Usuário entra email e clica "Enviar Código"**
   - Frontend chama `POST /api/users/forgot_password/`
   - Backend gera UUID token e envia email
   - Email contém link: `http://localhost:3000/reset-password?token=UUID&email=user@email.com`

3. **Usuário clica no link do email**
   - Frontend extrai token e email da URL
   - Modal muda para passo "reset"

4. **Usuário entra nova senha e clica "Resetar Senha"**
   - Frontend chama `POST /api/users/reset_password/`
   - Backend valida token e atualiza senha
   - Usuário pode fazer login com nova senha

---

## 📋 Resumo de Mudanças

### Backend
- ✅ `backend/apps/users/views.py` - Adicionados métodos `forgot_password` e `reset_password`
- ✅ `backend/apps/connections/views.py` - Adicionados métodos `remove`, `pending_requests`, `sent_requests`, `block`
- ✅ `backend/config/settings/base.py` - Adicionadas configurações de EMAIL e FRONTEND_URL

### Frontend
- ✅ `acadlink/src/components/modals/ForgotPasswordModal.jsx` - Integrado com API
- ✅ `acadlink/src/context/AuthContext.jsx` - Adicionados métodos `forgotPassword` e `resetPassword`

---

## 🧪 Testando as APIs

### Forgot Password
```bash
curl -X POST http://localhost:8000/api/users/forgot_password/ \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

### Reset Password
```bash
curl -X POST http://localhost:8000/api/users/reset_password/ \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "token": "uuid-token", "new_password": "newpass123"}'
```

### Pending Requests
```bash
curl -X GET http://localhost:8000/api/connections/pending_requests/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Sent Requests
```bash
curl -X GET http://localhost:8000/api/connections/sent_requests/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Remove Connection
```bash
curl -X POST http://localhost:8000/api/connections/1/remove/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Block User
```bash
curl -X POST http://localhost:8000/api/connections/1/block/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ⚠️ Notas Importantes

1. **Token de Reset:** O token é um UUID gerado aleatoriamente e armazenado no campo `email_verification_token` do usuário
2. **Segurança:** O token é invalidado após ser usado (campo é limpo)
3. **Email:** Em desenvolvimento, os emails são impressos na consola do Django
4. **CORS:** Certifica-te que `FRONTEND_URL` está configurado corretamente para links de email
