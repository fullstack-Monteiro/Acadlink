# 📊 Relatório Técnico: Frontend & Backend - AcadLink

## 📅 Data: 18 de Agosto de 2026

---

## 🎯 Visão Geral do Projeto

**AcadLink** é uma plataforma de rede social acadêmica desenvolvida para conectar estudantes universitários, permitindo compartilhamento de conteúdo, mensagens, reels educativos e oportunidades de carreira.

### Stack Tecnológica

**Backend:** Django 5.0.1 + Django REST Framework  
**Frontend:** React 18.3.1 + Vite 5.4.2  
**Banco de Dados:** PostgreSQL / SQLite3 (dev)  
**Autenticação:** JWT (SimpleJWT)  
**Comunicação Real-time:** WebSockets (Channels + Daphne)

---

## 🔧 BACKEND - Análise Detalhada

### 📦 Arquitetura

O backend segue uma arquitetura modular baseada em **Django Apps**, com separação clara de responsabilidades:

```
backend/
├── config/              # Configurações principais
│   ├── settings/        # Settings modularizadas (base, dev, prod)
│   ├── urls.py          # Rotas principais
│   ├── asgi.py          # WebSocket support
│   └── wsgi.py          # HTTP server
└── apps/                # Aplicações modulares
    ├── users/           # Usuários e autenticação
    ├── posts/           # Posts e feed
    ├── reels/           # Vídeos curtos educativos
    ├── messages/        # Chat em tempo real
    ├── notifications/   # Sistema de notificações
    ├── connections/     # Conexões entre usuários
    └── moderation/      # Moderação de conteúdo
```

### 🗄️ Modelos de Dados (Database Schema)

#### **1. Users App**
- **University:** Universidades cadastradas com cursos disponíveis (JSON)
- **User:** Modelo customizado (AbstractUser) com campos:
  - Email único + verificação
  - Universidade + Curso + Ano
  - Verificação universitária
  - Rate limiting (tentativas de login)
- **Profile:** Avatar, cover, bio, estatísticas, privacidade
- **PortfolioItem:** Projetos e trabalhos dos estudantes

#### **2. Posts App**
- **Post:** Conteúdo textual + imagem, likes, comentários
- **PostLike:** Curtidas (unique_together: user + post)
- **Comment:** Comentários aninhados (reply_to)
- **CommentLike:** Curtidas em comentários
- **SavedPost:** Posts salvos por coleção

#### **3. Reels App**
- **ReelCategory:** Categorias pré-definidas (StudyTips, ProjectShowcase, etc.)
- **Reel:** Vídeos 15-90s + moderação + analytics
- **ReelLike/Comment/Save:** Interações
- **ReelView:** Tracking de visualizações (watch_time, completed)
- **ReelReport:** Sistema de denúncias

#### **4. Messages App** (WebSocket)
- **Conversation:** Conversas 1-on-1
- **Message:** Mensagens com leitura tracking
- **MessageRead:** Status de leitura

#### **5. Notifications App** (WebSocket)
- **Notification:** Notificações push em tempo real

#### **6. Connections App**
- **Connection:** Pedidos de conexão (pending/accepted/rejected)

### 🔐 Segurança Implementada

#### **Headers de Segurança Ativados:**
- ✅ **HSTS** (HTTP Strict Transport Security)
- ✅ **X-Frame-Options: DENY** (Anti-clickjacking)
- ✅ **X-Content-Type-Options: nosniff**
- ✅ **CSP** (Content Security Policy)
- ✅ **Referrer-Policy**
- ✅ **Permissions-Policy**

#### **Autenticação & Rate Limiting:**
- ✅ **JWT em HttpOnly Cookies** (mais seguro que localStorage)
- ✅ **Access Token:** 15 minutos
- ✅ **Refresh Token:** 7 dias (com rotação)
- ✅ **Django Axes:** Proteção contra brute-force (5 tentativas, 15min bloqueio)
- ✅ **Throttling:** 100 req/hora (anônimo), 1000 req/hora (autenticado)

#### **CORS Configurado:**
- Whitelist de origens permitidas
- Credenciais permitidas (cookies)
- Headers específicos autorizados

### 📡 APIs REST Implementadas

#### **Endpoints Principais:**

