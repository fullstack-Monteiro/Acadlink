# 🧪 Guia de Testes - AcadLink

## Pré-requisitos

- ✅ Backend rodando em `http://localhost:8000`
- ✅ Frontend rodando em `http://localhost:3000`
- ✅ Navegador moderno (Chrome, Firefox, Safari, Edge)

---

## 📋 Testes Manuais

### 1️⃣ Tela de Splash

**Passos:**
1. Abrir `http://localhost:3000`
2. Verificar se aparece tela com logo e loading

**Esperado:**
- ✅ Logo do AcadLink aparece
- ✅ Spinner de carregamento animado
- ✅ Texto "Carregando..."
- ✅ Após 3 segundos, redireciona para Welcome

---

### 2️⃣ Criar Conta

**Passos:**
1. Clicar em "Criar Conta"
2. Preencher formulário:
   - Nome: "João Silva"
   - Email: "joao@example.com"
   - Universidade: Selecionar uma
   - Curso: Selecionar um
   - Senha: "senha123"
   - Confirmar: "senha123"
3. Clicar "Criar conta"

**Esperado:**
- ✅ Validação de campos funciona
- ✅ Botão fica em loading
- ✅ Redireciona para Dashboard
- ✅ Usuário aparece no topo

**Se falhar:**
- ❌ Mensagem de erro aparece
- ❌ Verificar se backend está rodando
- ❌ Verificar console (F12 > Console)

---

### 3️⃣ Fazer Login

**Passos:**
1. Clicar em "Entrar"
2. Preencher:
   - Email: "joao@example.com"
   - Senha: "senha123"
3. Clicar "Entrar"

**Esperado:**
- ✅ Login bem-sucedido
- ✅ Redireciona para Dashboard
- ✅ Token JWT salvo em localStorage

**Verificar localStorage:**
```javascript
// Abrir Console (F12) e executar:
localStorage.getItem('access_token')
// Deve retornar um token JWT
```

---

### 4️⃣ Criar Post

**Passos:**
1. No Dashboard, clicar em "Criar Post"
2. Escrever conteúdo: "Meu primeiro post!"
3. Clicar "Publicar"

**Esperado:**
- ✅ Post aparece no feed
- ✅ Mostra nome do usuário
- ✅ Mostra data/hora
- ✅ Botões de like, comentário, compartilhar

---

### 5️⃣ Like em Post

**Passos:**
1. No feed, clicar no ícone de coração
2. Verificar se contador aumenta

**Esperado:**
- ✅ Coração fica preenchido
- ✅ Contador aumenta
- ✅ Ação é salva no backend

---

### 6️⃣ Comentar em Post

**Passos:**
1. Clicar no ícone de comentário
2. Escrever comentário: "Ótimo post!"
3. Clicar "Enviar"

**Esperado:**
- ✅ Comentário aparece
- ✅ Mostra nome do usuário
- ✅ Contador de comentários aumenta

---

### 7️⃣ Upload de Reel

**Passos:**
1. Ir para "Reels"
2. Clicar "Upload Reel"
3. Selecionar vídeo (MP4, MOV, etc)
4. Adicionar descrição: "Meu primeiro reel!"
5. Selecionar categoria: "Dicas de Estudo"
6. Clicar "Upload"

**Esperado:**
- ✅ Barra de progresso aparece
- ✅ Vídeo é enviado
- ✅ Reel aparece no feed
- ✅ Thumbnail é gerada automaticamente

---

### 8️⃣ Enviar Mensagem

**Passos:**
1. Ir para "Mensagens"
2. Selecionar um contato ou criar nova conversa
3. Escrever mensagem: "Olá!"
4. Clicar "Enviar"

**Esperado:**
- ✅ Mensagem aparece na conversa
- ✅ Mostra hora de envio
- ✅ Mensagem é salva no backend

---

### 9️⃣ Receber Notificação

**Passos:**
1. Abrir em dois navegadores (ou abas)
2. No navegador 1, fazer uma ação (like, comentário)
3. No navegador 2, verificar se notificação aparece

**Esperado:**
- ✅ Notificação aparece em tempo real
- ✅ Badge de contagem atualiza
- ✅ Clique na notificação leva ao post

