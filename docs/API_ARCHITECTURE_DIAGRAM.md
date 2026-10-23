# 🏗️ ARQUITETURA DE APIs - DIAGRAMA E FLUXOS

## 📐 ESTRUTURA GERAL DO SISTEMA

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                        │
│  Dashboard | Feed | Reels | Messages | Profile | Explore  │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTP/REST Calls
                 │ WebSocket (Real-time)
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY / PROXY                      │
│  Rate Limiting | CORS | Auth Validation | Logging          │
└────────────────┬────────────────────────────────────────────┘
                 │
    ┌────────────┼────────────┬──────────────┬─────────┐
    │            │            │              │         │
    ▼            ▼            ▼              ▼         ▼
┌───────┐ ┌─────────┐ ┌────────┐ ┌─────────┐ ┌──────┐
│ Users │ │ Posts   │ │ Reels  │ │Messages │ │Other │
│ Auth  │ │ Feed    │ │ Videos │ │ Chats   │ │Apps  │
└───────┘ └─────────┘ └────────┘ └─────────┘ └──────┘
    │            │            │              │         │
    └────────────┼────────────┼──────────────┼─────────┘
                 │
                 ▼
        ┌─────────────────┐
        │  Django Backend │
        │  DRF ViewSets   │
        │  Serializers    │
        │  Permissions    │
        └────────┬────────┘
                 │
    ┌────────────┼────────────┬──────────────┐
    │            │            │              │
    ▼            ▼            ▼              ▼
┌─────────┐ ┌────────┐ ┌──────────┐ ┌─────────┐
│PostgreSQL│ │  Cache │ │  Redis   │ │ Storage │
│Database  │ │(Django)│ │(Sessions)│ │  (S3)   │
└─────────┘ └────────┘ └──────────┘ └─────────┘
```

---

## 🔐 FLUXO DE AUTENTICAÇÃO

```
┌──────────────────────────────────────────┐
│     FRONTEND (React)                     │
│  Inputs: email + password                │
└────────────────┬─────────────────────────┘
                 │
                 ▼
         ┌───────────────┐
         │  POST /token/ │
         └───────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │  Backend - TokenObtainPair  │
    │  - Validar credenciais      │
    │  - Gerar JWT tokens         │
    └────────────────────────────┘
                 │
         ┌───────┴────────┐
         │                │
         ▼                ▼
    ┌────────────┐   ┌──────────────┐
    │access_token│   │refresh_token │
    │(15 min)    │   │(7 dias)      │
    └────────────┘   └──────────────┘
         │
         ▼
    ┌──────────────────────┐
    │ localStorage/Storage │
    │ + Axios interceptor  │
    └──────────────────────┘
         │
         ▼
    ┌──────────────────────┐
    │ Todos os requests:   │
    │ Authorization: Bearer│
    └──────────────────────┘
         │
    ┌────┴─────────────────────────┐
    │                              │
    ▼ (sucesso)                    ▼ (expirado)
┌────────────┐              ┌──────────────────┐
│ Acesso     │              │ POST /token/     │
│ Concedido  │              │ refresh/         │
└────────────┘              └──────────────────┘
                                   │
                                   ▼
                            ┌──────────────┐
                            │novo access   │
                            │token         │
                            └──────────────┘
```

---

## 📱 FLUXO DE CRIAÇÃO DE POST

```
┌─────────────────────────────────┐
│  FRONTEND (CreatePost.jsx)      │
│  - User escreve conteúdo        │
│  - Escolhe categoria            │
│  - Faz upload de imagem         │
└────────────┬────────────────────┘
             │
             ▼
      ┌────────────────┐
      │ Validação      │
      │ Local          │
      └────────┬───────┘
               │
               ▼
    ┌──────────────────────────┐
    │ POST /api/posts/         │
    │ multipart/form-data      │
    └────────────┬─────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │ Backend - PostViewSet       │
    │ - create()                 │
    │ - Validar permissões       │
    │ - Validar serializer       │
    └────────────┬───────────────┘
                 │
     ┌───────────┴────────────┐
     │                        │
     ▼                        ▼
┌────────────┐        ┌──────────────┐
│ Imagem OK  │        │ Erro         │
│ Salvar BD  │        │ Retornar 400 │
└─────┬──────┘        └──────────────┘
      │
      ▼
┌──────────────────┐
│ Criar Signal     │
│ post_created()   │
└─────┬────────────┘
      │
      ├─────────────────────┐
      │                     │
      ▼                     ▼
