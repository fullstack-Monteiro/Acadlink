# PostgreSQL Setup Guide - AcadLink

## Pré-requisitos

- PostgreSQL 13+ instalado e rodando
- pgAdmin ou outro cliente PostgreSQL (opcional, para gerenciar BD)
- Backend do AcadLink configurado

---

## 1. Instalar PostgreSQL

### Windows
1. Baixar em: https://www.postgresql.org/download/windows/
2. Executar o instalador
3. Durante a instalação:
   - Definir senha para usuário `postgres`
   - Manter porta 5432 (padrão)
   - Selecionar componentes (pgAdmin é útil)

### macOS (com Homebrew)
```bash
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

---

## 2. Criar Banco de Dados e Usuário

### Conectar ao PostgreSQL
```bash
# Windows/Mac
psql -U postgres

# Linux
sudo -u postgres psql
```

### Executar estes comandos SQL
```sql
-- Criar usuário
CREATE USER acadlink_user WITH PASSWORD 'change_me';

-- Criar banco de dados
CREATE DATABASE acadlink_db OWNER acadlink_user;

-- Dar permissões
ALTER ROLE acadlink_user SET client_encoding TO 'utf8';
ALTER ROLE acadlink_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE acadlink_user SET default_transaction_deferrable TO on;
ALTER ROLE acadlink_user SET default_transaction_level TO 'read committed';
ALTER ROLE acadlink_user SET timezone TO 'UTC';

-- Permitir conexão
GRANT CONNECT ON DATABASE acadlink_db TO acadlink_user;
GRANT USAGE ON SCHEMA public TO acadlink_user;
GRANT CREATE ON SCHEMA public TO acadlink_user;

-- Sair
\q
```

---

## 3. Configurar Variáveis de Ambiente

No arquivo `backend/.env`, configurar:

```env
# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=acadlink_db
DB_USER=acadlink_user
DB_PASSWORD=change_me
DB_HOST=localhost
DB_PORT=5432

# Django
DEBUG=False  # Para produção
SECRET_KEY=seu-secret-key-muito-seguro-aqui
ALLOWED_HOSTS=localhost,127.0.0.1,seu-dominio.com
```

---

## 4. Instalar Dependências Python

```bash
cd backend

# Criar ambiente virtual (se não houver)
python -m venv venv

# Ativar ambiente
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# Instalar requirements
pip install -r requirements/production.txt
```

---

## 5. Executar Migrações

```bash
python manage.py migrate
```

Isso vai:
- Criar todas as tabelas no PostgreSQL
- Configurar índices e constraints
- Popular dados iniciais se houver

---

## 6. Criar Superuser (Admin)

```bash
python manage.py createsuperuser
```

Seguir as instruções para criar usuário admin.

---

## 7. Testar Conexão

```bash
python manage.py dbshell
```

Se conectar ao PostgreSQL sem erros, está tudo correto!

---

## 8. Rodar o Servidor Django

```bash
python manage.py runserver
```

Acessar em http://localhost:8000

---

## Verificar Estado do Banco

### Via Django Shell
```bash
python manage.py shell

# Testar conexão
from django.db import connection
print(connection.get_server_version())
```

### Via psql (linha de comando)
```bash
psql -U acadlink_user -d acadlink_db -h localhost
```

---

## Troubleshooting

### Erro: "psycopg2 not found"
```bash
pip install psycopg2-binary
```

### Erro: "could not connect to server"
- Verificar se PostgreSQL está rodando
- Verificar credenciais no `.env`
- Testar com `psql -U postgres`

### Erro: "permission denied for database"
```sql
-- Como postgres:
GRANT ALL PRIVILEGES ON DATABASE acadlink_db TO acadlink_user;
```

### Resetar banco (cuidado! deleta tudo)
```bash
# Dropar banco
python manage.py flush --no-input

# Ou via psql
psql -U postgres
DROP DATABASE acadlink_db;
CREATE DATABASE acadlink_db OWNER acadlink_user;
```

---

## Próximos Passos

1. Depois de tudo configurado, criar migração para novos models
2. Executar `python manage.py migrate`
3. Testar endpoints da API com Postman ou similar

---

## Recursos

- PostgreSQL Docs: https://www.postgresql.org/docs/
- Django Database: https://docs.djangoproject.com/en/5.0/ref/databases/
- psycopg2: https://www.psycopg.org/
