# 🧪 Google OAuth - Guia de Testes

## 📋 Pré-requisitos

- ✅ Backend rodando (port 8000)
- ✅ Frontend rodando (port 3000)
- ✅ `VITE_GOOGLE_CLIENT_ID` configurado
- ✅ Dependências instaladas

---

## 🚀 Teste End-to-End

### Passo 1: Preparar Ambiente

#### Backend
```bash
cd backend

# Instalar dependências (se ainda não instalou)
pip install requests google-auth google-auth-oauthlib google-auth-httplib2

# Ou usar script:
# Windows:
./install-google-oauth.bat

# Linux/Mac:
chmod +x install-google-oauth.sh
./install-google-oauth.sh

# Iniciar servidor
python manage.py runserver
```

**Verificar:** http://localhost:8000/admin deve estar acessível

#### Frontend
```bash
cd frontend

# Verificar .env
cat .env
# Deve ter: VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com

# Iniciar dev server
npm run dev
```

**Verificar:** http://localhost:3000 deve abrir

---

### Passo 2: Teste Manual - Login

1. **Abra:** http://localhost:3000/login

2. **Verifique visual:**
   - [ ] Botão "Continuar com Google" aparece
   - [ ] Logo oficial do Google visível
   - [ ] Botão não está disabled
   - [ ] Hover funciona

3. **Clique:** "Continuar com Google"

4. **Popup deve abrir com:**
   - [ ] Escolha de conta Google
   - [ ] Permissões solicitadas
   - [ ] Sem erros no console

5. **Selecione uma conta**

6. **Aguarde processamento:**
   - [ ] Popup fecha automaticamente
   - [ ] Loading state visível
   - [ ] Sem erros no console

7. **Redirecionamento:**
   - [ ] Redireciona para /dashboard
   - [ ] Token armazenado no localStorage
   - [ ] Usuário aparece logado

---

### Passo 3: Verificar Dados

#### No Console do Browser (F12)

```javascript
// Verificar tokens
console.log('Access Token:', localStorage.getItem('access_token'))
console.log('Refresh Token:', localStorage.getItem('refresh_token'))

// Deve exibir: eyJ0eXAiOiJKV1Qi...
```

#### No Backend (Django Admin)

1. Acesse: http://localhost:8000/admin/
2. Login com superuser
3. Vá em: Users
4. **Verificar novo usuário criado:**
   - [ ] Email correto
   - [ ] Nome do Google
   - [ ] `is_email_verified: True`
   - [ ] Username único

---

### Passo 4: Teste Manual - Register

1. **Faça logout** (se logado)

2. **Abra:** http://localhost:3000/register

3. **Clique:** "Continuar com Google"

4. **Fluxo idêntico ao login:**
   - [ ] Popup abre
   - [ ] Seleciona conta
   - [ ] Fecha automaticamente
   - [ ] Redireciona para /dashboard

5. **Verificar:**
   - [ ] Se email já existe → faz login
   - [ ] Se email novo → cria conta
   - [ ] Campos de formulário ignorados

---

## 🔍 Teste de API Direta

### Via cURL

```bash
# 1. Obter access_token do Google
# Faça login via browser e pegue o token do console

# 2. Testar endpoint
curl -X POST http://localhost:8000/api/users/google-login/ \
  -H "Content-Type: application/json" \
  -d '{
    "access_token": "ya29.a0AfH6SMBxxxxxxx"
  }'

# Resposta esperada (200):
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "usuario@gmail.com",
    "username": "usuario_abc1",
    "first_name": "Nome",
    "last_name": "Sobrenome",
    "is_email_verified": true
  },
  "created": true
}
```

### Via Python Script

```python
# test_google_oauth.py
import requests

# Obter token do console do browser
ACCESS_TOKEN = "SEU_TOKEN_AQUI"

response = requests.post(
    'http://localhost:8000/api/users/google-login/',
    json={'access_token': ACCESS_TOKEN}
)

print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")

# Verificar
assert response.status_code == 200
assert 'access_token' in response.json()
assert 'user' in response.json()
print("✅ Teste passou!")
```

---

## 🧪 Casos de Teste

### Teste 1: Primeiro Login (Novo Usuário)

**Cenário:** Usuário nunca usou AcadLink

**Passos:**
1. Login com Google
2. Usuário criado no banco

**Esperado:**
- ✅ Status 200
- ✅ `created: true`
- ✅ Usuário em User table
- ✅ Profile criado automaticamente
- ✅ JWT tokens retornados

---

### Teste 2: Login Repetido (Usuário Existente)

**Cenário:** Usuário já tem conta via Google

**Passos:**
1. Login com Google (mesma conta)
2. Busca usuário existente

