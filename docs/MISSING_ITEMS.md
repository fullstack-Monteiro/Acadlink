# ⚠️ O Que Ainda Falta

## 🔴 CRÍTICO (Bloqueia funcionamento)

### Backend
- [ ] **Arquivo `celery.py`** em `backend/config/`
  - Necessário para configurar Celery
  - Sem isso, tarefas assíncronas não funcionam

- [ ] **Arquivo `requirements.txt` faltando dependências**
  - Falta: `channels`, `channels-redis`, `daphne`
  - Necessários para WebSockets

- [ ] **Arquivo `.env` real**
  - Apenas `.env.example` foi criado
  - Precisa de valores reais para desenvolvimento

- [ ] **Migrations não foram criadas**
  - Precisa rodar: `python manage.py makemigrations`
  - Sem isso, banco de dados não tem tabelas

- [ ] **Arquivo `apps/posts/apps.py`** - Falta criar
- [ ] **Arquivo `apps/reels/apps.py`** - Falta criar
- [ ] **Arquivo `apps/messages/apps.py`** - Falta criar
- [ ] **Arquivo `apps/notifications/apps.py`** - Falta criar
- [ ] **Arquivo `apps/connections/apps.py`** - Falta criar
- [ ] **Arquivo `apps/moderation/apps.py`** - Falta criar

### Frontend
- [ ] **Substituir contextos antigos pelos novos**
  - `ReelsContext.jsx` → usar `ReelsContext.updated.jsx`
  - `MessagesContext.jsx` → usar `MessagesContext.updated.jsx`
  - `NotificationsContext.jsx` → usar `NotificationsContext.updated.jsx`

- [ ] **Arquivo `.env` real**
  - Apenas `.env.example` foi criado
  - Precisa de valores reais

- [ ] **Instalar axios**
  - `npm install axios`

## 🟠 ALTO (Necessário para MVP)

### Backend
- [ ] **Arquivo `apps/posts/apps.py`**
- [ ] **Arquivo `apps/reels/apps.py`**
- [ ] **Arquivo `apps/messages/apps.py`**
- [ ] **Arquivo `apps/notifications/apps.py`**
- [ ] **Arquivo `apps/connections/apps.py`**
- [ ] **Arquivo `apps/moderation/apps.py`**

- [ ] **Arquivo `apps/posts/urls.py`** - Falta criar
- [ ] **Arquivo `apps/reels/urls.py`** - Falta criar
- [ ] **Arquivo `apps/messages/urls.py`** - Falta criar
- [ ] **Arquivo `apps/notifications/urls.py`** - Falta criar
- [ ] **Arquivo `apps/connections/urls.py`** - Falta criar

- [ ] **Arquivo `apps/posts/admin.py`** - Falta criar
- [ ] **Arquivo `apps/reels/admin.py`** - Falta criar
- [ ] **Arquivo `apps/messages/admin.py`** - Falta criar
- [ ] **Arquivo `apps/notifications/admin.py`** - Falta criar
- [ ] **Arquivo `apps/connections/admin.py`** - Falta criar
- [ ] **Arquivo `apps/moderation/admin.py`** - Falta criar

- [ ] **Arquivo `apps/users/signals.py`** - Falta criar
- [ ] **Arquivo `apps/users/permissions.py`** - Falta criar

- [ ] **Arquivo `apps/messages/consumers.py`** - Falta criar
- [ ] **Arquivo `apps/messages/routing.py`** - Falta criar

- [ ] **Arquivo `apps/notifications/consumers.py`** - Falta criar
- [ ] **Arquivo `apps/notifications/routing.py`** - Falta criar

- [ ] **Arquivo `config/celery.py`** - Falta criar
- [ ] **Arquivo `config/settings/development.py`** - Falta criar
- [ ] **Arquivo `config/settings/production.py`** - Falta criar

### Frontend
- [ ] **Atualizar `App.jsx`** para usar novos contextos
- [ ] **Atualizar `Login.jsx`** para usar API real
- [ ] **Atualizar `Register.jsx`** para usar API real
- [ ] **Atualizar `Dashboard.jsx`** para usar API real
- [ ] **Atualizar `ReelFeed.jsx`** para usar API real
- [ ] **Atualizar `Messages.jsx`** para usar WebSocket
- [ ] **Atualizar `Notifications.jsx`** para usar WebSocket

## 🟡 MÉDIO (Melhora experiência)

### Backend
- [ ] **Testes unitários**
  - `tests/` em cada app
  - `test_models.py`, `test_serializers.py`, `test_views.py`

- [ ] **Fixtures de dados**
  - Dados de teste para desenvolvimento

- [ ] **Management commands**
  - Comandos customizados para setup

- [ ] **Logging configurado**
  - Logs estruturados

### Frontend
- [ ] **Testes de componentes**
  - Jest + React Testing Library

