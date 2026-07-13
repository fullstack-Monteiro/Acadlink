# PostgreSQL - Quick Start Rápido

## TLDR - O Essencial

### 1. Instalar PostgreSQL
- Windows: https://www.postgresql.org/download/windows/
- Mac: `brew install postgresql && brew services start postgresql`
- Linux: `sudo apt-get install postgresql postgresql-contrib`

### 2. Criar Banco (usando pgAdmin ou linha de comando)

**Via pgAdmin (mais fácil):**
1. Abrir pgAdmin (vem com PostgreSQL no Windows)
2. Clicar direito em "Databases" → "Create" → "Database"
3. Nome: `acadlink_db`
4. Owner: `postgres`
5. Clicar "Save"

**Via Terminal (se preferir):**
```bash
psql -U postgres

# No prompt do PostgreSQL:
CREATE DATABASE acadlink_db;
\q
```

### 3. Configurar Backend

```bash
cd backend

# Windows
.\setup-postgresql.ps1

# Mac/Linux
bash setup-postgresql.sh
```

### 4. Criar Admin (Superuser)
```bash
python manage.py createsuperuser

# Responder:
# Username: seu_username
# Email: seu_email@example.com
# Password: sua_senha
```

### 5. Rodar Servidor
```bash
python manage.py runserver
```

Pronto! Acessar http://localhost:8000

---

## Arquivo .env Essencial

```env
# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=acadlink_db
DB_USER=postgres
DB_PASSWORD=sua_senha_postgres
DB_HOST=localhost
DB_PORT=5432

# Django
DEBUG=True
SECRET_KEY=dev-secret-key-123
ALLOWED_HOSTS=localhost,127.0.0.1
```

---

## Testes Rápidos

**Testar conexão:**
```bash
python manage.py dbshell
```

**Ver tabelas criadas:**
```bash
psql -U postgres -d acadlink_db

# No prompt:
\dt
\q
```

**Verificar migrações:**
```bash
python manage.py showmigrations
```

---

## Problemas Comuns

| Erro | Solução |
|------|---------|
| `could not connect to server` | PostgreSQL não está rodando. Iniciar: `brew services start postgresql` ou abrir PostgreSQL no Windows |
| `psycopg2 not found` | `pip install psycopg2-binary` |
| `password authentication failed` | Verificar DB_PASSWORD em .env |
| `FATAL: database does not exist` | Criar banco: `CREATE DATABASE acadlink_db;` |
| `permission denied` | Usar usuário correto (`postgres` ou `acadlink_user`) |

---

## Pronto para Produção?

Para deploy em produção:
1. Editar `.env`: `DEBUG=False`
2. Usar banco PostgreSQL remoto (ex: AWS RDS, Railway, Render)
3. Configurar variáveis de ambiente no servidor
4. Rodar `python manage.py migrate` no servidor
5. Rodar `python manage.py collectstatic` para arquivos estáticos

---

## Documentação Completa

Ver `POSTGRESQL_SETUP.md` para configuração avançada.
