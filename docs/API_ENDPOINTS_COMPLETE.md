# 📡 DOCUMENTAÇÃO COMPLETA DE APIs - AcadLink

## 📋 Índice
1. **Autenticação & Autorização**
2. **Utilizadores & Perfil**
3. **Posts & Feed**
4. **Reels & Vídeos**
5. **Mensagens & Chat**
6. **Conexões & Networking**
7. **Notificações**
8. **Pesquisa & Descoberta**
9. **Moderação & Segurança**
10. **Analytics & Relatórios**
11. **Media & Upload**
12. **WebSocket & Real-time**

---

## 1️⃣ AUTENTICAÇÃO & AUTORIZAÇÃO

### 1.1 Login
```http
POST /api/auth/token/
Content-Type: application/json

{
  "email": "user@uem.ac.mz",
  "password": "secure_password"
}

Response (200):
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "user@uem.ac.mz",
    "username": "username",
    "first_name": "João",
    "last_name": "Silva",
    "university": { "id": 1, "name": "UEM", "acronym": "UEM" },
    "course": "Engenharia Informática",
    "year": 3,
    "is_email_verified": true,
    "is_university_verified": true
  }
}
```

### 1.2 Refresh Token
```http
POST /api/auth/token/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

Response (200):
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### 1.3 Registar Nova Conta
```http
POST /api/users/register/
Content-Type: application/json

{
  "email": "newuser@uem.ac.mz",
  "username": "newuser",
  "first_name": "Maria",
  "last_name": "Santos",
  "password": "SecurePass123!",
  "password_confirm": "SecurePass123!",
  "university_id": 1,
  "course": "Design Gráfico",
  "year": 2
}

Response (201):
{
  "id": 2,
  "email": "newuser@uem.ac.mz",
  "username": "newuser",
  "first_name": "Maria",
  ...
}
```

### 1.4 Pedido de Recuperação de Senha
```http
POST /api/users/forgot_password/
Content-Type: application/json

{
  "email": "user@uem.ac.mz"
}

Response (200):
{
  "detail": "Email de recuperação enviado com sucesso"
}
```

### 1.5 Resetar Senha
```http
POST /api/users/reset_password/
Content-Type: application/json

{
  "email": "user@uem.ac.mz",
  "token": "reset-token-uuid",
  "new_password": "NewSecurePass123!"
}

Response (200):
{
  "detail": "Senha alterada com sucesso"
}
```

---

## 2️⃣ UTILIZADORES & PERFIL

### 2.1 Obter Perfil do Utilizador Atual
```http
GET /api/users/me/
Authorization: Bearer {access_token}

Response (200):
{
  "id": 1,
  "email": "user@uem.ac.mz",
  "username": "joao_silva",
  "first_name": "João",
  "last_name": "Silva",
  "university": {
    "id": 1,
    "name": "Universidade Eduardo Mondlane",
    "acronym": "UEM",
    "country": "Moçambique"
  },
  "course": "Engenharia Informática",
  "year": 3,
  "is_email_verified": true,
  "is_university_verified": true,
  "profile": {
    "avatar": "https://example.com/avatars/user1.jpg",
    "cover": "https://example.com/covers/user1.jpg",
    "bio": "Estudante de Engenharia Informática na UEM",
    "website": "https://joaosilva.dev",
    "connections_count": 247,
    "posts_count": 34,
    "reels_count": 12,
    "profile_visibility": "public",
    "receive_notifications": true
  }
}
```

### 2.2 Obter Perfil Público de Outro Utilizador
```http
GET /api/users/{user_id}/public_profile/
Authorization: Bearer {access_token}

Response (200): [mesma estrutura que 2.1]
Response (403): { "detail": "This profile is private" }
```

### 2.3 Atualizar Perfil
```http
PUT /api/users/update_profile/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "first_name": "João",
  "last_name": "Silva",
  "bio": "Dev & Student | Python & React",
  "website": "https://joao.dev",
  "profile_visibility": "public"
}

