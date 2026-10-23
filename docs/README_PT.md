# 🎓 AcadLink - Rede Social Acadêmica

**Status**: ✅ 100% Completo e Pronto para Testes

---

## 📋 O que é AcadLink?

AcadLink é uma rede social acadêmica moderna que conecta estudantes, professores e profissionais. Combina o melhor do Instagram (reels, stories) com funcionalidades acadêmicas (portfólio, oportunidades, grupos de estudo).

---

## 🏗️ Arquitetura

### Backend (Django + Python)
- **Framework**: Django REST Framework
- **Banco de Dados**: PostgreSQL
- **Cache**: Redis
- **Processamento Assíncrono**: Celery
- **WebSockets**: Django Channels + Daphne
- **Autenticação**: JWT (JSON Web Tokens)

### Frontend (React + Vite)
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: Context API
- **WebSockets**: Native WebSocket API

---

## 🚀 Funcionalidades Principais

### 👤 Autenticação
- Registro e login com email
- JWT com refresh token automático
- Perfil de usuário com foto e bio
- Verificação de universidade

### 📝 Posts
- Criar, editar, deletar posts
- Like e comentários
- Compartilhamento
- Feed com paginação

### 🎬 Reels (Vídeos)
- Upload de vídeos curtos
- Categorias (Dicas, Projetos, Carreira, etc)
- Like, comentários, compartilhamento
- Busca e trending
- Processamento automático de vídeos

### 💬 Mensagens
- Conversas em tempo real (WebSocket)
- Histórico de mensagens
- Notificação de novas mensagens

### 🔔 Notificações
- Notificações em tempo real (WebSocket)
- Like, comentário, follow, mensagem
- Marcar como lida
- Histórico

### 🤝 Conexões
- Seguir/deixar de seguir usuários
- Visualizar seguidores/seguindo
- Sugestões de conexão

### 🛡️ Moderação
- Reportar posts/reels
- Banir usuários
- Filtro de conteúdo

---

## 📁 Estrutura de Pastas

```
AcadLink/
├── backend/                    # Django Backend
│   ├── config/                # Configurações
│   ├── apps/                  # 7 aplicações Django
│   │   ├── users/            # Autenticação
│   │   ├── posts/            # Posts
│   │   ├── reels/            # Reels
│   │   ├── messages/         # Mensagens
│   │   ├── notifications/    # Notificações
│   │   ├── connections/      # Conexões
│   │   └── moderation/       # Moderação
│   └── requirements/          # Dependências
│
├── acadlink/                   # React Frontend
│   ├── src/
│   │   ├── services/         # API client
│   │   ├── context/          # State management
│   │   ├── pages/            # Páginas
│   │   ├── components/       # Componentes
│   │   ├── hooks/            # Hooks customizados
│   │   └── utils/            # Utilitários
│   └── package.json          # Dependências
│
└── Documentação/              # Guias e referências
    ├── START_HERE.md
    ├── FINAL_SETUP_GUIDE.md
    ├── COMPLETION_CHECKLIST.md
    └── ...
```

---

## ⚡ Quick Start

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate no Windows
pip install -r requirements/base.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 2. Frontend

```bash
cd acadlink
npm install
cp .env.example .env
npm run dev
```

### 3. Acessar

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Admin: `http://localhost:8000/admin`

---

## 🔐 Segurança

- ✅ JWT Authentication
- ✅ Rate Limiting
- ✅ CORS Configuration
- ✅ Input Validation
- ✅ SQL Injection Prevention
- ✅ CSRF Protection
- ✅ Password Hashing (bcrypt)
- ✅ HTTPS Ready

---

## 📊 Endpoints Principais

### Autenticação
```
POST   /api/auth/register/
POST   /api/auth/login/
POST   /api/auth/refresh/
POST   /api/auth/logout/
```

### Posts
```
GET    /api/posts/
POST   /api/posts/
GET    /api/posts/{id}/
PUT    /api/posts/{id}/
DELETE /api/posts/{id}/
POST   /api/posts/{id}/like/
POST   /api/posts/{id}/comment/
```

### Reels
```
GET    /api/reels/feed/
POST   /api/reels/upload/
GET    /api/reels/{id}/
POST   /api/reels/{id}/like/
GET    /api/reels/trending/
GET    /api/reels/search/
```

### Mensagens
```
GET    /api/messages/
POST   /api/messages/
POST   /api/messages/{id}/send_message/
```

### Notificações
```
GET    /api/notifications/
POST   /api/notifications/{id}/mark_as_read/
DELETE /api/notifications/{id}/
```

### Usuários
```
GET    /api/users/
GET    /api/users/{id}/
PUT    /api/users/{id}/
POST   /api/users/{id}/follow/
POST   /api/users/{id}/unfollow/
```

---

## 🧪 Testes

### Testes Manuais
1. Criar conta
2. Fazer login
3. Criar post
4. Upload de reel
5. Enviar mensagem
6. Receber notificação
7. Seguir usuário

### Testes de API
Use Postman ou Insomnia para testar endpoints

### Testes de WebSocket
Abrir em dois navegadores e testar mensagens/notificações em tempo real

---

## 📚 Documentação

- **START_HERE.md** - Guia rápido (10 minutos)
- **FINAL_SETUP_GUIDE.md** - Setup completo com troubleshooting
- **COMPLETION_CHECKLIST.md** - Checklist de conclusão
- **BACKEND_SUMMARY.md** - Resumo do backend
- **FRONTEND_INTEGRATION.md** - Integração frontend

---

## 🛠️ Stack Tecnológico

### Backend
- Python 3.9+
- Django 4.2+
- Django REST Framework
- Django Channels
- Celery
- PostgreSQL
- Redis

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router

### DevOps
- Docker (opcional)
- Gunicorn
- Nginx
- Heroku/AWS (deployment)

---

## 📈 Próximos Passos

1. ✅ Setup local
2. ✅ Testes manuais
3. ✅ Corrigir bugs
4. ⏳ Testes automatizados
5. ⏳ Deployment em produção
6. ⏳ Monitoramento e logs

---

## 🤝 Contribuindo

1. Criar branch: `git checkout -b feature/sua-feature`
2. Commit: `git commit -m 'Add sua-feature'`
3. Push: `git push origin feature/sua-feature`
4. Pull Request

---

## 📞 Suporte

Encontrou um problema?

1. Verificar `FINAL_SETUP_GUIDE.md` - Troubleshooting
2. Verificar logs do backend
3. Verificar console do frontend (F12)
4. Verificar Network tab para erros de API

---

## 📄 Licença

MIT License - Veja LICENSE.md

---

## 👨‍💻 Desenvolvido com ❤️

**AcadLink** - Conectando a comunidade acadêmica

---

**Pronto para começar? Leia `START_HERE.md` ou `FINAL_SETUP_GUIDE.md`**