**Esperado:**
- ✅ Status 200
- ✅ `created: false`
- ✅ Dados atualizados (se necessário)
- ✅ JWT tokens novos

---

### Teste 3: Token Inválido

**Cenário:** Token expirado ou incorreto

**Passos:**
1. POST com token inválido

```bash
curl -X POST http://localhost:8000/api/users/google-login/ \
  -H "Content-Type: application/json" \
  -d '{"access_token": "token_invalido"}'
```

**Esperado:**
- ✅ Status 401
- ✅ `{"detail": "Token do Google inválido"}`

---

### Teste 4: Token Ausente

**Cenário:** Requisição sem token

**Passos:**
```bash
curl -X POST http://localhost:8000/api/users/google-login/ \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Esperado:**
- ✅ Status 400
- ✅ `{"detail": "access_token é obrigatório"}`

---

### Teste 5: Email Não Verificado

**Cenário:** Google retorna `email_verified: false`

**Esperado:**
- ✅ Status 400
- ✅ `{"detail": "Email não verificado pelo Google"}`

---

### Teste 6: Timeout da API Google

**Cenário:** Google API demora > 10s

**Esperado:**
- ✅ Status 500
- ✅ Erro de timeout capturado
- ✅ Mensagem amigável

---

## 📊 Checklist de Validação

### Frontend

- [ ] Botão Google aparece
- [ ] Logo oficial renderiza
- [ ] Popup abre sem erros
- [ ] Loading state funciona
- [ ] Erros são exibidos
- [ ] Redirecionamento correto
- [ ] Dark mode funciona
- [ ] Mobile responsivo

### Backend

- [ ] Endpoint `/api/users/google-login/` existe
- [ ] Valida token com Google
- [ ] Cria usuário se não existe
- [ ] Atualiza usuário se existe
- [ ] Retorna JWT tokens
- [ ] Error handling correto
- [ ] Logs funcionando
- [ ] Rate limiting ativo

### Integração

- [ ] Fluxo completo funciona
- [ ] Tokens armazenados
- [ ] Usuário logado
- [ ] Dados sincronizados
- [ ] Logout funciona
- [ ] Refresh token funciona

---

## 🐛 Debugging

### Frontend Debug

```javascript
// Em Login.jsx, adicione:
console.log('Google login iniciado')
console.log('Token recebido:', tokenResponse)
console.log('Resposta backend:', data)
```

### Backend Debug

```python
# Em views.py, adicione:
import logging
logger = logging.getLogger(__name__)

def google_login(self, request):
    logger.info(f"Token recebido: {request.data.get('access_token')[:20]}...")
    logger.info(f"Resposta Google: {google_user}")
    logger.info(f"Usuário criado: {created}")
```

### Network Debug

**Chrome DevTools (F12):**
1. Aba Network
2. Filtro: XHR
3. Procure: `google-login`
4. Verifique:
   - Request payload
   - Response
   - Status code
   - Headers

---

## 🚨 Problemas Comuns

### 1. Popup não abre

**Causa:** Bloqueador de popup  
**Solução:** Permitir popups para localhost

### 2. Erro CORS

**Causa:** Origin não autorizado  
**Solução:** Adicionar http://localhost:3000 no CORS_ALLOWED_ORIGINS

### 3. Token não valida

**Causa:** Token expirou  
**Solução:** Fazer login novamente (tokens expiram rápido)

### 4. Erro 404 no endpoint

**Causa:** Backend não rodando ou URL errada  
**Solução:** Verificar http://localhost:8000/api/users/google-login/

### 5. Usuário não cria

**Causa:** Erro no backend (constraint, validação)  
**Solução:** Verificar logs do Django

---

## 📈 Métricas de Sucesso

### Desenvolvimento
- [ ] Fluxo completo funciona em < 5s
- [ ] 0 erros no console
- [ ] 0 warnings no backend
- [ ] Todos os casos de teste passam

### Produção
- [ ] Taxa de sucesso > 95%
- [ ] Tempo médio < 3s
- [ ] Taxa de abandono < 10%
- [ ] Conversão login social > 30%

---

## ✅ Teste Final

Execute todos os passos em ordem:

1. [ ] Passo 1: Preparar ambiente
2. [ ] Passo 2: Teste manual login
3. [ ] Passo 3: Verificar dados
4. [ ] Passo 4: Teste manual register
5. [ ] Teste de API direta
6. [ ] Todos os 6 casos de teste
7. [ ] Checklist de validação completo

**Se todos passarem:** ✅ Sistema pronto para produção!

---

**Data:** 18 de Agosto de 2026  
**Testes:** 6 casos implementados  
**Cobertura:** Frontend + Backend + Integração