Response (200): [perfil atualizado]
```

### 2.4 Alterar Senha
```http
POST /api/users/change_password/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "old_password": "current_password",
  "new_password": "NewSecurePass123!",
  "new_password_confirm": "NewSecurePass123!"
}

Response (200): { "detail": "Password changed successfully" }
```

### 2.5 Listar Universidades
```http
GET /api/users/universities/
Authorization: Bearer {access_token}

Response (200):
[
  {
    "id": 1,
    "name": "Universidade Eduardo Mondlane",
    "acronym": "UEM",
    "country": "Moçambique",
    "website": "https://uem.mz",
    "email_domain": "uem.ac.mz",
    "courses": [
      "Engenharia Informática",
      "Design Gráfico",
      "Administração",
      ...
    ]
  },
  ...
]
```

### 2.6 Verificação de Email
```http
POST /api/users/verify_email/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "token": "email-verification-token",
  "email": "user@uem.ac.mz"
}

Response (200):
{
  "detail": "Email verified successfully",
  "is_email_verified": true
}
```

### 2.7 Verificação de Universidade
```http
POST /api/users/verify_university/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "email_domain": "uem.ac.mz",
  "verification_code": "123456"
}

Response (200):
{
  "detail": "University verified successfully",
  "is_university_verified": true
}
```

---

## 3️⃣ POSTS & FEED

### 3.1 Criar Post
```http
POST /api/posts/
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

{
  "content": "Acabei de terminar meu projeto final! 🎉",
  "category": "académico",
  "visibility": "public",
  "image": <file>,
  "tags": ["projeto", "programação"],
  "mentions": [2, 3, 5]
}

Response (201):
{
  "id": 1,
  "author": { "id": 1, "username": "joao_silva", ... },
  "content": "Acabei de terminar meu projeto final! 🎉",
  "category": "académico",
  "visibility": "public",
  "image": "https://...",
  "tags": ["projeto", "programação"],
  "likes_count": 0,
  "comments_count": 0,
  "shares_count": 0,
  "is_liked": false,
  "is_saved": false,
  "created_at": "2024-06-04T10:30:00Z"
}
```

### 3.2 Obter Feed Personalizado
```http
GET /api/posts/feed/?page=1&page_size=20
Authorization: Bearer {access_token}

Response (200):
{
  "count": 150,
  "next": "https://api.example.com/api/posts/feed/?page=2",
  "previous": null,
  "results": [
    { id: 1, author: {...}, content: "...", ... },
    { id: 2, author: {...}, content: "...", ... },
    ...
  ]
}
```

### 3.3 Obter Post Único
```http
GET /api/posts/{post_id}/
Authorization: Bearer {access_token}

Response (200): [post details]
```

### 3.4 Atualizar Post
```http
PATCH /api/posts/{post_id}/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "content": "Conteúdo atualizado",
  "category": "oportunidade"
}

Response (200): [post updated]
```

### 3.5 Deletar Post
```http
DELETE /api/posts/{post_id}/
Authorization: Bearer {access_token}

Response (204): No Content
```

### 3.6 Dar Like em Post
```http
POST /api/posts/{post_id}/like/
Authorization: Bearer {access_token}

Response (201):
{
  "detail": "Post liked",
  "likes_count": 5
}
```

### 3.7 Remover Like de Post
```http
POST /api/posts/{post_id}/unlike/
Authorization: Bearer {access_token}

Response (200):
{
  "detail": "Post unliked",
  "likes_count": 4
}
```

### 3.8 Guardar Post
```http
POST /api/posts/{post_id}/save/
Authorization: Bearer {access_token}

Response (201):
{
  "detail": "Post saved",
  "is_saved": true
}
```

### 3.9 Remover Post Guardado
```http
POST /api/posts/{post_id}/unsave/
Authorization: Bearer {access_token}

Response (200):
{
  "detail": "Post unsaved",
  "is_saved": false
}
```

### 3.10 Obter Posts Guardados
```http
GET /api/posts/saved/?page=1
Authorization: Bearer {access_token}

Response (200): [paginated posts]
```

### 3.11 Comentar em Post
```http
POST /api/posts/{post_id}/comment/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "content": "Muito bom! Parabéns 🎉"
}

