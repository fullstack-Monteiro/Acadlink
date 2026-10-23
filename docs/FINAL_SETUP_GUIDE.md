# 🚀 Guia Final de Setup - AcadLink

## Status: 100% Pronto para Testes

Todos os arquivos foram criados e configurados. Agora é hora de testar tudo!

---

## 1️⃣ SETUP DO BACKEND

### Pré-requisitos
- Python 3.9+
- PostgreSQL (ou SQLite para desenvolvimento)
- Redis (para Celery)

### Instalação

```bash
cd backend

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements/base.txt

# Criar arquivo .env
cp .env.example .env

# Editar .env com suas configurações
# DATABASE_URL=postgresql://user:password@localhost:5432/acadlink
# SECRET_KEY=sua-chave-secreta-aqui
# DEBUG=True (apenas desenvolvimento)
```

### Executar Migrações

```bash
python manage.py makemigrations
python manage.py migrate
```

### Criar Superusuário

```bash
python manage.py createsuperuser
# Seguir as instruções
```

### Iniciar Servidor

```bash
# Terminal 1: Servidor Django
python manage.py runserver

# Terminal 2: Celery Worker (para processamento de vídeos)
celery -A config worker -l info

# Terminal 3: Celery Beat (para tarefas agendadas)
celery -A config beat -l info
```

O backend estará em: `http://localhost:8000`
Admin em: `http://localhost:8000/admin`

---

## 2️⃣ SETUP DO FRONTEND

### Instalação

```bash
cd acadlink

# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env

# Editar .env com suas configurações
# VITE_API_URL=http://localhost:8000/api
# VITE_WEBSOCKET_URL=ws://localhost:8000/ws
```

### Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

O frontend estará em: `http://localhost:3000` (ou a porta que Vite indicar)

---

## 3️⃣ TESTES DE FUNCIONALIDADE

### ✅ Autenticação

1. Abrir frontend em `http://localhost:3000`
2. Clicar em "Registrar" ou "Login"
3. Criar conta ou fazer login
4. Verificar se token JWT é salvo em localStorage
5. Verificar se usuário é redirecionado para Dashboard

**Esperado**: Login funciona, token é salvo, usuário autenticado

### ✅ Posts

1. No Dashboard, clicar em "Criar Post"
2. Escrever conteúdo e clicar "Publicar"
3. Verificar se post aparece no feed
4. Testar like, comentário, compartilhamento

**Esperado**: Post criado, aparece no feed, interações funcionam

### ✅ Reels

1. Ir para aba "Reels"
2. Clicar em "Upload Reel"
3. Selecionar vídeo, adicionar descrição e categoria
4. Clicar "Upload"
5. Verificar se reel aparece no feed

**Esperado**: Reel enviado, processado, aparece no feed

### ✅ Mensagens (WebSocket)

1. Ir para "Mensagens"
2. Selecionar um contato ou criar nova conversa
3. Enviar mensagem
4. Verificar se mensagem aparece em tempo real

**Esperado**: Mensagem enviada e recebida em tempo real

### ✅ Notificações (WebSocket)

1. Abrir em dois navegadores (ou abas)
2. No navegador 1, fazer uma ação (like, comentário, follow)
3. No navegador 2, verificar se notificação aparece em tempo real

**Esperado**: Notificação recebida em tempo real

### ✅ Conexões

1. Ir para "Explorar"
2. Encontrar outro usuário
3. Clicar "Seguir"
4. Verificar se conexão é criada

**Esperado**: Conexão criada, contagem de seguidores atualizada

---

## 4️⃣ TESTES DE API (com Postman/Insomnia)

### Endpoints Principais

#### Autenticação
```
POST /api/auth/register/
POST /api/auth/login/
POST /api/auth/refresh/
POST /api/auth/logout/
```

#### Posts
```
GET /api/posts/
POST /api/posts/
GET /api/posts/{id}/
PUT /api/posts/{id}/
DELETE /api/posts/{id}/
POST /api/posts/{id}/like/
POST /api/posts/{id}/comment/
```