```
/api/auth/
  POST /token/              # Login (JWT)
  POST /token/refresh/      # Refresh token

/api/users/
  GET    /                  # Listar usuários
  POST   /register/         # Registro
  GET    /me/               # Usuário atual
  PUT    /update_profile/   # Atualizar perfil
  POST   /forgot_password/  # Recuperar senha
  POST   /reset_password/   # Resetar senha
  GET    /universities/     # Listar universidades
  GET/POST /portfolio/      # CRUD de portfólio

/api/posts/
  GET/POST /                # CRUD posts
  POST /{id}/like/          # Curtir
  POST /{id}/comment/       # Comentar
  POST /{id}/save/          # Salvar

/api/reels/
  GET/POST /                # CRUD reels
  POST /upload/             # Upload vídeo
  POST /{id}/like/          # Curtir
  POST /{id}/view/          # Registrar view
  GET  /trending/           # Trending reels
  GET  /analytics/{id}/     # Analytics

/api/messages/
  GET/POST /conversations/  # Conversas
  GET/POST /messages/       # Mensagens

/api/notifications/
  GET /                     # Notificações
  PUT /{id}/read/           # Marcar como lida

/api/connections/
  GET/POST /                # Conexões
  POST /send_request/       # Enviar pedido
  PUT  /{id}/accept/        # Aceitar
  DELETE /{id}/             # Remover
```

### 📦 Dependências Principais

```txt
Django==5.0.1
djangorestframework==3.14.0
djangorestframework-simplejwt==5.5.1
django-cors-headers==4.3.1
django-axes==6.1.1              # Brute-force protection
django-csp==3.7                 # Content Security Policy
channels==4.0.0                 # WebSockets
daphne==4.0.0                   # ASGI server
psycopg2-binary==2.9.9          # PostgreSQL
Pillow==10.1.0                  # Image processing
celery==5.3.4                   # Task queue (opcional)
redis==5.0.1                    # Cache/Celery backend
boto3==1.34.14                  # AWS S3 (opcional)
sentry-sdk==1.39.1              # Error tracking
gunicorn==21.2.0                # Production server
```

### 🚀 Configurações de Ambiente

**Suporte para:**
- ✅ SQLite3 (desenvolvimento rápido)
- ✅ PostgreSQL (produção)
- ✅ AWS S3 (storage de mídia - opcional)
- ✅ Redis (cache/Celery - opcional)
- ✅ Sentry (monitoramento - opcional)

### 📊 Status de Implementação Backend

| Feature | Status | Observações |
|---------|--------|-------------|
| Autenticação JWT | ✅ | HttpOnly cookies implementados |
| CRUD Usuários | ✅ | Completo com perfil |
| CRUD Posts | ✅ | Likes, comentários, salvos |
| CRUD Reels | ✅ | Upload, moderação, analytics |
| WebSocket Messages | ✅ | Tempo real implementado |
| WebSocket Notifications | ✅ | Push notifications |
| Conexões (Amigos) | ✅ | Sistema completo |
| Rate Limiting | ✅ | Axes + DRF Throttling |
| Moderação | 🟡 | Modelos criados, views pendentes |
| Celery Tasks | 🟡 | Configurado mas comentado |
| Email Verification | 🟡 | Campos no modelo, view pendente |
| Testes Unitários | ❌ | Não implementado |

---

## ⚛️ FRONTEND - Análise Detalhada

### 📦 Arquitetura

O frontend é uma **Single Page Application (SPA)** construída com React e Vite, seguindo padrões modernos:

```
frontend/
├── public/              # Assets estáticos
├── src/
│   ├── components/      # Componentes reutilizáveis
│   │   ├── auth/        # Login, registro
│   │   ├── feed/        # Posts, stories
│   │   ├── reels/       # Player de vídeo
│   │   ├── modals/      # Modais diversos
│   │   ├── profile/     # Componentes de perfil
│   │   ├── layout/      # Header, Sidebar, BottomNav
│   │   └── ui/          # Botões, cards, inputs
│   ├── pages/           # Páginas principais
│   ├── context/         # Context API (state global)
│   ├── hooks/           # Custom hooks
│   ├── services/        # Axios API client
│   ├── utils/           # Helpers e validators
│   └── data/            # Mock data
├── vite.config.js       # Configuração Vite
├── tailwind.config.js   # Tailwind CSS
└── package.json
```

### 🎨 Stack de UI/UX

- **React 18.3.1:** Componentes funcionais + Hooks
- **React Router DOM 6.26:** Navegação SPA
- **Tailwind CSS 3.4.11:** Utility-first styling
- **Lucide React 0.441:** Ícones modernos
- **Axios 1.16.0:** HTTP client com interceptors
- **Vite 5.4.2:** Build tool ultra-rápido

### 🎯 Context API - State Management

O projeto utiliza **React Context API** para gerenciamento de estado global:

#### **1. AuthContext**
- Login/Logout/Register
- Gerenciamento de usuário autenticado
- Conexões (amigos)
- Portfólio
- Refresh token automático