Response (201):
{
  "id": 1,
  "author": { "id": 1, "username": "joao_silva", ... },
  "content": "Muito bom! Parabéns 🎉",
  "post_id": 1,
  "created_at": "2024-06-04T10:31:00Z"
}
```

### 3.12 Obter Comentários de Post
```http
GET /api/posts/{post_id}/comments/?page=1
Authorization: Bearer {access_token}

Response (200): [comments list]
```

### 3.13 Deletar Comentário
```http
DELETE /api/posts/{post_id}/comments/{comment_id}/
Authorization: Bearer {access_token}

Response (204): No Content
```

### 3.14 Pesquisar Posts
```http
GET /api/posts/search/?q=python&category=académico&author_id=1
Authorization: Bearer {access_token}

Response (200): [filtered posts]
```

---

## 4️⃣ REELS & VÍDEOS

### 4.1 Upload de Reel
```http
POST /api/reels/upload/
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

{
  "video": <file>,          # video file (max 100MB)
  "thumbnail": <file>,      # optional thumbnail
  "description": "Dica de estudo rápida!",
  "category": "StudyTips",
  "hashtags": ["#estudo", "#dica"],
  "duration": 45,           # in seconds
  "visibility": "public"
}

Response (201):
{
  "id": 1,
  "author": { "id": 1, ... },
  "video": "https://...",
  "thumbnail": "https://...",
  "description": "Dica de estudo rápida!",
  "category": "StudyTips",
  "hashtags": ["#estudo", "#dica"],
  "duration": 45,
  "visibility": "public",
  "moderation_status": "pending",
  "likes_count": 0,
  "views_count": 0,
  "comments_count": 0,
  "created_at": "2024-06-04T10:30:00Z"
}
```

### 4.2 Obter Feed de Reels
```http
GET /api/reels/feed/?page=1&page_size=20
Authorization: Bearer {access_token}

Response (200):
{
  "count": 500,
  "next": "...",
  "results": [
    { id: 1, author: {...}, video: "...", ... },
    ...
  ]
}
```

### 4.3 Obter Reels em Tendência
```http
GET /api/reels/trending/?limit=20
Authorization: Bearer {access_token}

Response (200): [trending reels]
```

### 4.4 Pesquisar Reels
```http
GET /api/reels/search/?q=estudo&category=StudyTips&page=1
Authorization: Bearer {access_token}

Response (200): [filtered reels]
```

### 4.5 Obter Reel Único
```http
GET /api/reels/{reel_id}/
Authorization: Bearer {access_token}

Response (200): [reel details]
```

### 4.6 Dar Like em Reel
```http
POST /api/reels/{reel_id}/like/
Authorization: Bearer {access_token}

Response (201): { "detail": "Reel liked", "likes_count": 10 }
```

### 4.7 Remover Like de Reel
```http
POST /api/reels/{reel_id}/unlike/
Authorization: Bearer {access_token}

Response (200): { "detail": "Reel unliked", "likes_count": 9 }
```

### 4.8 Guardar Reel
```http
POST /api/reels/{reel_id}/save/
Authorization: Bearer {access_token}

Response (201): { "detail": "Reel saved" }
```

### 4.9 Remover Reel Guardado
```http
POST /api/reels/{reel_id}/unsave/
Authorization: Bearer {access_token}

Response (200): { "detail": "Reel unsaved" }
```

### 4.10 Comentar em Reel
```http
POST /api/reels/{reel_id}/comment/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "content": "Ótima dica!"
}

Response (201): [comment created]
```

### 4.11 Rastrear Visualização de Reel
```http
POST /api/reels/{reel_id}/view/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "watch_time": 30,      # seconds watched
  "completed": false     # did user watch until end?
}

Response (200): { "detail": "View tracked" }
```

### 4.12 Denunciar Reel
```http
POST /api/reels/{reel_id}/report/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "reason": "inappropriate_content",
  "description": "Contém linguagem ofensiva"
}

