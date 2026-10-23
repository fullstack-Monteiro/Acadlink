# 🗺️ Organização de Rotas do AcadLink

## Estrutura de Rotas

O AcadLink está organizado em rotas por módulo/funcionalidade, seguindo o padrão RESTful. Todas as rotas estão prefixadas com `/api/`.

---

## 📋 Rotas por Módulo

### 1. **Authentication** `/api/auth/`
Autenticação e gerenciamento de tokens JWT.

```
POST   /api/auth/token/              - Obter token (Login)
POST   /api/auth/token/refresh/      - Renovar token
```

---

### 2. **Users** `/api/users/`
Gerenciamento de usuários e perfis.

```
GET    /api/users/                   - Listar todos os usuários
POST   /api/users/                   - Criar novo usuário (registro)
GET    /api/users/{id}/              - Detalhes de um usuário
PATCH  /api/users/{id}/              - Atualizar perfil do usuário
DELETE /api/users/{id}/              - Deletar usuário
GET    /api/users/{id}/portfolio/    - Portfolio do usuário
```

---

### 3. **Universities** `/api/users/universities/`
Gerenciamento e listagem de universidades.

```
GET    /api/users/universities/                 - Listar universidades
GET    /api/users/universities/{id}/            - Detalhes de universidade
```

---

### 4. **Portfolio** `/api/users/portfolio/`
Gestão de portfólio de usuários.

```
GET    /api/users/portfolio/                    - Listar portfólios
POST   /api/users/portfolio/                    - Criar portfólio
GET    /api/users/portfolio/{id}/               - Detalhes do portfólio
PATCH  /api/users/portfolio/{id}/               - Atualizar portfólio
DELETE /api/users/portfolio/{id}/               - Deletar portfólio
```

---

### 5. **Posts** `/api/posts/`
Criação e gerenciamento de publicações.

```
GET    /api/posts/                   - Listar posts (feed)
POST   /api/posts/                   - Criar novo post
GET    /api/posts/{id}/              - Detalhes de um post
PATCH  /api/posts/{id}/              - Atualizar post
DELETE /api/posts/{id}/              - Deletar post
POST   /api/posts/{id}/like/         - Dar like em um post
DELETE /api/posts/{id}/like/         - Remover like
POST   /api/posts/{id}/comment/      - Adicionar comentário
GET    /api/posts/{id}/comments/     - Listar comentários
```

---

### 6. **Reels** `/api/reels/`
Conteúdo de vídeos curtos (estilo TikTok/Shorts).

```
GET    /api/reels/                   - Listar reels (feed)
POST   /api/reels/                   - Criar novo reel
GET    /api/reels/{id}/              - Detalhes de um reel
PATCH  /api/reels/{id}/              - Atualizar reel
DELETE /api/reels/{id}/              - Deletar reel
GET    /api/reels/categories/        - Listar categorias de reels
POST   /api/reels/{id}/like/         - Dar like em um reel
DELETE /api/reels/{id}/like/         - Remover like
```

---

### 7. **Connections** `/api/connections/`
Relacionamentos e conexões entre usuários (follow/unfollow).

```
GET    /api/connections/             - Listar conexões do usuário
POST   /api/connections/             - Adicionar nova conexão (follow)
DELETE /api/connections/{id}/        - Remover conexão (unfollow)
GET    /api/connections/followers/   - Listar seguidores
GET    /api/connections/following/   - Listar seguindo
```

---

### 8. **Messages** `/api/messages/`
Sistema de mensagens e chat.

```
GET    /api/messages/                - Listar conversas do usuário
POST   /api/messages/                - Criar nova conversa
GET    /api/messages/{id}/           - Detalhes de conversa
POST   /api/messages/{id}/send/      - Enviar mensagem
DELETE /api/messages/{id}/           - Deletar conversa
GET    /api/messages/{id}/history/   - Histórico de mensagens
```

---

### 9. **Notifications** `/api/notifications/`
Notificações do sistema.

```
GET    /api/notifications/           - Listar notificações do usuário
GET    /api/notifications/unread/    - Listar não lidas
PATCH  /api/notifications/{id}/      - Marcar como lida
DELETE /api/notifications/{id}/      - Deletar notificação
PATCH  /api/notifications/mark-read/ - Marcar todas como lidas
```

---

### 10. **Moderation** `/api/moderation/`
Moderação e relatório de conteúdo.

```
POST   /api/moderation/report/       - Reportar conteúdo
GET    /api/moderation/reports/      - Listar reports (admin)
PATCH  /api/moderation/reports/{id}/ - Atualize status do report
```

---

## 📊 Resumo Estrutural

```
/api/
├── auth/
│   ├── token/
│   └── token/refresh/
├── users/
│   ├── (list, create, retrieve, update, delete)
│   ├── {id}/portfolio/
│   └── universities/
├── posts/
│   ├── (list, create, retrieve, update, delete)
│   ├── {id}/like/
│   └── {id}/comments/
├── reels/
│   ├── (list, create, retrieve, update, delete)
│   ├── {id}/like/
│   └── categories/
├── connections/
│   ├── (list, create, delete)
│   ├── followers/
│   └── following/
├── messages/
│   ├── (list, create, retrieve, delete)
│   ├── {id}/send/
│   └── {id}/history/
├── notifications/
│   ├── (list, retrieve, delete)
│   ├── unread/
│   └── mark-read/
└── moderation/
    ├── report/
    └── reports/
```

---

## 🔐 Autenticação

Todas as rotas (exceto `/api/auth/token/`) requerem:
- Header: `Authorization: Bearer <token_jwt>`

---

## 📝 Padrões de Resposta

### Sucesso (2xx)
```json
{
  "id": 1,
  "data": { ... }
}
```

### Erro (4xx/5xx)
```json
{
  "error": "Descrição do erro",
  "details": [ ... ]
}
```

---

## 🚀 Próximos Passos

1. ✅ Ativar todas as rotas em `backend/config/urls.py`
2. ✅ Implementar actions personalizadas nos ViewSets
3. ✅ Adicionar paginação e filtros
4. ✅ Implementar permissões e autorização
5. ✅ Criar testes para cada endpoint
