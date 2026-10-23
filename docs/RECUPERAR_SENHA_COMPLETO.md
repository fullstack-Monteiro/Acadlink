# ✅ Funcionalidade Recuperar Senha - Implementação Completa

## 📋 O que foi implementado

### Backend
- ✅ Endpoint `POST /api/users/forgot_password/` - Envia email com token
- ✅ Endpoint `POST /api/users/reset_password/` - Reseta senha com token
- ✅ Configuração de email (console por padrão, suporta Gmail)
- ✅ FRONTEND_URL configurável para links de email

### Frontend
- ✅ Página `/reset-password` - Recebe token da URL e reseta senha
- ✅ Modal `ForgotPasswordModal` - Integrado com API
- ✅ Botão "Esqueci a senha" na página de Login
- ✅ AuthContext com métodos `forgotPassword` e `resetPassword`
- ✅ Rota `/reset-password` adicionada ao App.jsx

---

## 🚀 Como Usar

### 1. Usuário clica "Esqueci a senha" no Login
```
http://localhost:3000/login
↓
Clica em "Esqueci a senha"
↓
Modal abre
```

### 2. Usuário entra email
```
Email: user@example.com
↓
Clica "Enviar Código"
↓
Backend envia email com token
```

### 3. Usuário recebe email
**Se usar Console (padrão):**
- Vê o email na consola do Django
- Copia o token do link

**Se usar Gmail:**
- Recebe email na caixa de entrada
- Clica no link do email

### 4. Usuário reseta senha
**Opção A: Clica no link do email**
```
http://localhost:3000/reset-password?token=UUID&email=user@example.com
↓
Página abre automaticamente
↓
Entra nova senha
↓
Clica "Resetar Senha"
```

**Opção B: Entra token manualmente**
```
Modal muda para passo "reset"
↓
Entra o token que recebeu
↓
Entra nova senha
↓
Clica "Resetar Senha"
```

### 5. Sucesso!
```
Senha alterada com sucesso
↓
Redireciona para Login
↓
Faz login com nova senha
```

---

## 📧 Configurar Email

### Opção 1: Console (Padrão - Desenvolvimento)
Já está configurado! Os emails aparecem na consola do Django.

**Vantagem:** Sem configuração necessária
**Desvantagem:** Só funciona em desenvolvimento

### Opção 2: Gmail (Recomendado para Testes)

1. **Ativa "Senhas de aplicação":**
   - Vai para https://myaccount.google.com/security
   - Ativa "Verificação em 2 passos"
   - Vai para "Senhas de aplicação"
   - Seleciona "Mail" e "Windows Computer"
   - Copia a senha gerada

2. **Adiciona ao `.env` na pasta `backend`:**
```
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=teu-email@gmail.com
EMAIL_HOST_PASSWORD=senha-de-app-gerada
DEFAULT_FROM_EMAIL=teu-email@gmail.com
FRONTEND_URL=http://localhost:3000
```

3. **Reinicia o backend:**
```powershell
cd backend
.\run.ps1
```

---

## 🧪 Testar com cURL

### Teste 1: Forgot Password
```bash
curl -X POST http://localhost:8000/api/users/forgot_password/ \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"user@example.com\"}"
```

**Resposta:**
```json
{
  "detail": "Email de recuperação enviado com sucesso"
}
```

### Teste 2: Ver Token na Consola
Abre a consola do Django e procura por:
```
Clique no link para resetar sua senha: http://localhost:3000/reset-password?token=abc123-def456&email=user@example.com
```

### Teste 3: Reset Password
```bash
curl -X POST http://localhost:8000/api/users/reset_password/ \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"user@example.com\", \"token\": \"abc123-def456\", \"new_password\": \"newpass123\"}"
```

**Resposta:**
```json
{
  "detail": "Senha alterada com sucesso"
}
```

---

## 📁 Arquivos Modificados/Criados

### Backend
- ✅ `backend/apps/users/views.py` - Adicionados métodos `forgot_password` e `reset_password`
- ✅ `backend/config/settings/base.py` - Adicionadas configurações de EMAIL e FRONTEND_URL