Response (201): { "detail": "Report submitted" }
```

### 4.13 Listar Categorias de Reel
```http
GET /api/reels/categories/
Authorization: Bearer {access_token}

Response (200):
[
  {
    "id": 1,
    "key": "StudyTips",
    "label": "Dicas de Estudo",
    "icon": "📚",
    "color": "#3B82F6"
  },
  ...
]
```

### 4.14 Obter Reels do Utilizador
```http
GET /api/reels/?author_id={user_id}
Authorization: Bearer {access_token}

Response (200): [user's reels]
```

### 4.15 Deletar Reel
```http
DELETE /api/reels/{reel_id}/
Authorization: Bearer {access_token}

Response (204): No Content
```

---

## 5️⃣ MENSAGENS & CHAT

### 5.1 Listar Conversas
```http
GET /api/messages/?page=1&page_size=50
Authorization: Bearer {access_token}

Response (200):
[
  {
    "id": 1,
    "participants": [
      { "id": 1, "username": "joao_silva", ... },
      { "id": 2, "username": "maria_santos", ... }
    ],
    "is_group": false,
    "name": null,
    "last_message": {
      "id": 100,
      "sender": { "id": 1, ... },
      "content": "Oi! Como vai?",
      "created_at": "2024-06-04T10:30:00Z",
      "is_read": true
    },
    "unread_count": 0,
    "updated_at": "2024-06-04T10:30:00Z"
  },
  ...
]
```

### 5.2 Obter Conversa com Mensagens
```http
GET /api/messages/{conversation_id}/?page=1
Authorization: Bearer {access_token}

Response (200):
{
  "id": 1,
  "participants": [...],
  "is_group": false,
  "messages": [
    {
      "id": 95,
      "sender": { "id": 1, ... },
      "content": "Oi!",
      "is_read": true,
      "read_at": "2024-06-04T10:25:00Z",
      "created_at": "2024-06-04T10:20:00Z"
    },
    ...
  ]
}
```

### 5.3 Enviar Mensagem
```http
POST /api/messages/{conversation_id}/send/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "content": "Oi! Como vai?",
  "reply_to": null  # optional message id to reply
}

Response (201):
{
  "id": 101,
  "conversation_id": 1,
  "sender": { "id": 1, ... },
  "content": "Oi! Como vai?",
  "is_read": false,
  "created_at": "2024-06-04T10:31:00Z"
}
```

### 5.4 Criar Nova Conversa (Direct)
```http
POST /api/messages/create/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "user_id": 2  # recipient user id
}

Response (201):
{
  "id": 2,
  "participants": [...],
  "is_group": false
}
```

### 5.5 Criar Grupo de Chat
```http
POST /api/messages/groups/create/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Projeto Final 2024",
  "participants": [2, 3, 4, 5],
  "description": "Chat do grupo de projeto"
}

Response (201):
{
  "id": 10,
  "name": "Projeto Final 2024",
  "participants": [...],
  "is_group": true,
  "created_at": "2024-06-04T10:32:00Z"
}
```

### 5.6 Marcar Mensagem como Lida
```http
PUT /api/messages/{message_id}/read/
Authorization: Bearer {access_token}

Response (200):
{
  "is_read": true,
  "read_at": "2024-06-04T10:33:00Z"
}
```

### 5.7 Marcar Conversa como Lida
```http
PUT /api/messages/{conversation_id}/mark_as_read/
Authorization: Bearer {access_token}

Response (200):
{
  "detail": "All messages marked as read"
}
```

### 5.8 Deletar Mensagem
```http
DELETE /api/messages/{message_id}/
Authorization: Bearer {access_token}

Response (204): No Content
```

### 5.9 Adicionar Reação a Mensagem
```http
POST /api/messages/{message_id}/react/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "emoji": "👍"
}

Response (201):
{
  "id": 1,
  "message_id": 100,
  "user": { "id": 1, ... },
  "emoji": "👍"
}
```

### 5.10 Remover Reação
```http
DELETE /api/messages/{message_id}/react/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "emoji": "👍"
}

Response (204): No Content
```

### 5.11 Sair de Grupo
```http
POST /api/messages/{conversation_id}/leave/
Authorization: Bearer {access_token}