┌────────────┐      ┌─────────────────┐
│Notificação │      │Atualizar stats  │
│aos followers│     │(posts_count)   │
└────────────┘      └─────────────────┘
      │
      ▼
┌──────────────────┐
│ Resposta (201)   │
│ Post completo    │
│ com IDs          │
└──────────────────┘
      │
      ▼
┌──────────────────┐
│ FRONTEND         │
│ - Cache update   │
│ - Toast success  │
│ - Redir dashboard│
└──────────────────┘
```

---

## 🎬 FLUXO DE UPLOAD E REPRODUÇÃO DE REEL

```
┌─────────────────────────────────┐
│ FRONTEND (ReelUpload.jsx)       │
│ - Seleciona vídeo (< 100MB)     │
│ - Define descrição/categoria    │
└────────────┬────────────────────┘
             │
             ▼
    ┌──────────────────────┐
    │ Validações Local:    │
    │ - Formato           │
    │ - Tamanho           │
    │ - Duração (< 60s)   │
    └────────────┬─────────┘
                 │
                 ▼
    ┌──────────────────────────┐
    │ POST /api/reels/upload/  │
    │ multipart/form-data      │
    └────────────┬─────────────┘
                 │
                 ▼
    ┌──────────────────────────┐
    │ Backend - ReelViewSet    │
    │ - upload()               │
    │ - Salvar metadados       │
    └────────────┬─────────────┘
                 │
                 ▼
    ┌────────────────────────┐
    │ Celery Task (Async):   │  ← Futuro
    │ - FFmpeg Process       │
    │ - Generate Thumbnail   │
    │ - Compress Video       │
    │ - Multi-bitrate        │
    └────────────┬───────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ▼                         ▼
 ┌─────────────┐     ┌──────────────┐
 │Salvar no S3 │     │Update BD     │
 │(storage)    │     │status=pending│
 └─────────────┘     └──────────────┘
         │                   │
         └───────────┬───────┘
                     │
                     ▼
          ┌──────────────────────┐
          │ Moderação (Celery):  │  ← Futuro
          │ - Análise IA         │
          │ - Detecção conteúdo  │
          └──────────┬───────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
    ┌─────▼────┐        ┌──────▼──────┐
    │ Aprovado │        │   Rejeitado │
    │status=OK │        │status=denied│
    └─────┬────┘        └─────────────┘
          │
          ▼
┌─────────────────────┐
│ GET /api/reels/feed/│
│ (Reel em feed)      │
└────────────┬────────┘
             │
             ▼
    ┌──────────────────┐
    │FRONTEND ReelCard │
    │- Download vídeo  │
    │- ReelPlayer.jsx  │
    └────────────┬─────┘
                 │
                 ▼
    ┌──────────────────────┐
    │ Reprodução:          │
    │ - Video element      │
    │ - Controls           │
    │ - Like/Comment/Save  │
    └────────────┬─────────┘
                 │
                 ▼
    ┌──────────────────────┐
    │ POST /api/reels/     │
    │      {reel_id}/view/ │
    │ Rastrear visualização│
    └──────────────────────┘
```

---

## 💬 FLUXO DE MENSAGENS

```
┌──────────────────────────┐
│ FRONTEND (Messages.jsx)  │
│ - Lista conversas        │
└────────────┬─────────────┘
             │
             ▼
   ┌────────────────────────┐
   │ GET /api/messages/     │
   │ (?page=1)              │
   └────────────┬───────────┘
                │
                ▼
    ┌──────────────────────────┐
    │ Backend - Retorna:       │
    │ - Conversas             │
    │ - Último msg            │
    │ - Unread count          │
    │ - Participants          │
    └────────────┬─────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │ User clica em conversa     │
    └────────────┬───────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │ GET /api/messages/         │
    │     {conversation_id}/     │
    │ (?page=1)                  │
    └────────────┬───────────────┘
                 │
                 ▼
    ┌──────────────────────────────┐
    │ Backend - Carrega:           │
    │ - Mensagens (paginadas)     │
    │ - Metadados                 │
    │ - Status lido               │
    └────────────┬────────────────┘
                 │
    ┌────────────┴────────────────────────┐
    │                                     │
    ▼                                     ▼
