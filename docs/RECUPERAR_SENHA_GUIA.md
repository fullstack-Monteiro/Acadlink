# Guia Completo - Funcionalidade Recuperar Senha

## 📋 Visão Geral

A funcionalidade de recuperar senha tem 3 passos:
1. **Usuário entra email** → Backend envia email com token
2. **Usuário clica link do email** → Frontend abre página de reset
3. **Usuário entra nova senha** → Backend atualiza senha

---

## 🔧 Passo 1: Configurar Email (Backend)

### Opção A: Usar Console (Desenvolvimento - Padrão)
Já está configurado! Os emails aparecem na consola do Django.

### Opção B: Usar Gmail (Recomendado para Testes)

1. **Ativa "Senhas de aplicação" no Gmail:**
   - Vai para https://myaccount.google.com/security
   - Ativa "Verificação em 2 passos"
   - Vai para "Senhas de aplicação"
   - Seleciona "Mail" e "Windows Computer"
   - Copia a senha gerada

2. **Adiciona ao arquivo `.env` na pasta `backend`:**
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

## 🎨 Passo 2: Testar no Frontend

### 1. Acessa a página de Login
- URL: `http://localhost:3000/login`

### 2. Clica em "Esqueci a senha"
- Abre o modal `ForgotPasswordModal`

### 3. Entra o teu email
- Exemplo: `user@example.com`

### 4. Clica "Enviar Código"
- **Se usar Console:** Vê o email na consola do Django
- **Se usar Gmail:** Recebe email na caixa de entrada

### 5. Copia o Token do Email
- **Console:** Procura por `token=` na mensagem
- **Gmail:** Clica no link do email

### 6. Entra o Token e Nova Senha
- Token: Cole o token que recebeste
- Nova Senha: Entra uma senha com 8+ caracteres
- Confirmar Senha: Repete a senha

### 7. Clica "Resetar Senha"
- Sucesso! Agora podes fazer login com a nova senha

---

## 🧪 Passo 3: Testar com cURL (Opcional)

### Teste 1: Forgot Password
```bash
curl -X POST http://localhost:8000/api/users/forgot_password/ \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"user@example.com\"}"
```

**Resposta esperada:**
```json
{
  "detail": "Email de recuperação enviado com sucesso"
}
```

### Teste 2: Ver o Token na Consola
- Abre a consola do Django
- Procura por uma mensagem como:
```
Clique no link para resetar sua senha: http://localhost:3000/reset-password?token=abc123-def456&email=user@example.com
```

### Teste 3: Reset Password
```bash
curl -X POST http://localhost:8000/api/users/reset_password/ \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"user@example.com\", \"token\": \"abc123-def456\", \"new_password\": \"newpass123\"}"
```

**Resposta esperada:**
```json
{
  "detail": "Senha alterada com sucesso"
}
```

---

## 📧 Entender o Fluxo de Email

### O que acontece quando clicas "Enviar Código":

1. **Frontend envia:**
   ```
   POST /api/users/forgot_password/
   { "email": "user@example.com" }
   ```

2. **Backend:**
   - Procura o usuário com esse email
   - Gera um UUID aleatório (token)
   - Guarda o token no banco de dados
   - Envia email com o link

3. **Email contém:**
   ```
   Clique no link para resetar sua senha:
   http://localhost:3000/reset-password?token=UUID&email=user@example.com
   ```

4. **Usuário clica no link:**
   - Frontend extrai `token` e `email` da URL
   - Modal muda para passo "reset"

5. **Usuário entra nova senha e clica "Resetar Senha":**
   ```
   POST /api/users/reset_password/
   {
     "email": "user@example.com",
     "token": "UUID",
     "new_password": "newpass123"
   }
   ```

6. **Backend:**
   - Valida o token
   - Atualiza a senha
   - Limpa o token (para não poder usar novamente)

---

## 🐛 Troubleshooting

### Problema: "Email de recuperação enviado" mas não recebo email

**Solução:**
1. Verifica a consola do Django (se estiver usando console backend)
2. Verifica a pasta de spam do Gmail
3. Verifica se o `.env` está correto
4. Reinicia o backend

### Problema: "Token inválido ou expirado"

**Solução:**
1. Copia o token correto do email
2. Certifica-te que o email está correto
3. Tenta novamente (o token não expira, mas é invalidado após usar)

### Problema: "Erro ao enviar email"

**Solução:**
1. Verifica se o `.env` tem as credenciais corretas
2. Se usar Gmail, verifica se a "Senha de aplicação" está correta
3. Verifica se o firewall não está bloqueando SMTP

### Problema: Email não tem o link

**Solução:**
1. Verifica se `FRONTEND_URL` está configurado no `.env`
2. Padrão é `http://localhost:3000`
3. Se estiver em produção, muda para o URL correto

---

## 📱 Fluxo Completo (Resumido)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuário clica "Esqueci a senha" na página de Login       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Modal abre com campo de email                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Usuário entra email e clica "Enviar Código"             │
│    POST /api/users/forgot_password/                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Backend envia email com token                            │
│    Email: http://localhost:3000/reset-password?token=...   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Usuário clica no link do email                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Frontend extrai token e email da URL                     │
│    Modal muda para passo "reset"                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Usuário entra nova senha e clica "Resetar Senha"        │
│    POST /api/users/reset_password/                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. Backend atualiza senha e invalida token                  │
│    Sucesso! Usuário pode fazer login com nova senha         │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist de Implementação

- [x] Backend: Endpoints `forgot_password` e `reset_password` implementados
- [x] Frontend: Modal `ForgotPasswordModal` integrado com API
- [x] Frontend: AuthContext com métodos `forgotPassword` e `resetPassword`
- [x] Backend: Configuração de email (console por padrão)
- [x] Backend: FRONTEND_URL configurável
- [ ] **TODO:** Criar página `/reset-password` para receber token da URL
- [ ] **TODO:** Integrar modal com página de Login

---

## 🚀 Próximos Passos

### 1. Criar Página de Reset Password
Criar arquivo `acadlink/src/pages/auth/ResetPassword.jsx` que:
- Extrai `token` e `email` da URL
- Mostra formulário para nova senha
- Chama `resetPassword` do AuthContext

### 2. Adicionar Rota
Adicionar rota em `acadlink/src/App.jsx`:
```jsx
<Route path="/reset-password" element={<ResetPassword />} />
```

### 3. Integrar com Login
Adicionar botão "Esqueci a senha" na página de Login que abre o modal

---

## 📞 Suporte

Se tiveres dúvidas:
1. Verifica a consola do Django para erros
2. Verifica a consola do navegador (F12)
3. Verifica o arquivo `.env` no backend
4. Tenta com cURL para isolar o problema
