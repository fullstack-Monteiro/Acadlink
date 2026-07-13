# AcadLink - Deployment & PostgreSQL Guide

## PARTE 1: Deploy no Vercel ✅

Seu repositório `fullstack-Monteiro/Acadlink` já está no GitHub!

### Opção 1: Dashboard Vercel (Recomendado)
1. Ir para https://vercel.com
2. Fazer login com sua conta
3. Clique "Add New" → "Project"
4. Selecionar repositório `fullstack-Monteiro/Acadlink`
5. Clique "Import"
6. Vercel detecta automaticamente (Vite + React)
7. Clique "Deploy"
8. Pronto! URL será gerada automaticamente

**Resultado:**
- Frontend em `https://acadlink.vercel.app` (ou similar)
- Auto-deploy a cada push no GitHub
- HTTPS automático
- CDN global

### Opção 2: CLI Vercel (se preferir terminal)
```bash
vercel --prod
```

---

## PARTE 2: PostgreSQL Setup 🗄️

### PASSO 1: Instalar PostgreSQL

**Windows:**
1. Baixar: https://www.postgresql.org/download/windows/
2. Instalar (deixar tudo padrão)
3. Anotar senha do usuário `postgres`

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### PASSO 2: Criar Banco de Dados

**Easiest: Usar pgAdmin (GUI)**
1. Abrir pgAdmin (já vem instalado)
2. Clicar direito em "Databases" → "Create" → "Database"
3. Nome: `acadlink_db`
4. Owner: `postgres`
5. Salvar

**Ou Terminal:**
```bash
# Conectar ao PostgreSQL
psql -U postgres

# No prompt, executar:
CREATE DATABASE acadlink_db;
\q
```

### PASSO 3: Configurar Backend Django

```bash
# Navegue para backend
cd ../backend

# Windows
.\setup-postgresql.ps1

# Mac/Linux
bash setup-postgresql.sh
```

**Ou manualmente:**
```bash
# Criar .env a partir do exemplo
cp .env.example .env

# Editar .env com credenciais:
# DB_NAME=acadlink_db
# DB_USER=postgres
# DB_PASSWORD=sua_senha

# Instalar dependências
pip install -r requirements/production.txt

# Executar migrações
python manage.py migrate
```

### PASSO 4: Criar Admin User

```bash
python manage.py createsuperuser

# Responder os prompts:
# Username: admin
# Email: seu_email@example.com
# Password: sua_senha
# Password (again): sua_senha
```

### PASSO 5: Rodar Servidor

```bash
python manage.py runserver
```

Acessar:
- API: http://localhost:8000/api/
- Admin: http://localhost:8000/admin/

---

## PARTE 3: Conectar Frontend com Backend

### Editar `acadlink/.env`

```env
VITE_API_URL=http://localhost:8000/api
```

### Editar `backend/.env`

```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
FRONTEND_URL=http://localhost:3000
```

---

## PARTE 4: Verificar Tudo

### Teste Backend
```bash
# Terminal 1 - Backend
cd ../backend
python manage.py runserver

# Terminal 2 - Verificar
curl http://localhost:8000/api/
```

### Teste Frontend
```bash
# Terminal 3 - Frontend
npm run dev
```

Abrir: http://localhost:5173

---

## PARTE 5: Deploy em Produção

### Backend - Opções Recomendadas

1. **Railway.app** (mais fácil)
   - Conectar GitHub
   - Automático com PostgreSQL incluído
   - $5/mês mínimo

2. **AWS RDS** (mais robusto)
   - PostgreSQL gerenciado
   - Escalável
   - Mais complexo

3. **Render.com** (alternativa)
   - Free tier disponível
   - PostgreSQL incluído
   - Deploy automático GitHub

### Passos Genéricos para Produção

1. **Editar `.env`:**
```env
DEBUG=False
SECRET_KEY=seu-secret-key-aleatorio-muito-seguro
ALLOWED_HOSTS=seu-dominio.com,www.seu-dominio.com
DB_HOST=seu-postgres-remoto.herokuapp.com
DB_PASSWORD=senha-super-segura
```

2. **Rodar migrações no servidor:**
```bash
python manage.py migrate --settings=config.settings.production
```

3. **Criar super user:**
```bash
python manage.py createsuperuser --settings=config.settings.production
```

4. **Coletar arquivos estáticos:**
```bash
python manage.py collectstatic --settings=config.settings.production
```

---

## Checklist Final

- [ ] PostgreSQL instalado e rodando
- [ ] Banco `acadlink_db` criado
- [ ] Backend migrado (`python manage.py migrate`)
- [ ] Admin criado (`python manage.py createsuperuser`)
- [ ] Backend testado (`python manage.py runserver`)
- [ ] Frontend testado (`npm run dev`)
- [ ] Frontend no Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado
- [ ] API respondendo em `/api/`

---

## Endpoints de Teste

```bash
# Verificar database
curl http://localhost:8000/api/

# Admin
http://localhost:8000/admin/

# Users API
curl http://localhost:8000/api/users/

# Posts API
curl http://localhost:8000/api/posts/

# Reels API
curl http://localhost:8000/api/reels/
```

---

## Troubleshooting Rápido

**PostgreSQL não conecta:**
```bash
# Verificar se está rodando
pg_isready -h localhost

# Resetar (deleta tudo!)
psql -U postgres
DROP DATABASE acadlink_db;
CREATE DATABASE acadlink_db;
```

**Erro psycopg2:**
```bash
pip install psycopg2-binary
```

**Erro de migração:**
```bash
python manage.py makemigrations
python manage.py migrate
```

**Porta 8000 ocupada:**
```bash
python manage.py runserver 8001
```

---

## Próximas Fases

1. **Implementar APIs** dos endpoints documentados
2. **Integrar autenticação** (JWT do backend)
3. **Upload de vídeos** (S3 ou local)
4. **Notificações em tempo real** (WebSockets)
5. **CI/CD automatizado** (GitHub Actions)

Boa sorte! 🚀