┌─────────────────────┐        ┌──────────────────┐
│ Renderizar msgs     │        │ PUT mark_as_read │
│ Scroll to bottom    │        │ (auto)           │
└──────────┬──────────┘        └──────────────────┘
           │
           ▼
    ┌──────────────────┐
    │ User digita msg  │
    └────────┬─────────┘
             │
             ▼
    ┌────────────────────────────────┐
    │ WebSocket (Futuro):            │
    │ { action: "typing", ... }      │
    │ Mostrar "X está a digitar..."  │
    └────────────┬───────────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │ User pressiona Enter       │
    └────────────┬───────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │ POST /api/messages/        │
    │      {conv_id}/send/       │
    │ { content: "..." }         │
    └────────────┬───────────────┘
                 │
                 ▼
    ┌──────────────────────────────┐
    │ Backend - Salvar em BD       │
    │ - Message created            │
    │ - Trigger Signal             │
    └────────────┬─────────────────┘
                 │
     ┌───────────┴───────────┐
     │                       │
     ▼                       ▼
┌──────────────┐    ┌─────────────────┐
│Notificação   │    │WebSocket push   │
│ao receptor   │    │ao receptor      │
└──────────────┘    └────────┬────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │Receiver recebe   │
                    │mensagem em tempo │
                    │real (futuro)     │
                    └──────────────────┘
```

---

## 🔗 FLUXO DE CONEXÕES

```
┌──────────────────────────┐
│ FRONTEND (Explore.jsx)   │
│ - Vê perfil outro user   │
└────────────┬─────────────┘
             │
             ▼
    ┌──────────────────┐
    │ Check status:    │
    │ isConnected()    │
    └────────────┬─────┘
                 │
    ┌────────────┴─────────────┐
    │                          │
    ▼                          ▼
┌──────────────┐      ┌───────────────┐
│ Conectado    │      │ Não conectado │
│ Show "Remove"│      │ Show "Connect"│
└──────────────┘      └───────┬───────┘
                              │
                              ▼
                    ┌──────────────────────┐
                    │ POST /api/connections│
                    │ { target_user_id: X }│
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Backend - Create     │
                    │ Connection obj       │
                    │ status: "pending"    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌────────────────────────┐
                    │ Signal: new_request    │
                    │ Notificação ao target  │
                    └──────────┬─────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Notification badge   │
                    │ no app do target     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Target user vê       │
                    │ "Accept" / "Reject"  │
                    └──────────┬───────────┘
                               │
    ┌──────────────────────────┴──────────────────────────┐
    │                                                     │
    ▼                                                     ▼
┌─────────────────────────┐              ┌──────────────────────────┐
│ POST /connections/      │              │ POST /connections/       │
│      {id}/accept/       │              │      {id}/reject/        │
│                         │              │                          │
├─────────────────────────┤              ├──────────────────────────┤
│ - Update status         │              │ - Update status: rejected│
│ - Create followers rel  │              │ - Delete connection      │
│ - Increment counts      │              │                          │
│ - Send notification     │              │ - Notify requester       │
└─────────┬───────────────┘              └──────────┬───────────────┘
          │                                         │
          ▼                                         ▼
┌──────────────────────┐            ┌────────────────────────┐
│ GET /api/connections │            │ Ambos notificados      │
│ Status: accepted     │            │ Rejeição confirmada    │
│ Agora são conectados │            │                        │
└──────────────────────┘            └────────────────────────┘
```

---

## 🔔 FLUXO DE NOTIFICAÇÕES

```
┌───────────────────────────────────────┐
│ Evento (Like, Comment, Connection)    │
└────────────┬────────────────────────────┘
             │
             ▼
    ┌─────────────────────┐
    │ Django Signal       │
    │ post_liked.send()   │
    └────────────┬────────┘
                 │
                 ▼
    ┌───────────────────────────────────┐
    │ Signal Handler:                   │
    │ - Criar Notification obj          │
    │ - Salvar em BD                    │
    │ - type: "like_post"               │
    │ - actor: user que fez a ação     │
    │ - recipient: dono do post        │
    └────────────┬────────────────────────┘
                 │
    ┌────────────┴─────────────┐
    │                          │
    ▼                          ▼
┌──────────────────┐   ┌─────────────────┐
│ DB Saved         │   │ WebSocket push  │  ← Futuro
│ notification     │   │ (real-time)     │
└────────┬─────────┘   └─────────────────┘
         │
         ▼
    ┌──────────────────────────────┐
    │ GET /api/notifications/      │
    │ (?unread=true)               │
    └────────────┬─────────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │ FRONTEND (Notifications)   │
    │ - Badge no ícone           │
    │ - Abrir página            │
    │ - Listar notificações      │
    └────────────┬───────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │ PUT /api/notifications/    │
    │     {id}/read/             │
    │                            │
    │ Marca como lida            │
    └────────────────────────────┘
