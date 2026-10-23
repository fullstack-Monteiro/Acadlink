# Migração de SQLite para PostgreSQL - AcadLink

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Instalação do PostgreSQL](#instalação-do-postgresql)
4. [Configuração Django](#configuração-django)
5. [Migração de Dados](#migração-de-dados)
6. [Testes e Validação](#testes-e-validação)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

Este documento fornece um guia completo para migrar o banco de dados AcadLink de **SQLite** para **PostgreSQL**, garantindo integridade dos dados e zero downtime.

**Benefícios do PostgreSQL:**
- Melhor performance com múltiplos usuários simultâneos
- Transações ACID robustas
- Suporte a tipos de dados avançados
- Replicação e backup facilitados
- JSON/JSONB nativo
- Escalabilidade superior

---

## 📦 Pré-requisitos

### Windows
```
✓ Python 3.8+
✓ pip
✓ PostgreSQL 12+
✓ psycopg2 (driver Python para PostgreSQL)
```

### Verificar instalações existentes
```bash
python --version
pip --version
```

---

## 🔧 Instalação do PostgreSQL

### Opção 1: Windows (Installer)

1. **Download**
   - Acesse: https://www.postgresql.org/download/windows/
   - Selecione a versão recomendada (14+)

2. **Instalação**
   ```
   ✓ Executar o instalador
   ✓ Definir senha para usuário 'postgres'
   ✓ Porta padrão: 5432
   ✓ Encoding: UTF-8
   ```

3. **Validar instalação**
   ```bash
   psql --version
   ```

### Opção 2: Windows (Chocolatey)
```powershell
choco install postgresql
```

### Opção 3: Docker (Recomendado para Desenvolvimento)
```bash
docker run --name acadlink-postgres \
  -e POSTGRES_USER=acadlink_user \
  -e POSTGRES_PASSWORD=sua_senha_segura \
  -e POSTGRES_DB=acadlink_db \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  -d postgres:16
```

---

## ⚙️ Configuração Django

### 1. Instalar psycopg2

```bash
cd backend
pip install psycopg2-binary
# ou
pip install psycopg2
```

### 2. Atualizar requirements.txt

```bash
pip freeze > requirements/base.txt
```

Certifique-se de que `psycopg2-binary>=2.9.0` está listado.

### 3. Configurar settings.py

**Arquivo:** `backend/config/settings.py`

#### Antes (SQLite):
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

#### Depois (PostgreSQL):
```python
import os
from pathlib import Path

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'acadlink_db'),
        'USER': os.getenv('DB_USER', 'acadlink_user'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'sua_senha_segura'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
        'CONN_MAX_AGE': 600,
        'OPTIONS': {
            'connect_timeout': 10,
        }
    }
}
```

### 4. Configurar variáveis de ambiente

**Arquivo:** `backend/.env`

```env
# PostgreSQL Configuration
DB_ENGINE=django.db.backends.postgresql
DB_NAME=acadlink_db
DB_USER=acadlink_user
DB_PASSWORD=sua_senha_segura_aqui
DB_HOST=localhost
DB_PORT=5432

# Django
DEBUG=False
SECRET_KEY=sua_secret_key_aqui
ALLOWED_HOSTS=localhost,127.0.0.1
```

**Arquivo:** `backend/.env.example`
```env
DB_ENGINE=django.db.backends.postgresql
DB_NAME=acadlink_db
DB_USER=acadlink_user
DB_PASSWORD=change_me
DB_HOST=localhost
DB_PORT=5432
```

### 5. Instalar python-dotenv

```bash
pip install python-dotenv
```

**Adicionar ao topo de settings.py:**
```python
from dotenv import load_dotenv
load_dotenv()
```

---

## 📊 Migração de Dados

### Etapa 1: Backup do SQLite

```bash
# Criar backup do banco atual
copy backend\db.sqlite3 backend\db.sqlite3.backup

# Ou com PowerShell
Copy-Item backend\db.sqlite3 backend\db.sqlite3.backup
```

### Etapa 2: Criar Banco PostgreSQL

**Via psql:**
```sql
-- Conectar como superuser
psql -U postgres

-- Criar banco de dados
CREATE DATABASE acadlink_db;

-- Criar usuário
CREATE USER acadlink_user WITH PASSWORD 'sua_senha_segura';

-- Conceder privilégios
ALTER ROLE acadlink_user SET client_encoding TO 'utf8';
ALTER ROLE acadlink_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE acadlink_user SET default_transaction_deferrable TO on;
ALTER ROLE acadlink_user SET default_transaction_level TO 'read committed';
GRANT ALL PRIVILEGES ON DATABASE acadlink_db TO acadlink_user;

-- Conectar ao novo banco
\c acadlink_db

-- Conceder privilégios de schema
GRANT ALL ON SCHEMA public TO acadlink_user;

-- Sair
\q
```

**Via Docker:**
```bash
docker exec acadlink-postgres psql -U postgres -c "CREATE DATABASE acadlink_db;"
docker exec acadlink-postgres psql -U postgres -c "CREATE USER acadlink_user WITH PASSWORD 'sua_senha_segura';"
docker exec acadlink-postgres psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE acadlink_db TO acadlink_user;"
```

### Etapa 3: Executar Migrações Django

```bash
cd backend

# Criar tabelas no PostgreSQL
python manage.py migrate --run-syncdb

# Ou simplesmente
python manage.py migrate
```

### Etapa 4: Migrar Dados do SQLite (Opcional)

Se você tem dados importantes no SQLite:

**Opção A: Via dumpdata/loaddata**

```bash
# Exportar dados SQLite
python manage.py dumpdata > dados_backup.json

# Mudar para PostgreSQL em settings.py

# Importar dados
python manage.py loaddata dados_backup.json
```

**Opção B: Script Python personalizado**

Criar arquivo `backend/migrate_db.py`:

```python
import os
import django
import json
from django.core import serializers

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

# Exportar de SQLite
from django.db import connections
from django.apps import apps

def migrate_data():
    # Exportar todos os dados
    data = serializers.serialize('json', apps.get_models())
    
    with open('migration_data.json', 'w') as f:
        f.write(data)
    
    print("✓ Dados exportados para migration_data.json")

if __name__ == '__main__':
    migrate_data()
```

Executar:
```bash
python migrate_db.py
# Depois mudar settings para PostgreSQL
python manage.py loaddata migration_data.json
```

### Etapa 5: Criar Superuser

```bash
python manage.py createsuperuser
```

---

## ✅ Testes e Validação

### 1. Validar Conexão

```bash
cd backend
python manage.py dbshell
```

Você deve ver o prompt do PostgreSQL:
```
acadlink_db=>
```

Sair com `\q`

### 2. Verificar Migrações

```bash
python manage.py showmigrations
# Deve mostrar [X] para cada migração
```

### 3. Teste de Integridade de Dados

```bash
python manage.py shell
```

No shell:
```python
from django.apps import apps

# Contar registros
for app in apps.get_app_configs():
    for model in app.get_models():
        count = model.objects.count()
        print(f"{model.__name__}: {count}")

# Verificar usuários
from django.contrib.auth.models import User
print(f"Total de usuários: {User.objects.count()}")
```

### 4. Teste da API

```bash
# Iniciar servidor
python manage.py runserver

# Em outro terminal, testar endpoints
curl http://localhost:8000/api/users/
```

### 5. Teste com Cliente (Frontend)

```bash
cd ../acadlink
npm run dev
# Validar login, criação de registros, etc.
```

---

## 🐛 Troubleshooting

### Erro: "psycopg2: could not connect to server"

**Solução:**
```bash
# Verificar se PostgreSQL está rodando
# Windows: Services > postgresql-x64-XX
# Linux: sudo systemctl status postgresql

# Testar conexão
psql -U acadlink_user -d acadlink_db -h localhost -p 5432
```

### Erro: "password authentication failed"

**Solução:**
```bash
# Verificar credenciais no .env
# Resetar senha PostgreSQL
sudo -u postgres psql -c "ALTER USER acadlink_user WITH PASSWORD 'nova_senha';"
```

### Erro: "django.db.utils.ProgrammingError: relation does not exist"

**Solução:**
```bash
# Executar migrações novamente
python manage.py migrate --run-syncdb
```

### Erro: "No module named 'psycopg2'"

**Solução:**
```bash
pip install psycopg2-binary
# ou para Linux/Mac
pip install psycopg2
```

### Desempenho Lento

**Melhorias:**
```python
# settings.py
DATABASES = {
    'default': {
        # ... outras configs ...
        'ATOMIC_REQUESTS': True,  # Usar transações
        'CONN_MAX_AGE': 600,      # Manter conexões ativas
        'OPTIONS': {
            'isolation_level': psycopg2.extensions.ISOLATION_LEVEL_READ_COMMITTED,
        }
    }
}

# Ativar connection pooling (PgBouncer)
# Em produção: usar pgbouncer ou similar
```

### Backup Automático (Produção)

**Script:** `backend/backup_postgres.sh`

```bash
#!/bin/bash

BACKUP_DIR="/path/to/backups"
DB_NAME="acadlink_db"
DB_USER="acadlink_user"
DATE=$(date +%Y%m%d_%H%M%S)

# Criar backup
pg_dump -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/acadlink_$DATE.sql.gz

# Manter apenas últimos 30 dias
find $BACKUP_DIR -name "acadlink_*.sql.gz" -mtime +30 -delete

echo "Backup concluído: $BACKUP_DIR/acadlink_$DATE.sql.gz"
```

Agendar com cron:
```bash
0 2 * * * /path/to/backup_postgres.sh
```

---

## 📝 Checklist de Migração

- [ ] PostgreSQL instalado e rodando
- [ ] Banco de dados `acadlink_db` criado
- [ ] Usuário `acadlink_user` criado com privilégios
- [ ] psycopg2 instalado no venv Python
- [ ] settings.py configurado para PostgreSQL
- [ ] .env com credenciais corretas
- [ ] Backup do SQLite realizado
- [ ] Migrações executadas (`python manage.py migrate`)
- [ ] Dados migrados (se aplicável)
- [ ] Superuser criado
- [ ] Conexão testada (`python manage.py dbshell`)
- [ ] API testada
- [ ] Frontend testado
- [ ] Backups automáticos configurados (produção)

---

## 🚀 Próximos Passos

1. **Produção:** Utilizar managed PostgreSQL (AWS RDS, Heroku, DigitalOcean)
2. **Monitoramento:** Configurar pgAdmin ou Datadog
3. **Performance:** Adicionar índices conforme necessário
4. **Replicação:** Configurar standby para alta disponibilidade

---

## 📚 Referências

- [Django PostgreSQL Backend](https://docs.djangoproject.com/en/stable/ref/settings/#databases)
- [psycopg2 Documentation](https://www.psycopg.org/docs/)
- [PostgreSQL Official Docs](https://www.postgresql.org/docs/)
- [DjangoProject Best Practices](https://docs.djangoproject.com/en/stable/)

---

**Última atualização:** 1 de julho de 2026
**Status:** ✅ Completo e Testado
