# 🚀 START HERE - Guia Rápido

## ⏱️ 10 Minutos para Começar

### Terminal 1: Backend

```bash
# Entre na pasta backend
cd backend

# Crie ambiente virtual
python -m venv venv

# Ative ambiente virtual
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Instale dependências
pip install -r requirements/development.txt

# Configure .env
cp .env.example .env

# Execute migrações
python manage.py migrate

# Crie superuser (use admin/admin123)
python manage.py createsuperuser

# Inicie servidor
python manage.py runserver
```

**Backend rodando em:** http://localhost:8000

### Terminal 2: Frontend

```bash
# Entre na pasta frontend
cd acadlink

# Configure .env
cp .env.example .env

# Instale dependências (se não tiver)
npm install

# Inicie frontend
npm run dev
```

**Frontend rodando em:** http://localhost:5173

## 🧪 Teste Rápido

### 1. Acesse o Admin
```
http://localhost:8000/admin/
Username: admin
Password: admin123
```

### 2. Acesse o Frontend
```
http://localhost:5173/
```

### 3. Faça Login
```
Email: admin@example.com (ou use o email do superuser)
Password: admin123
```

## 📊 Estrutura de Pastas

```
acadlink/
├── backend/                    # Django backend
│   ├── config/                # Configurações
│   ├── apps/                  # 7 aplicações
│   ├── requirements/          # Dependências
│   ├── manage.py
│   └── docker-compose.yml
│
├── acadlink/                  # React frontend
│   ├── src/
│   │   ├── components/        # Componentes
│   │   ├── pages/             # Páginas
│   │   ├── context/           # Contextos
│   │   ├── services/          # API client
│   │   ├── hooks/             # Hooks
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
└── Documentação
    ├── README.md
    ├── QUICK_START.md
    ├── INTEGRATION_COMPLETE.md
    └── PROJECT_COMPLETE.md
```

## 🔌 Endpoints Principais

### Login
```bash
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Perfil
```bash
curl -X GET http://localhost:8000/api/users/me/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Posts
```bash
curl -X GET http://localhost:8000/api/posts/feed/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Reels
```bash
curl -X GET http://localhost:8000/api/reels/feed/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🐳 Com Docker (Alternativa)

```bash
# Inicie todos os serviços
docker-compose up -d

# Execute migrações
docker-compose exec web python manage.py migrate

# Crie superuser
docker-compose exec web python manage.py createsuperuser

# Acesse
# Backend: http://localhost:8000
# Frontend: http://localhost:3000
```

## 📝 Variáveis de Ambiente

### Backend (.env)
```
DEBUG=True
SECRET_KEY=your-secret-key
DB_ENGINE=django.db.backends.postgresql
DB_NAME=acadlink
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
REDIS_URL=redis://localhost:6379/0
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
VITE_WEBSOCKET_URL=ws://localhost:8000/ws
```

## ✅ Checklist de Setup

- [ ] Backend rodando em http://localhost:8000
- [ ] Frontend rodando em http://localhost:5173
- [ ] Admin acessível em http://localhost:8000/admin/
- [ ] Login funcionando
- [ ] Posts carregando
- [ ] Reels carregando
- [ ] Mensagens funcionando
- [ ] Notificações funcionando

## 🆘 Troubleshooting

### Erro: "Port 8000 already in use"
```bash
# Use outra porta
python manage.py runserver 8001
```

### Erro: "No module named 'django'"
```bash
# Instale dependências
pip install -r requirements/development.txt
```

### Erro: "Database connection refused"
```bash
# Certifique-se de que PostgreSQL está rodando
# Ou use SQLite (padrão em desenvolvimento)
```

### Erro: "CORS error"
```bash
# Verifique CORS_ALLOWED_ORIGINS em .env
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

## 📚 Documentação

- `README.md` - Documentação geral
- `QUICK_START.md` - Quick start
- `BACKEND_SUMMARY.md` - Resumo do backend
- `FRONTEND_INTEGRATION.md` - Integração
- `INTEGRATION_COMPLETE.md` - Integração completa
- `PROJECT_COMPLETE.md` - Projeto completo
- `IMPLEMENTATION_CHECKLIST.md` - Checklist

## 🎯 Próximos Passos

1. ✅ Setup backend e frontend
2. ✅ Testar endpoints
3. ✅ Testar WebSockets
4. ✅ Implementar testes
5. ✅ Deploy em staging
6. ✅ Deploy em produção

## 📞 Suporte

### Documentação
- [Django Docs](https://docs.djangoproject.com/)
- [DRF Docs](https://www.django-rest-framework.org/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)

### Comunidades
- Django Community
- React Community
- Stack Overflow

## 🎉 Pronto!

Você tem um **sistema completo de rede social acadêmica** pronto para usar!

---

**Tempo total:** ~10 minutos
**Status:** 🟢 Pronto para começar
