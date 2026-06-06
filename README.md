# AcadLink - Rede Social Acadêmica

Uma plataforma moderna conectando estudantes universitários moçambicanos para compartilhar conhecimento, oportunidades e experiências académicas.

## 🎯 Visão Geral

AcadLink é uma rede social desenhada especificamente para o ecossistema académico moçambicano, permitindo:

- 📱 **Feed Social** - Partilha de apontamentos, dicas de estudo e oportunidades
- 🎥 **Reels** - Vídeos curtos estilo TikTok/Instagram
- 💬 **Mensagens** - Comunicação direta entre estudantes
- 📚 **Biblioteca** - Acesso a recursos académicos partilhados
- 💼 **Oportunidades** - Estágios, bolsas e eventos académicos
- 👥 **Comunidades** - Grupos por universidade e curso

## 🏗️ Arquitetura

### Frontend (React + Vite)
- **UI Framework**: Tailwind CSS
- **Ícones**: Lucide React
- **State Management**: Context API + Hooks
- **Routing**: React Router
- **HTTP Client**: Axios

### Backend (Django + Python)
- **API**: REST com Django REST Framework
- **Autenticação**: JWT
- **Base de Dados**: PostgreSQL
- **Upload de Arquivos**: Cloudinary/S3
- **WebSockets**: Channels (para chat em tempo real)

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- Python 3.10+
- npm ou yarn

### Instalação Frontend

```bash
cd acadlink
npm install
npm run dev
```

Acesse: `http://localhost:3000`

### Instalação Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

API disponível em: `http://localhost:8000`

## 📁 Estrutura do Projeto

```
AcadLink/
├── acadlink/                 # Frontend React
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── context/        # Estado global (Context API)
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Funções utilitárias
│   │   └── services/       # API calls
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # API Django
│   ├── apps/
│   │   ├── users/          # Autenticação e perfis
│   │   ├── posts/          # Posts e feed
│   │   ├── reels/          # Vídeos curtos
│   │   ├── messages/       # Chat
│   │   ├── communities/    # Grupos e comunidades
│   │   └── opportunities/  # Estágios e oportunidades
│   ├── manage.py
│   └── requirements.txt
│
└── docs/                     # Documentação
    ├── API_ENDPOINTS_COMPLETE.md
    ├── API_IMPLEMENTATION_PRIORITY.md
    └── API_ARCHITECTURE_DIAGRAM.md
```

## 🎨 Funcionalidades Principais

### Autenticação
- ✅ Registro com validação de email universitário
- ✅ Login com JWT
- ✅ Recuperação de senha
- ✅ Verificação de universidade

### Feed Social
- ✅ Posts com texto e imagens
- ✅ Likes, comentários e partilhas
- ✅ Sistema de recomendações
- ✅ Pesquisa por hashtags

### Reels
- ✅ Upload e reprodução de vídeos
- ✅ Gestos de swipe para navegação
- ✅ Ações rápidas (like, comentário, partilha)
- ✅ Exploração por categorias

### Perfil
- ✅ Portfólio académico
- ✅ Recomendações de colegas
- ✅ Histórico académico
- ✅ Badge de verificação universitária

## 🔌 API Endpoints

### Autenticação
```
POST   /api/auth/register/
POST   /api/auth/login/
POST   /api/auth/refresh/
POST   /api/auth/logout/
```

### Utilizadores
```
GET    /api/users/{id}/
PUT    /api/users/{id}/
GET    /api/users/{id}/followers/
POST   /api/users/{id}/follow/
```

### Posts
```
GET    /api/posts/
POST   /api/posts/
GET    /api/posts/{id}/
PUT    /api/posts/{id}/
DELETE /api/posts/{id}/
```

### Reels
```
GET    /api/reels/
POST   /api/reels/
GET    /api/reels/{id}/
PUT    /api/reels/{id}/
DELETE /api/reels/{id}/
```

Veja documentação completa em `API_ENDPOINTS_COMPLETE.md`

## 🎯 Status de Implementação

| Módulo | Status | Progresso |
|--------|--------|-----------|
| Frontend - Autenticação | ✅ | 100% |
| Frontend - Feed | ✅ | 90% |
| Frontend - Reels | ✅ | 85% |
| Backend - Autenticação | ✅ | 100% |
| Backend - Posts | 🔄 | 50% |
| Backend - Reels | 🔄 | 40% |
| Backend - Mensagens | ⏳ | 10% |

## 🛠️ Variáveis de Ambiente

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=AcadLink
```

### Backend (.env)
```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost/acadlink
ALLOWED_HOSTS=localhost,127.0.0.1
```

## 📚 Documentação

- [API Endpoints Completos](./API_ENDPOINTS_COMPLETE.md)
- [Plano de Implementação](./API_IMPLEMENTATION_PRIORITY.md)
- [Arquitetura da API](./API_ARCHITECTURE_DIAGRAM.md)

## 🚢 Deploy

### Vercel (Frontend)
```bash
cd acadlink
vercel deploy --prod
```

### Heroku/Railway (Backend)
```bash
git push heroku main
```

## 👥 Contribuidores

- **Frontend**: React + Vite + Tailwind
- **Backend**: Django REST Framework
- **Design**: Mobile-first responsivo

## 📝 Licença

Projeto privado - AcadLink © 2024

## 📧 Suporte

Para dúvidas ou problemas, contacte: support@acadlink.mz

---

**Feito com ❤️ para estudantes moçambicanos**