---

### 🔟 Seguir Usuário

**Passos:**
1. Ir para "Explorar"
2. Encontrar outro usuário
3. Clicar "Seguir"

**Esperado:**
- ✅ Botão muda para "Deixar de Seguir"
- ✅ Contagem de seguidores aumenta
- ✅ Ação é salva no backend

---

## 🔍 Testes de API (com Postman/Insomnia)

### Importar Endpoints

1. Abrir Postman/Insomnia
2. Criar nova coleção "AcadLink"
3. Adicionar endpoints abaixo

### Autenticação

**Registrar:**
```
POST http://localhost:8000/api/users/register/
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "university": "Universidade Eduardo Mondlane",
  "course": "Engenharia Informática",
  "password": "senha123"
}
```

**Login:**
```
POST http://localhost:8000/api/auth/token/
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "senha123"
}
```

Resposta:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Posts

**Listar Posts:**
```
GET http://localhost:8000/api/posts/
Authorization: Bearer {access_token}
```

**Criar Post:**
```
POST http://localhost:8000/api/posts/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "content": "Meu primeiro post!",
  "visibility": "public"
}
```

**Like em Post:**
```
POST http://localhost:8000/api/posts/{id}/like/
Authorization: Bearer {access_token}
```

### Reels

**Listar Reels:**
```
GET http://localhost:8000/api/reels/feed/
Authorization: Bearer {access_token}
```

**Upload Reel:**
```
POST http://localhost:8000/api/reels/upload/
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

- video: (arquivo)
- description: "Meu reel"
- category_id: 1
- hashtags: ["estudo", "dica"]
```

### Mensagens

**Listar Conversas:**
```
GET http://localhost:8000/api/messages/
Authorization: Bearer {access_token}
```

**Enviar Mensagem:**
```
POST http://localhost:8000/api/messages/{conversation_id}/send_message/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "content": "Olá!"
}
```

### Notificações

**Listar Notificações:**
```
GET http://localhost:8000/api/notifications/
Authorization: Bearer {access_token}
```

**Marcar como Lida:**
```
POST http://localhost:8000/api/notifications/{id}/mark_as_read/
Authorization: Bearer {access_token}
```

---

## 🐛 Troubleshooting

### Erro 404 - Endpoint não encontrado
- Verificar URL da API
- Verificar se backend está rodando
- Verificar se endpoint existe em `backend/apps/*/urls.py`

### Erro 401 - Não autenticado
- Verificar se token JWT está sendo enviado
- Verificar se token não expirou
- Fazer login novamente

### Erro 403 - Sem permissão
- Verificar se usuário tem permissão
- Verificar se é o dono do recurso

### Erro 500 - Erro do servidor
- Verificar logs do backend
- Verificar console do Django
- Verificar se banco de dados está OK

### WebSocket não conecta
- Verificar se Daphne está rodando
- Verificar VITE_WEBSOCKET_URL
- Verificar CORS_ALLOWED_ORIGINS

---

## ✅ Checklist de Testes

- [ ] Splash screen aparece
- [ ] Criar conta funciona
- [ ] Login funciona
- [ ] Criar post funciona
- [ ] Like em post funciona
- [ ] Comentário funciona
- [ ] Upload de reel funciona
- [ ] Enviar mensagem funciona
- [ ] Receber notificação funciona
- [ ] Seguir usuário funciona
- [ ] Logout funciona
- [ ] Todos os endpoints respondem
- [ ] WebSocket conecta
- [ ] Mensagens em tempo real funcionam
- [ ] Notificações em tempo real funcionam

---

## 📊 Relatório de Testes

Após completar os testes, criar um relatório:

```markdown
# Relatório de Testes - AcadLink

**Data**: [data]
**Testador**: [nome]
**Ambiente**: Desenvolvimento

## Testes Passados
- ✅ [teste 1]
- ✅ [teste 2]

## Testes Falhados
- ❌ [teste 1] - Motivo: [descrição]

## Bugs Encontrados
1. [Bug 1] - Severidade: Alta
2. [Bug 2] - Severidade: Média

## Recomendações
- [Recomendação 1]
- [Recomendação 2]
```

---

**Pronto para testar! 🚀**