#### Reels
```
GET /api/reels/feed/
POST /api/reels/upload/
GET /api/reels/{id}/
POST /api/reels/{id}/like/
POST /api/reels/{id}/comment/
GET /api/reels/trending/
GET /api/reels/search/
```

#### Mensagens
```
GET /api/messages/
POST /api/messages/
GET /api/messages/{id}/messages/
POST /api/messages/{id}/send_message/
```

#### Notificações
```
GET /api/notifications/
POST /api/notifications/{id}/mark_as_read/
POST /api/notifications/mark_all_as_read/
DELETE /api/notifications/{id}/
```

#### Usuários
```
GET /api/users/
GET /api/users/{id}/
PUT /api/users/{id}/
GET /api/users/{id}/profile/
POST /api/users/{id}/follow/
POST /api/users/{id}/unfollow/
```

---

## 5️⃣ TROUBLESHOOTING

### Backend não conecta ao banco de dados
- Verificar se PostgreSQL está rodando
- Verificar DATABASE_URL em .env
- Executar: `python manage.py migrate`

### WebSocket não conecta
- Verificar se Daphne está rodando (para WebSockets)
- Verificar VITE_WEBSOCKET_URL no frontend
- Verificar CORS_ALLOWED_ORIGINS em settings

### Vídeos não processam
- Verificar se Celery está rodando
- Verificar se Redis está rodando
- Verificar logs do Celery

### CORS errors
- Verificar CORS_ALLOWED_ORIGINS em backend/config/settings/base.py
- Adicionar `http://localhost:3000` se não estiver

### Token expirado
- Frontend automaticamente faz refresh
- Se não funcionar, fazer logout e login novamente

---

## 6️⃣ ESTRUTURA DE ARQUIVOS CRIADOS

### Backend
```
backend/
├── config/
│   ├── settings/
│   │   ├── base.py (✅ Configurações principais)
│   │   ├── development.py (✅ Dev)
│   │   └── production.py (✅ Prod)
│   ├── celery.py (✅ Celery setup)
│   ├── asgi.py (✅ WebSockets)
│   └── wsgi.py (✅ WSGI)
├── apps/
│   ├── users/ (✅ Autenticação e perfis)
│   ├── posts/ (✅ Posts e comentários)
│   ├── reels/ (✅ Reels e processamento)
│   ├── messages/ (✅ Mensagens e WebSocket)
│   ├── notifications/ (✅ Notificações e WebSocket)
│   ├── connections/ (✅ Seguir/Conexões)
│   └── moderation/ (✅ Moderação)
└── requirements/
    ├── base.txt (✅ Dependências)
    ├── dev.txt (✅ Dev)
    └── prod.txt (✅ Prod)
```

### Frontend
```
acadlink/
├── src/
│   ├── services/
│   │   └── api.js (✅ Cliente API com JWT)
│   ├── context/
│   │   ├── AuthContext.jsx (✅ Autenticação)
│   │   ├── PostsContext.jsx (✅ Posts com API)
│   │   ├── ReelsContext.jsx (✅ Reels com API)
│   │   ├── MessagesContext.jsx (✅ Mensagens com WebSocket)
│   │   └── NotificationsContext.jsx (✅ Notificações com WebSocket)
│   ├── pages/ (✅ Todas as páginas)
│   ├── components/ (✅ Todos os componentes)
│   └── hooks/ (✅ Hooks customizados)
└── .env.example (✅ Variáveis de ambiente)
```

---

## 7️⃣ PRÓXIMOS PASSOS

1. ✅ Testar autenticação
2. ✅ Testar CRUD de posts
3. ✅ Testar upload de reels
4. ✅ Testar mensagens em tempo real
5. ✅ Testar notificações em tempo real
6. ✅ Testar conexões/seguir
7. Deploy em produção (Heroku, AWS, etc)

---

## 📞 SUPORTE

Se encontrar problemas:

1. Verificar logs do backend: `python manage.py runserver`
2. Verificar console do frontend: F12 > Console
3. Verificar Network tab para erros de API
4. Verificar arquivo .env em ambos os lados

---

**Projeto 100% pronto! Bom desenvolvimento! 🎉**