#### **2. PostsContext**
- Feed de posts
- Like/Comment/Save
- Criar/Editar posts

#### **3. ReelsContext**
- Feed de reels
- Upload de vídeos
- Interações (like, view tracking)
- Trending/Search

#### **4. MessagesContext**
- Conversas em tempo real
- WebSocket connection
- Unread count

#### **5. NotificationsContext**
- Notificações push
- WebSocket connection
- Badge count

#### **6. ThemeContext**
- Dark/Light mode
- Preferências visuais

### 🔌 Serviço de API (api.js)

```javascript
// Features implementadas:
✅ Axios instance configurada
✅ JWT Bearer token automático
✅ Refresh token interceptor (401 auto-retry)
✅ Timeout 10s
✅ Redirect automático para /login em erro
```

### 📱 Páginas Implementadas

| Página | Rota | Status | Features |
|--------|------|--------|----------|
| Landing | `/` | ✅ | Página inicial |
| Welcome | `/welcome` | ✅ | Onboarding |
| Login | `/login` | ✅ | Autenticação JWT |
| Register | `/register` | ✅ | Registro com validação |
| Reset Password | `/reset-password` | ✅ | Recuperação de senha |
| Dashboard | `/dashboard` | ✅ | Feed principal + stories |
| Profile | `/profile` | ✅ | Perfil do usuário |
| Public Profile | `/profile/:id` | ✅ | Perfil de outros usuários |
| Create Post | `/create-post` | ✅ | Criar post |
| Create Story | `/create-story` | ✅ | Criar story |
| Messages | `/messages` | ✅ | Chat em tempo real |
| Notifications | `/notifications` | ✅ | Notificações |
| Explore | `/explore` | ✅ | Descobrir conteúdo |
| Groups | `/groups` | ✅ | Grupos acadêmicos |
| Opportunities | `/opportunities` | ✅ | Vagas e oportunidades |
| Library | `/library` | ✅ | Biblioteca de recursos |
| Saved | `/saved` | ✅ | Conteúdo salvo |
| Settings | `/settings` | ✅ | Configurações |
| Reels Feed | `/reels` | ✅ | Feed de vídeos curtos |
| Reels Search | `/reels/search` | ✅ | Buscar reels |
| Reels Trending | `/reels/trending` | ✅ | Trending reels |
| Reel Analytics | `/reels/analytics/:id` | ✅ | Métricas de reel |

### 🎣 Custom Hooks Desenvolvidos

```javascript
useApiError.js         // Tratamento de erros da API
useFileUpload.js       // Upload de arquivos (imagens/vídeos)
useLoginAttempts.js    // Rate limiting no frontend
usePullToRefresh.js    // Pull-to-refresh mobile
useReelPlayer.js       // Player de vídeo com analytics
useReelUpload.js       // Upload de reels com validação
useRegisterForm.js     // Form de registro com validação
useScrollAnimation.js  // Animações em scroll
useSwipeGesture.js     // Gestos mobile (swipe)
```

### 🛡️ Segurança Frontend

#### **Implementado:**
- ✅ JWT em localStorage (com refresh automático)
- ✅ Security headers em dev (vite.config.js)
- ✅ Validação de inputs
- ✅ Rate limiting visual (login attempts)
- ✅ XSS protection (React escaping)

#### **Observações:**
- 🔴 **CRÍTICO:** JWT está em `localStorage` (vulnerável a XSS)
- 💡 **Recomendação:** Migrar para HttpOnly cookies (backend já suporta)

### 🎨 Componentes UI Principais

**Layout:**
- Header (desktop)
- Sidebar (desktop)
- BottomNav (mobile)
- MobileHeader

**Feed:**
- PostCard
- StoryRing
- ReelCard
- CommentSection

**Modals:**
- CreatePostModal
- CreateGroupModal
- UploadDocumentModal
- ChangeEmailModal
- UploadReelModal

**Profile:**
- ProfileHeader
- ProfileTabs
- PortfolioItem
- ConnectionCard

### 📊 Status de Implementação Frontend

| Feature | Status | Observações |
|---------|--------|-------------|
| Autenticação JWT | ✅ | Com refresh automático |
| Feed de Posts | ✅ | Like, comentar, salvar |
| Feed de Reels | ✅ | Player completo + analytics |
| Chat em Tempo Real | ✅ | WebSocket implementado |
| Notificações Push | ✅ | WebSocket implementado |
| Upload de Mídia | ✅ | Imagens e vídeos |
| Perfil Completo | ✅ | Avatar, bio, portfólio |
| Conexões (Amigos) | ✅ | Enviar/aceitar/remover |
| Dark Mode | ✅ | ThemeContext |
| Responsive Design | ✅ | Mobile-first Tailwind |
| PWA | ❌ | Não implementado |
| Testes | ❌ | Não implementado |
| i18n | ❌ | Apenas PT-BR |