### Frontend
- ✅ `acadlink/src/pages/auth/ResetPassword.jsx` - **NOVO** - Página de reset
- ✅ `acadlink/src/pages/auth/Login.jsx` - Adicionado botão "Esqueci a senha"
- ✅ `acadlink/src/components/modals/ForgotPasswordModal.jsx` - Integrado com API
- ✅ `acadlink/src/context/AuthContext.jsx` - Adicionados métodos `forgotPassword` e `resetPassword`
- ✅ `acadlink/src/App.jsx` - Adicionada rota `/reset-password`

---

## 🔄 Fluxo Técnico

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuário clica "Esqueci a senha"                          │
│    → setShowForgotModal(true)                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Modal abre (ForgotPasswordModal)                          │
│    → Passo: "email"                                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Usuário entra email e clica "Enviar Código"             │
│    → POST /api/users/forgot_password/                       │
│    → Body: { email: "user@example.com" }                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Backend:                                                 │
│    - Procura usuário com esse email                         │
│    - Gera UUID token                                        │
│    - Guarda token no campo email_verification_token         │
│    - Envia email com link                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Email contém:                                            │
│    http://localhost:3000/reset-password?token=UUID&email=.. │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Usuário clica no link                                    │
│    → Frontend extrai token e email da URL                   │
│    → Abre página ResetPassword                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Usuário entra nova senha e clica "Resetar Senha"        │
│    → POST /api/users/reset_password/                        │
│    → Body: { email, token, new_password }                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. Backend:                                                 │
│    - Valida token                                           │
│    - Atualiza senha                                         │
│    - Limpa token (invalida)                                 │
│    - Retorna sucesso                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 9. Frontend:                                                │
│    - Mostra mensagem de sucesso                             │
│    - Redireciona para /login após 2 segundos                │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚠️ Troubleshooting

### Problema: "Email de recuperação enviado" mas não recebo email

**Solução:**
1. Se usar Console: Verifica a consola do Django
2. Se usar Gmail: Verifica a pasta de spam
3. Verifica se o `.env` está correto
4. Reinicia o backend

### Problema: "Token inválido ou expirado"

**Solução:**
1. Copia o token correto do email
2. Certifica-te que o email está correto
3. Tenta novamente

### Problema: Link do email não funciona

**Solução:**
1. Verifica se `FRONTEND_URL` está configurado no `.env`
2. Padrão é `http://localhost:3000`
3. Se estiver em produção, muda para o URL correto

### Problema: Página ResetPassword mostra "Link Inválido"

**Solução:**
1. Verifica se a URL tem `token` e `email`
2. Exemplo correto: `http://localhost:3000/reset-password?token=abc&email=user@example.com`
3. Tenta copiar o link do email novamente

---

## 🎯 Próximos Passos (Opcional)

1. **Adicionar expiração de token** - Token expira após X horas
2. **Adicionar limite de tentativas** - Máximo 3 tentativas por email
3. **Adicionar confirmação por SMS** - Além de email
4. **Adicionar autenticação de 2 fatores** - Para segurança extra
5. **Adicionar histórico de mudanças de senha** - Para auditoria

---

## ✅ Checklist Final

- [x] Backend: Endpoints implementados
- [x] Frontend: Página ResetPassword criada
- [x] Frontend: Modal ForgotPasswordModal integrado
- [x] Frontend: Botão "Esqueci a senha" adicionado
- [x] Frontend: Rota `/reset-password` adicionada
- [x] Backend: Configuração de email
- [x] Documentação completa
- [x] Testes com cURL

---

## 📞 Suporte

Se tiveres dúvidas:
1. Verifica a consola do Django para erros
2. Verifica a consola do navegador (F12)
3. Verifica o arquivo `.env` no backend
4. Tenta com cURL para isolar o problema
5. Lê o arquivo `RECUPERAR_SENHA_GUIA.md` para mais detalhes