Response (200):
{
  "detail": "Left the group"
}
```

### 5.12 Adicionar Membro a Grupo
```http
POST /api/messages/{conversation_id}/add_member/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "user_id": 6
}

Response (200):
{
  "detail": "Member added",
  "participants": [...]
}
```

---

## 6️⃣ CONEXÕES & NETWORKING

### 6.1 Conectar com Utilizador
```http
POST /api/connections/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "target_user_id": 2
}

Response (201):
{
  "id": 1,
  "requester": { "id": 1, ... },
  "target": { "id": 2, ... },
  "status": "pending",
  "created_at": "2024-06-04T10:33:00Z"
}
```

### 6.2 Aceitar Pedido de Conexão
```http
POST /api/connections/{connection_id}/accept/
Authorization: Bearer {access_token}

Response (200):
{
  "status": "accepted",
  "updated_at": "2024-06-04T10:34:00Z"
}
```

### 6.3 Rejeitar Pedido de Conexão
```http
POST /api/connections/{connection_id}/reject/
Authorization: Bearer {access_token}

Response (200):
{
  "status": "rejected"
}
```

### 6.4 Remover Conexão
```http
DELETE /api/connections/{connection_id}/
Authorization: Bearer {access_token}

Response (204): No Content
```

### 6.5 Listar Conexões do Utilizador
```http
GET /api/connections/?user_id={user_id}&status=accepted&page=1
Authorization: Bearer {access_token}

Response (200):
{
  "count": 247,
  "next": "...",
  "results": [
    {
      "id": 1,
      "user": { "id": 2, "username": "maria_santos", ... },
      "degree": 1,
      "connection_type": "colleague"
    },
    ...
  ]
}
```

### 6.6 Obter Sugestões de Conexão
```http
GET /api/connections/suggestions/?limit=10
Authorization: Bearer {access_token}

Response (200):
[
  {
    "id": 5,
    "username": "carlos_oliveira",
    "name": "Carlos Oliveira",
    "university": { "id": 1, "name": "UEM", ... },
    "course": "Engenharia Informática",
    "reason": "Mesmo curso, outra universidade",
    "mutual_connections": 3,
    "is_connected": false
  },
  ...
]
```

### 6.7 Bloquear Utilizador
```http
POST /api/connections/block/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "user_id": 10
}

Response (201):
{
  "detail": "User blocked"
}
```

### 6.8 Desbloquear Utilizador
```http
POST /api/connections/unblock/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "user_id": 10
}

Response (200):
{
  "detail": "User unblocked"
}
```

### 6.9 Listar Utilizadores Bloqueados
```http
GET /api/connections/blocked/?page=1
Authorization: Bearer {access_token}

Response (200): [blocked users]
```

---

## 7️⃣ NOTIFICAÇÕES

### 7.1 Listar Notificações
```http
GET /api/notifications/?page=1&unread=true
Authorization: Bearer {access_token}

Response (200):
{
  "count": 45,
  "unread_count": 12,
  "results": [
    {
      "id": 1,
      "type": "like_post",
      "actor": { "id": 2, "username": "maria_santos", ... },
      "content_type": "post",
      "object_id": 5,
      "description": "Maria gostou do teu post",
      "is_read": false,
      "created_at": "2024-06-04T10:35:00Z"
    },
    {
      "id": 2,
      "type": "new_connection",
      "actor": { "id": 3, ... },
      "description": "Carlos quer conectar-se contigo",
      "is_read": false,
      "created_at": "2024-06-04T10:34:00Z"
    },
    ...
  ]
}
```

### 7.2 Marcar Notificação como Lida
```http
PUT /api/notifications/{notification_id}/read/
Authorization: Bearer {access_token}

Response (200):
{
  "is_read": true,
  "read_at": "2024-06-04T10:36:00Z"
}
```

### 7.3 Marcar Todas as Notificações como Lidas
```http
POST /api/notifications/mark_all_as_read/
Authorization: Bearer {access_token}