---

## 🔄 Integração Frontend ↔ Backend

### ✅ Endpoints Conectados

```javascript
// AuthContext
POST /api/users/login/
POST /api/users/register/
GET  /api/users/me/
PUT  /api/users/update_profile/
POST /api/users/forgot_password/
POST /api/users/reset_password/
GET  /api/connections/
POST /api/connections/send_request/
GET  /api/users/portfolio/

// PostsContext
GET  /api/posts/
POST /api/posts/
POST /api/posts/{id}/like/
POST /api/posts/{id}/comment/

// ReelsContext
GET  /api/reels/
POST /api/reels/upload/
POST /api/reels/{id}/like/
POST /api/reels/{id}/view/
GET  /api/reels/trending/

// MessagesContext
WebSocket: ws://localhost:8000/ws/messages/

// NotificationsContext
WebSocket: ws://localhost:8000/ws/notifications/
```

### 🔌 Configuração de Ambiente

**Backend (.env):**
```bash
DJANGO_SETTINGS_MODULE=config.settings.development
SECRET_KEY=django-insecure-dev-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
DB_ENGINE=django.db.backends.sqlite3
```

**Frontend (.env):**
```bash
VITE_API_URL=http://localhost:8000/api
VITE_APP_ENV=development
VITE_DEBUG_MODE=false
```

---

## 🚀 Como Executar o Projeto

### Backend

```bash
cd backend

# Instalação rápida (SQLite)
./install-quick.bat    # Windows
./install-quick.sh     # Linux/Mac

# Rodar servidor
./run-quick.bat        # Windows
./run-quick.sh         # Linux/Mac

# Ou manualmente
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements/minimal.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**URLs:**
- API: http://localhost:8000/api/
- Admin: http://localhost:8000/admin/

### Frontend

```bash
cd frontend

npm install
npm run dev

# Ou com Chrome automático
npm run dev:chrome
```

**URL:** http://localhost:3000

---

## 📈 Métricas do Projeto

### Tamanho do Código

**Backend:**
- 6 apps Django
- ~25 modelos de dados
- ~50+ endpoints REST
- 2 WebSocket consumers

**Frontend:**
- ~20 páginas
- ~50+ componentes
- 6 contexts
- 9 custom hooks

### Dependências

**Backend:** 20 pacotes principais
**Frontend:** 13 pacotes principais

---

## 🐛 Problemas Conhecidos

### Backend
1. ❌ **Testes unitários ausentes**
2. 🟡 **Celery desativado** (comentado para dev rápido)
3. 🟡 **Email verification não implementado** (campos existem)
4. 🟡 **Moderation app incompleto** (modelos existem, views não)

### Frontend
1. 🔴 **JWT em localStorage** (vulnerável a XSS)
2. ❌ **Testes ausentes** (unit + e2e)
3. ❌ **PWA não configurado**
4. 🟡 **Autenticação desativada em App.jsx** (permitindo acesso sem login)

---

## 🎯 Recomendações de Melhorias

### Alta Prioridade 🔴
1. **Migrar JWT para HttpOnly cookies** (backend já suporta)
2. **Ativar autenticação nas rotas** (está desativada)
3. **Implementar testes unitários** (backend + frontend)
4. **Adicionar logging estruturado** (sentry já configurado)

### Média Prioridade 🟡
1. **Implementar email verification**
2. **Ativar Celery para tasks assíncronas**
3. **Adicionar testes e2e** (Playwright/Cypress)
4. **Implementar PWA** (offline support)
5. **i18n** (suporte multi-idiomas)

### Baixa Prioridade 🟢
1. **Migrar para TypeScript** (type safety)
2. **Adicionar Storybook** (component library)
3. **Implementar CI/CD**
4. **Docker Compose** para dev environment

---

## 📝 Conclusão

O projeto **AcadLink** está em um estágio **avançado de desenvolvimento**, com:

✅ **Backend robusto:** API REST completa, WebSockets, segurança implementada  
✅ **Frontend funcional:** UI/UX completa, responsive, contexts organizados  
✅ **Integração funcionando:** Frontend ↔ Backend conectados  

### Próximos Passos:
1. Corrigir problemas críticos de segurança (JWT em cookies)
2. Implementar testes
3. Deploy em staging
4. Testes de usuário (beta)

---

**Relatório gerado em:** 18 de Agosto de 2026  
**Versão do Projeto:** 0.1.0
