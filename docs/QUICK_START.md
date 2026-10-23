# 🚀 Quick Start - AcadLink Backend

## 5 Minutos para Começar

### 1. Setup Inicial (2 min)

```bash
# Entre na pasta backend
cd backend

# Crie ambiente virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instale dependências
pip install -r requirements/development.txt

# Configure .env
cp .env.example .env
```

### 2. Banco de Dados (2 min)

```bash
# Execute migrações
python manage.py migrate

# Crie superuser
python manage.py createsuperuser
# Username: admin
# Email: admin@example.com
# Password: admin123
```

### 3. Inicie o Servidor (1 min)

```bash
# Inicie servidor
python manage.py runserver

# Acesse:
# API: http://localhost:8000/api/
# Admin: http://localhost:8000/admin/
```

## 🧪 Teste Rápido

### Login

```bash
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Resposta:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Obtenha Perfil

```bash
curl -X GET http://localhost:8000/api/users/me/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Crie um Post

```bash
curl -X POST http://localhost:8000/api/posts/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello AcadLink!"}'
```

## 🐳 Com Docker (Alternativa)

```bash
# Inicie todos os serviços
docker-compose up -d

# Execute migrações
docker-compose exec web python manage.py migrate

# Crie superuser
docker-compose exec web python manage.py createsuperuser

# Acesse: http://localhost:8000/
```

## 📁 Estrutura Criada

```
backend/
├── config/              # Configurações Django
├── apps/                # 7 aplicações
│   ├── users/          # Autenticação
│   ├── posts/          # Posts
│   ├── reels/          # Reels
│   ├── messages/       # Mensagens
│   ├── notifications/  # Notificações
│   ├── connections/    # Conexões
│   └── moderation/     # Moderação
├── requirements/        # Dependências
└── manage.py           # CLI
```

## 🔌 Endpoints Principais

```
POST   /api/auth/token/              # Login
GET    /api/users/me/                # Perfil
POST   /api/posts/                   # Criar post
GET    /api/posts/feed/              # Feed
POST   /api/reels/upload/            # Upload reel
GET    /api/reels/feed/              # Feed de reels
GET    /api/messages/                # Conversas
GET    /api/notifications/           # Notificações
```

## 📊 Admin Panel

Acesse: http://localhost:8000/admin/
- Username: admin
- Password: admin123

Gerencie:
- Usuários
- Posts
- Reels
- Mensagens
- Notificações
- Conexões
- Moderação

## 🔐 Segurança

✅ JWT Authentication
✅ Rate Limiting
✅ CORS Configured
✅ Input Validation
✅ Brute-force Protection

## 🔄 WebSockets

```javascript
// Mensagens em tempo real
const ws = new WebSocket('ws://localhost:8000/ws/messages/1/')

// Notificações em tempo real
const ws = new WebSocket('ws://localhost:8000/ws/notifications/')
```

## 📚 Documentação

- `README.md` - Documentação completa
- `SETUP.md` - Guia de setup detalhado
- `BACKEND_SUMMARY.md` - Resumo do backend
- `FRONTEND_INTEGRATION.md` - Integração com frontend
- `IMPLEMENTATION_CHECKLIST.md` - Checklist de implementação

## 🆘 Troubleshooting

### Erro: "No module named 'django'"
```bash
pip install -r requirements/development.txt
```

### Erro: "Database connection refused"
```bash
# Certifique-se de que PostgreSQL está rodando
# Ou use SQLite (padrão em desenvolvimento)
```

### Erro: "Port 8000 already in use"
```bash
python manage.py runserver 8001
```

### Erro: "CORS error"
```bash
# Verifique CORS_ALLOWED_ORIGINS em .env
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## 📈 Próximos Passos

1. ✅ Testar endpoints
2. ✅ Integrar com frontend
3. ✅ Configurar S3 para uploads
4. ✅ Adicionar testes
5. ✅ Deploy em staging
6. ✅ Deploy em produção

## 🎯 Checklist Rápido

- [ ] Backend rodando
- [ ] Admin acessível
- [ ] Endpoints testados
- [ ] WebSockets funcionando
- [ ] Frontend integrado
- [ ] Testes passando
- [ ] Pronto para produção

## 📞 Suporte

Documentação:
- [Django Docs](https://docs.djangoproject.com/)
- [DRF Docs](https://www.django-rest-framework.org/)
- [Channels Docs](https://channels.readthedocs.io/)

## ✅ Status

🟢 **Backend pronto para integração com frontend**

---

**Tempo total:** ~5 minutos
**Próximo passo:** Integrar com frontend (ver `FRONTEND_INTEGRATION.md`)