Response (200):
{
  "detail": "All notifications marked as read"
}
```

### 7.4 Deletar Notificação
```http
DELETE /api/notifications/{notification_id}/
Authorization: Bearer {access_token}

Response (204): No Content
```

### 7.5 Obter Contagem de Não Lidas
```http
GET /api/notifications/unread_count/
Authorization: Bearer {access_token}

Response (200):
{
  "unread_count": 12
}
```

### 7.6 Obter Preferências de Notificação
```http
GET /api/notifications/preferences/
Authorization: Bearer {access_token}

Response (200):
{
  "email_notifications": true,
  "push_notifications": true,
  "frequency": "instant",
  "notification_types": {
    "likes": true,
    "comments": true,
    "new_connections": true,
    "messages": true,
    "mentions": true,
    "opportunities": true
  }
}
```

### 7.7 Atualizar Preferências de Notificação
```http
PUT /api/notifications/preferences/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "email_notifications": false,
  "push_notifications": true,
  "frequency": "digest",
  "notification_types": {
    "likes": true,
    "comments": false,
    "new_connections": true
  }
}

Response (200): [updated preferences]
```

---

## 8️⃣ PESQUISA & DESCOBERTA

### 8.1 Pesquisa Global
```http
GET /api/search/?q=python&type=all&page=1
Authorization: Bearer {access_token}

Response (200):
{
  "users": [
    { "id": 1, "username": "python_dev", ... },
    ...
  ],
  "posts": [
    { "id": 1, "content": "Python...", ... },
    ...
  ],
  "reels": [
    { "id": 1, "description": "Python...", ... },
    ...
  ],
  "tags": [
    { "tag": "#python", "count": 150 },
    ...
  ]
}
```

### 8.2 Pesquisar Utilizadores
```http
GET /api/search/users/?q=maria&university_id=1&course=Design&page=1
Authorization: Bearer {access_token}

Response (200):
{
  "count": 23,
  "results": [
    { "id": 2, "username": "maria_santos", ... },
    ...
  ]
}
```

### 8.3 Pesquisar Posts
```http
GET /api/search/posts/?q=projeto&category=académico&author_id=1&page=1
Authorization: Bearer {access_token}

Response (200): [posts results]
```

### 8.4 Pesquisar Reels
```http
GET /api/search/reels/?q=estudo&category=StudyTips&author_id=1&page=1
Authorization: Bearer {access_token}

Response (200): [reels results]
```

### 8.5 Obter Trending Tags
```http
GET /api/search/trending_tags/?limit=20
Authorization: Bearer {access_token}

Response (200):
[
  { "tag": "#programação", "count": 450, "trend": "up" },
  { "tag": "#estudar", "count": 380, "trend": "up" },
  { "tag": "#projeto", "count": 320, "trend": "stable" },
  ...
]
```

### 8.6 Obter Sugestões de Pesquisa
```http
GET /api/search/suggestions/?q=py
Authorization: Bearer {access_token}

Response (200):
{
  "users": ["python_dev", "pystudent"],
  "tags": ["#python", "#pyside"],
  "posts": ["Python Basics", "Python for Data Science"]
}
```

---

## 9️⃣ MODERAÇÃO & SEGURANÇA

### 9.1 Denunciar Post
```http
POST /api/moderation/reports/posts/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "post_id": 10,
  "reason": "inappropriate_content",
  "description": "Contém conteúdo ofensivo"
}

Response (201):
{
  "id": 1,
  "type": "post",
  "object_id": 10,
  "reason": "inappropriate_content",
  "status": "pending",
  "created_at": "2024-06-04T10:37:00Z"
}
```

### 9.2 Denunciar Utilizador
```http
POST /api/moderation/reports/users/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "user_id": 15,
  "reason": "harassment",
  "description": "Está a fazer assédio"
}

Response (201): [report created]
```

### 9.3 Denunciar Comentário
```http
POST /api/moderation/reports/comments/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "comment_id": 20,
  "reason": "spam",
  "description": "Comentário é spam"
}

Response (201): [report created]
```

### 9.4 Listar Relatórios (Admin)
```http
GET /api/moderation/reports/?status=pending&type=post
Authorization: Bearer {admin_token}