```

---

## 🔍 FLUXO DE PESQUISA

```
┌─────────────────────────────┐
│ FRONTEND (Search bar)       │
│ User digita: "python"       │
└────────────┬────────────────┘
             │
             ▼
    ┌──────────────────────────┐
    │ Debounce (300ms)         │
    └────────────┬─────────────┘
                 │
                 ▼
    ┌──────────────────────────────┐
    │ GET /api/search/suggestions/ │
    │ ?q=python                    │
    └────────────┬─────────────────┘
                 │
                 ▼
    ┌──────────────────────────────────┐
    │ Backend (ElasticSearch):         │  ← Futuro
    │ - Search em índices             │
    │ - Retornar top 10 sugestões    │
    └────────────┬────────────────────┘
                 │
                 ▼
    ┌──────────────────────────────┐
    │ FRONTEND - Dropdown          │
    │ - Usuários                   │
    │ - Tags                       │
    │ - Posts recentes             │
    └────────────┬─────────────────┘
                 │
                 ▼
    ┌──────────────────────────────┐
    │ User clica resultado         │
    └────────────┬─────────────────┘
                 │
                 ▼
    ┌──────────────────────────────┐
    │ GET /api/search/             │
    │ ?q=python&type=all           │
    │ (?page=1)                    │
    └────────────┬─────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ▼                         ▼
┌───────────────┐    ┌────────────────┐
│ Pesquisa      │    │ Full-text      │
│ Estruturada   │    │ Search         │
│ (PostgreSQL   │    │ (ElasticSearch)│
│  LIKE/iLIKE)  │    │ (futuro)       │
└───────┬───────┘    └────────────────┘
        │
        ▼
┌───────────────────────┐
│ Resultados:           │
│ - Users (5)           │
│ - Posts (10)          │
│ - Reels (8)           │
│ - Tags (3)            │
└───────────────────────┘
```

---

## 📊 FLUXO DE ANALYTICS (Futuro)

```
┌─────────────────────────────────┐
│ Evento de Interação             │
│ - View reel                     │
│ - Like post                     │
│ - Click link                    │
└────────────┬────────────────────┘
             │
             ▼
    ┌──────────────────────┐
    │ POST /api/analytics/ │
    │ { event_type, ... }  │
    └────────────┬─────────┘
                 │
                 ▼
    ┌──────────────────────────┐
    │ Celery Task              │
    │ (Background processing)  │
    └────────────┬─────────────┘
                 │
                 ▼
    ┌──────────────────────────┐
    │ Salvar em DB/ClickHouse  │
    │ Analytics table          │
    └────────────┬─────────────┘
                 │
                 ▼
    ┌──────────────────────────┐
    │ Dashboard criador:       │
    │ GET /api/analytics/      │
    │     creator/             │
    └────────────┬─────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │ Retorna:                   │
    │ - Total engagement         │
    │ - Top posts/reels          │
    │ - Audiência demographics   │
    │ - Growth trends            │
    │ - Revenue (futuro)         │
    └────────────────────────────┘