- [ ] **Testes de integração**
  - Cypress ou Playwright

- [ ] **Storybook**
  - Documentação de componentes

- [ ] **Linting e formatting**
  - ESLint + Prettier

## 🟢 BAIXO (Nice to have)

### Backend
- [ ] **GraphQL** (alternativa a REST)
- [ ] **Rate limiting mais granular**
- [ ] **Caching mais avançado**
- [ ] **Monitoring** (Sentry, DataDog)
- [ ] **Analytics**

### Frontend
- [ ] **PWA** (Progressive Web App)
- [ ] **Offline support**
- [ ] **Service Worker**
- [ ] **Performance monitoring**
- [ ] **Error tracking** (Sentry)

## 📋 Checklist de Criação de Arquivos

### Backend - Apps Config
- [ ] `backend/apps/posts/apps.py`
- [ ] `backend/apps/reels/apps.py`
- [ ] `backend/apps/messages/apps.py`
- [ ] `backend/apps/notifications/apps.py`
- [ ] `backend/apps/connections/apps.py`
- [ ] `backend/apps/moderation/apps.py`

### Backend - URLs
- [ ] `backend/apps/posts/urls.py`
- [ ] `backend/apps/reels/urls.py`
- [ ] `backend/apps/messages/urls.py`
- [ ] `backend/apps/notifications/urls.py`
- [ ] `backend/apps/connections/urls.py`

### Backend - Admin
- [ ] `backend/apps/posts/admin.py`
- [ ] `backend/apps/reels/admin.py`
- [ ] `backend/apps/messages/admin.py`
- [ ] `backend/apps/notifications/admin.py`
- [ ] `backend/apps/connections/admin.py`
- [ ] `backend/apps/moderation/admin.py`

### Backend - Signals & Permissions
- [ ] `backend/apps/users/signals.py`
- [ ] `backend/apps/users/permissions.py`

### Backend - WebSockets
- [ ] `backend/apps/messages/consumers.py`
- [ ] `backend/apps/messages/routing.py`
- [ ] `backend/apps/notifications/consumers.py`
- [ ] `backend/apps/notifications/routing.py`

### Backend - Config
- [ ] `backend/config/celery.py`
- [ ] `backend/config/settings/development.py`
- [ ] `backend/config/settings/production.py`

### Backend - Requirements
- [ ] Adicionar `channels`, `channels-redis`, `daphne` em `requirements/base.txt`

### Frontend - Contextos
- [ ] Substituir `ReelsContext.jsx` pelo `.updated.jsx`
- [ ] Substituir `MessagesContext.jsx` pelo `.updated.jsx`
- [ ] Substituir `NotificationsContext.jsx` pelo `.updated.jsx`

### Frontend - Pages
- [ ] Atualizar `Login.jsx` para usar API
- [ ] Atualizar `Register.jsx` para usar API
- [ ] Atualizar `Dashboard.jsx` para usar API
- [ ] Atualizar `ReelFeed.jsx` para usar API
- [ ] Atualizar `Messages.jsx` para usar WebSocket
- [ ] Atualizar `Notifications.jsx` para usar WebSocket

### Frontend - Dependencies
- [ ] `npm install axios`

## 🔧 Ordem de Prioridade

### 1️⃣ Primeira (Hoje)
1. Criar todos os `apps.py` faltantes
2. Criar todos os `urls.py` faltantes
3. Criar todos os `admin.py` faltantes
4. Criar `celery.py`
5. Atualizar `requirements/base.txt`
6. Criar `.env` real

### 2️⃣ Segunda (Amanhã)
1. Criar `signals.py` e `permissions.py`
2. Criar `consumers.py` e `routing.py`
3. Criar `settings/development.py` e `production.py`
4. Rodar `makemigrations` e `migrate`
5. Testar backend

### 3️⃣ Terceira (Próximos dias)
1. Instalar `axios` no frontend
2. Substituir contextos antigos
3. Atualizar páginas para usar API
4. Testar integração
5. Implementar testes

## 📊 Resumo

| Categoria | Crítico | Alto | Médio | Baixo | Total |
|-----------|---------|------|-------|-------|-------|
| Backend | 8 | 15 | 5 | 5 | 33 |
| Frontend | 4 | 7 | 3 | 5 | 19 |
| **Total** | **12** | **22** | **8** | **10** | **52** |

## ⏱️ Tempo Estimado

- **Crítico:** 2-3 horas
- **Alto:** 4-5 horas
- **Médio:** 3-4 horas
- **Baixo:** 2-3 horas
- **Total:** 11-15 horas

## 🎯 Recomendação

**Comece pelos itens CRÍTICOS e ALTOS hoje mesmo!**

Sem eles, o projeto não funciona. Os itens MÉDIO e BAIXO podem ser feitos depois.

---

**Próximo passo:** Criar todos os arquivos faltantes