Response (200): [reports list]
```

### 9.5 Revisar Relatório (Admin)
```http
PUT /api/moderation/reports/{report_id}/review/
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "action": "remove_content",  # remove_content, warn_user, suspend_user, dismiss
  "reason": "Violates community guidelines"
}

Response (200):
{
  "status": "resolved",
  "action_taken": "remove_content"
}
```

---

## 🔟 ANALYTICS & RELATÓRIOS

### 10.1 Obter Estatísticas do Perfil
```http
GET /api/analytics/profile/{user_id}/
Authorization: Bearer {access_token}

Response (200):
{
  "total_posts": 34,
  "total_reels": 12,
  "total_engagement": 2450,
  "total_views": 5600,
  "connections_count": 247,
  "followers_count": 350,
  "engagement_rate": 0.43
}
```

### 10.2 Obter Estatísticas de Post
```http
GET /api/analytics/posts/{post_id}/
Authorization: Bearer {access_token}

Response (200):
{
  "views": 1500,
  "likes": 234,
  "comments": 45,
  "shares": 12,
  "saves": 89,
  "click_through_rate": 0.15,
  "engagement_rate": 0.20,
  "created_at": "2024-06-04T10:30:00Z",
  "performance_vs_average": 1.5  # times better than average
}
```

### 10.3 Obter Estatísticas de Reel
```http
GET /api/analytics/reels/{reel_id}/
Authorization: Bearer {access_token}

Response (200):
{
  "views": 5400,
  "average_watch_time": 32,  # seconds
  "completion_rate": 0.67,
  "likes": 456,
  "comments": 78,
  "shares": 34,
  "saves": 234,
  "traffic_sources": {
    "feed": 0.60,
    "discover": 0.25,
    "search": 0.15
  }
}
```

### 10.4 Dashboard do Criador
```http
GET /api/analytics/creator/
Authorization: Bearer {access_token}

Response (200):
{
  "period": "last_30_days",
  "total_engagement": 12500,
  "growth_rate": 0.15,
  "top_posts": [...],
  "top_reels": [...],
  "audience_demographics": {
    "universities": {...},
    "courses": {...},
    "years": {...}
  },
  "engagement_by_content_type": {...}
}
```

---

## 1️⃣1️⃣ MEDIA & UPLOAD

### 11.1 Fazer Upload de Imagem
```http
POST /api/media/upload/image/
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

{
  "image": <file>,
  "category": "post"  # post, profile, cover
}

Response (201):
{
  "id": 1,
  "url": "https://cdn.example.com/images/abc123.jpg",
  "sizes": {
    "small": "https://...-small.jpg",
    "medium": "https://...-medium.jpg",
    "large": "https://...-large.jpg"
  },
  "size": 245000,  # bytes
  "width": 1920,
  "height": 1080,
  "created_at": "2024-06-04T10:38:00Z"
}
```

### 11.2 Fazer Upload de Vídeo (Reel)
```http
POST /api/media/upload/video/
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

{
  "video": <file>,
  "thumbnail": <file>,
  "duration": 45
}

Response (201):
{
  "id": 1,
  "url": "https://cdn.example.com/videos/abc123.mp4",
  "thumbnail": "https://cdn.example.com/thumbs/abc123.jpg",
  "duration": 45,
  "size": 12500000,
  "resolution": "1080p",
  "created_at": "2024-06-04T10:38:00Z"
}
```

### 11.3 Fazer Upload de Ficheiro (Chat)
```http
POST /api/media/upload/file/
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

{
  "file": <file>,
  "context": "message"  # message, post
}

Response (201):
{
  "id": 1,
  "url": "https://...",
  "filename": "document.pdf",
  "size": 500000,
  "type": "pdf"
}
```

### 11.4 Deletar Media
```http
DELETE /api/media/{media_id}/
Authorization: Bearer {access_token}