```

---

## 🌐 ESTRUTURA DE ENDPOINTS POR MÓDULO

```
/api/
├── auth/
│   ├── token/                    [POST] - Login
│   ├── token/refresh/            [POST] - Refresh
│   └── logout/                   [POST] - Logout (futuro)
│
├── users/
│   ├── me/                       [GET]  - Current user
│   ├── register/                 [POST] - Register
│   ├── {id}/public_profile/      [GET]  - Public profile
│   ├── update_profile/           [PUT]  - Update profile
│   ├── change_password/          [POST] - Change password
│   ├── forgot_password/          [POST] - Forgot password
│   ├── reset_password/           [POST] - Reset password
│   ├── verify_email/             [POST] - Verify email
│   ├── verify_university/        [POST] - Verify university
│   ├── universities/             [GET]  - List universities
│   └── portfolio/                [CRUD] - Portfolio items
│
├── posts/
│   ├── /                         [CRUD] - Posts
│   ├── feed/                     [GET]  - Feed
│   ├── saved/                    [GET]  - Saved posts
│   ├── search/                   [GET]  - Search posts
│   ├── {id}/like/                [POST] - Like
│   ├── {id}/unlike/              [POST] - Unlike
│   ├── {id}/save/                [POST] - Save
│   ├── {id}/unsave/              [POST] - Unsave
│   ├── {id}/comment/             [POST] - Add comment
│   ├── {id}/comments/            [GET]  - Get comments
│   └── {id}/comments/{cid}/      [DEL]  - Delete comment
│
├── reels/
│   ├── /                         [CRUD] - Reels
│   ├── feed/                     [GET]  - Feed
│   ├── trending/                 [GET]  - Trending
│   ├── search/                   [GET]  - Search
│   ├── categories/               [GET]  - Categories
│   ├── {id}/like/                [POST] - Like
│   ├── {id}/unlike/              [POST] - Unlike
│   ├── {id}/save/                [POST] - Save
│   ├── {id}/unsave/              [POST] - Unsave
│   ├── {id}/comment/             [POST] - Comment
│   ├── {id}/view/                [POST] - Track view
│   ├── {id}/report/              [POST] - Report
│   └── upload/                   [POST] - Upload
│
├── messages/
│   ├── /                         [GET]  - List conversations
│   ├── create/                   [POST] - Create conversation
│   ├── {id}/                     [GET]  - Get messages
│   ├── {id}/send/                [POST] - Send message
│   ├── {id}/mark_as_read/        [PUT]  - Mark as read
│   ├── {id}/leave/               [POST] - Leave group
│   ├── {id}/add_member/          [POST] - Add member
│   ├── {msg_id}/react/           [POST] - React
│   └── groups/create/            [POST] - Create group
│
├── connections/
│   ├── /                         [CRUD] - Connections
│   ├── suggestions/              [GET]  - Suggestions
│   ├── {id}/accept/              [POST] - Accept
│   ├── {id}/reject/              [POST] - Reject
│   ├── block/                    [POST] - Block user
│   ├── unblock/                  [POST] - Unblock
│   └── blocked/                  [GET]  - Blocked list
│
├── notifications/
│   ├── /                         [GET]  - List notifications
│   ├── unread_count/             [GET]  - Unread count
│   ├── {id}/read/                [PUT]  - Mark read
│   ├── mark_all_as_read/         [POST] - Mark all read
│   ├── {id}/                     [DEL]  - Delete
│   └── preferences/              [CRUD] - Preferences
│
├── search/
│   ├── /                         [GET]  - Global search
│   ├── users/                    [GET]  - Search users
│   ├── posts/                    [GET]  - Search posts
│   ├── reels/                    [GET]  - Search reels
│   ├── trending_tags/            [GET]  - Trending tags
│   └── suggestions/              [GET]  - Suggestions
│
├── moderation/
│   ├── reports/posts/            [CRUD] - Report post
│   ├── reports/users/            [CRUD] - Report user
│   ├── reports/comments/         [CRUD] - Report comment
│   ├── reports/                  [GET]  - List reports (Admin)
│   └── reports/{id}/review/      [PUT]  - Review (Admin)
│
├── analytics/
│   ├── profile/{id}/             [GET]  - Profile stats
│   ├── posts/{id}/               [GET]  - Post stats
│   ├── reels/{id}/               [GET]  - Reel stats
│   └── creator/                  [GET]  - Creator dashboard
│
└── media/
    ├── upload/image/             [POST] - Upload image
    ├── upload/video/             [POST] - Upload video
    ├── upload/file/              [POST] - Upload file
    └── {id}/                     [DEL]  - Delete media

ws://
└── ws/chat/{conversation_id}/    [WS]  - WebSocket chat
```

---

## 📈 TABELA DE MÉTODOS HTTP

| Método | Uso | Exemplo |
|--------|-----|---------|
| GET | Obter recurso | GET /api/users/me/ |
| POST | Criar recurso | POST /api/posts/ |
| PUT | Atualizar completo | PUT /api/users/update_profile/ |
| PATCH | Atualizar parcial | PATCH /api/posts/{id}/ |
| DELETE | Deletar recurso | DELETE /api/posts/{id}/ |

---

## 🔐 PADRÕES DE SEGURANÇA

```
Todos os endpoints:
├── Autenticação obrigatória
│   └── Authorization: Bearer {token}
│
├── Permissões granulares
│   ├── IsAuthenticated
│   ├── IsOwner
│   └── IsAdmin
│
├── Validação de entrada
│   ├── Serializer validation
│   ├── Type checking
│   └── Size limits
│
├── Rate limiting
│   ├── Por IP
│   ├── Por utilizador
│   └── Por endpoint
│
└── Logging & Monitoring
    ├── Request/Response
    ├── Errors
    └── Performance
```

---

## 🎯 ESTATÍSTICAS FINAIS

- **Total Endpoints**: 91+
- **Implementados**: ~45 (50%)
- **Em Falta**: ~46 (50%)
- **Tempo Estimado**: 66-71 horas
- **Sprint**: 4-5 semanas

