# APIs Necessárias - AcadLink

## 1. AUTENTICAÇÃO (Auth)

### Login
- **POST** `/api/auth/token/`
- Body: `{ email, password }`
- Response: `{ access, refresh }`

### Refresh Token
- **POST** `/api/auth/token/refresh/`
- Body: `{ refresh }`
- Response: `{ access }`

### Forgot Password (TODO)
- **POST** `/api/auth/forgot-password/`
- Body: `{ email }`

### Reset Password (TODO)
- **POST** `/api/auth/reset-password/`
- Body: `{ email, code, new_password }`

---

## 2. USUÁRIOS (Users)

### Registrar Novo Usuário
- **POST** `/api/users/register/`
- Body: `{ email, password, first_name, last_name, university, course, year }`
- Response: `{ access_token, refresh_token, user_data }`

### Obter Perfil Atual
- **GET** `/api/users/me/`
- Response: `{ id, email, first_name, last_name, university, course, year, ... }`

### Atualizar Perfil
- **PUT** `/api/users/update_profile/`
- Body: `{ first_name, last_name, bio, avatar, cover, ... }`
- Response: `{ updated_user_data }`

### Obter Universidades
- **GET** `/api/users/universities/`
- Response: `{ results: [{ id, name, acronym, country, courses: [...] }, ...] }`

### Portfolio - Listar
- **GET** `/api/users/portfolio/`
- Response: `[{ id, title, description, url, image }, ...]`

### Portfolio - Criar
- **POST** `/api/users/portfolio/`
- Body: `{ title, description, url, image }`
- Response: `{ id, title, description, url, image }`

### Portfolio - Atualizar
- **PUT** `/api/users/portfolio/{id}/`
- Body: `{ title, description, url, image }`
- Response: `{ id, title, description, url, image }`

### Portfolio - Deletar
- **DELETE** `/api/users/portfolio/{id}/`

---

## 3. CONEXÕES (Connections)

### Listar Conexões
- **GET** `/api/connections/`
- Response: `[{ id, user, status }, ...]`

### Enviar Pedido de Conexão
- **POST** `/api/connections/send_request/`
- Body: `{ to_user_id }`
- Response: `{ id, status, ... }`

---

## 4. POSTS (Feed)

### Listar Posts (Feed)
- **GET** `/api/posts/feed/?page=1`
- Response: `{ results: [{ id, content, image, likes_count, comments_count, ... }, ...], next, previous }`

### Criar Post
- **POST** `/api/posts/`
- Body: FormData `{ content, image }`
- Response: `{ id, content, image, created_at, ... }`

### Curtir Post
- **POST** `/api/posts/{id}/like/`

### Descurtir Post
- **POST** `/api/posts/{id}/unlike/`

### Salvar Post
- **POST** `/api/posts/{id}/save/`

### Remover Post Salvo
- **POST** `/api/posts/{id}/unsave/`

### Comentar em Post
- **POST** `/api/posts/{id}/comment/`
- Body: `{ content }`
- Response: `{ id, content, author, created_at, ... }`

### Listar Posts Salvos
- **GET** `/api/posts/saved/`
- Response: `{ results: [{ id, content, image, ... }, ...] }`

---

## 5. REELS (Vídeos)

### Listar Categorias
- **GET** `/api/reels/categories/`
- Response: `[{ id, name }, ...]`

### Listar Reels (Feed)
- **GET** `/api/reels/feed/?page=1&category=id`
- Response: `{ results: [{ id, video, title, likes_count, ... }, ...], next, previous }`

### Upload Reel
- **POST** `/api/reels/upload/`
- Body: FormData `{ video, thumbnail, title, description, duration, category }`
- Response: `{ id, video, thumbnail, title, ... }`

### Curtir Reel
- **POST** `/api/reels/{id}/like/`

### Descurtir Reel
- **POST** `/api/reels/{id}/unlike/`

### Comentar em Reel
- **POST** `/api/reels/{id}/comment/`
- Body: `{ content }`
- Response: `{ id, content, author, created_at, ... }`

### Salvar Reel
- **POST** `/api/reels/{id}/save/`

### Remover Reel Salvo
- **POST** `/api/reels/{id}/unsave/`

### Rastrear Visualização
- **POST** `/api/reels/{id}/view/`
- Body: `{ watch_time, completed }`

### Reportar Reel
- **POST** `/api/reels/{id}/report/`
- Body: `{ reason, description }`

### Listar Reels em Tendência
- **GET** `/api/reels/trending/`
- Response: `{ results: [{ id, video, title, ... }, ...] }`

---

## 6. NOTIFICAÇÕES (Notifications)

### Listar Notificações
- **GET** `/api/notifications/`
- Response: `[{ id, type, message, is_read, created_at }, ...]`

### Marcar como Lida
- **POST** `/api/notifications/{id}/mark_as_read/`

### Marcar Todas como Lidas
- **POST** `/api/notifications/mark_all_as_read/`

### Deletar Notificação
- **DELETE** `/api/notifications/{id}/`

---

## 7. MENSAGENS (Messages)

### Listar Conversas
- **GET** `/api/messages/`
- Response: `[{ id, participants, last_message, unread }, ...]`

### Criar Conversa
- **POST** `/api/messages/`
- Body: `{ participants: [user_id] }`
- Response: `{ id, participants, ... }`

### Enviar Mensagem
- **POST** `/api/messages/{conversation_id}/send_message/`
- Body: `{ content }`
- Response: `{ id, content, author, created_at, ... }`

### Marcar Conversa como Lida
- **POST** `/api/messages/{conversation_id}/mark_read/`

### Deletar Mensagem
- **DELETE** `/api/messages/{conversation_id}/messages/{message_id}/`

---

## RESUMO DE STATUS

### ✅ Implementadas
- Autenticação (Login, Refresh Token)
- Usuários (Register, Me, Update Profile, Universities)
- Posts (CRUD, Like, Unlike, Save, Comment)
- Reels (Upload, Like, Unlike, Comment, Save, View, Report, Trending)
- Notificações (List, Mark as Read, Delete)
- Mensagens (List, Send, Mark Read, Delete)
- Conexões (List, Send Request)
- Portfolio (CRUD)

### ⏳ TODO
- Forgot Password
- Reset Password
- Mais funcionalidades de conexões (Accept, Reject, Remove)
- Busca de usuários
- Perfil público de usuários