Response (204): No Content
```

---

## 1️⃣2️⃣ WEBSOCKET & REAL-TIME (Futuro)

### 12.1 Conectar ao WebSocket
```
ws://localhost:8000/ws/chat/{conversation_id}/?token={access_token}
```

### 12.2 Eventos em Tempo Real

**Receber Mensagem:**
```json
{
  "type": "message",
  "data": {
    "id": 101,
    "sender": { "id": 1, "username": "joao_silva" },
    "content": "Oi!",
    "created_at": "2024-06-04T10:40:00Z"
  }
}
```

**Utilizador Digitando:**
```json
{
  "type": "typing",
  "user": { "id": 2, "username": "maria_santos" }
}
```

**Utilizador Online:**
```json
{
  "type": "online_status",
  "user_id": 1,
  "is_online": true
}
```

### 12.3 Enviar Mensagem via WebSocket
```json
{
  "action": "send_message",
  "content": "Olá!",
  "reply_to": null
}
```

---

## 📊 RESUMO DE ENDPOINTS

| Categoria | Total | Status |
|-----------|-------|--------|
| Autenticação | 5 | ✅ Implementado |
| Utilizadores | 7 | ✅ Implementado |
| Posts | 14 | ✅ Implementado |
| Reels | 15 | ✅ Implementado |
| Mensagens | 12 | ⚠️ Parcial |
| Conexões | 9 | ⚠️ Parcial |
| Notificações | 7 | ⚠️ Parcial |
| Pesquisa | 6 | 🔴 Falta |
| Moderação | 5 | 🔴 Falta |
| Analytics | 4 | 🔴 Falta |
| Media | 4 | 🔴 Falta |
| WebSocket | 3+ | 🔴 Futuro |
| **TOTAL** | **91+** | |

---

## 🔐 AUTENTICAÇÃO & AUTORIZAÇÃO

Todos os endpoints (exceto auth públicos) requerem:
```
Authorization: Bearer {access_token}
```

**Tokens JWT:**
- `access_token`: Válido por 15 minutos
- `refresh_token`: Válido por 7 dias
- Renovar com endpoint `/api/auth/token/refresh/`

**Permissões:**
- `IsAuthenticated`: Utilizador logado
- `IsOwner`: Proprietário do recurso
- `IsAdmin`: Administrador do sistema
- `IsModeratedTrusted`: Confiável (sem avisos)

---

## 🔄 PAGINAÇÃO

Endpoints com lista usam paginação padrão:
```
GET /api/endpoint/?page=1&page_size=20

Response:
{
  "count": 150,
  "next": "https://api.../api/endpoint/?page=2",
  "previous": null,
  "results": [...]
}
```

**Query Params:**
- `page`: Número da página (padrão: 1)
- `page_size`: Itens por página (padrão: 20, máximo: 100)

---

## 📝 FILTROS COMUNS

**Posts:**
```
?category=académico&visibility=public&author_id=1&ordering=-created_at
```

**Reels:**
```
?category=StudyTips&ordering=-views_count&moderation_status=approved
```

**Utilizadores:**
```
?university_id=1&course=Engenharia&year=3&ordering=name
```

**Notificações:**
```
?unread=true&type=like_post&ordering=-created_at
```

---

## ⚠️ TRATAMENTO DE ERROS

Todos os erros seguem este formato:
```json
{
  "detail": "Mensagem de erro",
  "error_code": "RESOURCE_NOT_FOUND",
  "status": 404,
  "timestamp": "2024-06-04T10:41:00Z"
}
```

**Códigos HTTP Comuns:**
- `200` - OK
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Endpoints de Autenticação (100%)
- [ ] Endpoints de Utilizadores (85%)
- [ ] Endpoints de Posts (90%)
- [ ] Endpoints de Reels (90%)
- [ ] Endpoints de Mensagens (40%)
- [ ] Endpoints de Conexões (50%)
- [ ] Endpoints de Notificações (60%)
- [ ] Endpoints de Pesquisa (0%)
- [ ] Endpoints de Moderação (0%)
- [ ] Endpoints de Analytics (0%)
- [ ] Upload de Media (40%)
- [ ] WebSocket Real-time (0%)

**Total: ~50% completo**
