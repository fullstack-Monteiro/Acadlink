#!/bin/bash

# Setup PostgreSQL for AcadLink
# Execute com: bash setup-postgresql.sh

echo "========================================"
echo "AcadLink PostgreSQL Setup"
echo "========================================"

# Verificar se PostgreSQL está instalado
echo ""
echo "[1/5] Verificando PostgreSQL..."
if command -v psql &> /dev/null; then
    echo "✓ PostgreSQL encontrado"
else
    echo "✗ PostgreSQL não encontrado. Instale com:"
    echo "  macOS: brew install postgresql && brew services start postgresql"
    echo "  Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
    exit 1
fi

# Criar arquivo .env se não existir
echo ""
echo "[2/5] Configurando variáveis de ambiente..."
if [ -f ".env" ]; then
    echo "✓ Arquivo .env já existe"
else
    cp ".env.example" ".env"
    echo "✓ Arquivo .env criado"
    echo "  Abra .env e atualize DB_PASSWORD se necessário"
fi

# Criar ambiente virtual Python
echo ""
echo "[3/5] Preparando Python..."
if [ -d "venv" ]; then
    echo "✓ Ambiente virtual já existe"
else
    python3 -m venv venv
    echo "✓ Ambiente virtual criado"
fi

# Ativar venv e instalar dependências
echo ""
echo "[4/5] Instalando dependências..."
source venv/bin/activate
pip install -q -r requirements/production.txt
echo "✓ Dependências instaladas"

# Executar migrações
echo ""
echo "[5/5] Executando migrações..."
python manage.py migrate
echo "✓ Migrações completas"

# Resumo
echo ""
echo "========================================"
echo "Setup Concluído!"
echo "========================================"
echo ""
echo "Próximos passos:"
echo "1. Criar superuser: python manage.py createsuperuser"
echo "2. Rodar servidor: python manage.py runserver"
echo "3. Acessar: http://localhost:8000"
echo "4. Admin: http://localhost:8000/admin"
echo ""
echo "Troubleshooting:"
echo "- Se erro de conexão, verificar arquivo .env"
echo "- Se erro de senha, editar .env com credenciais corretas"
echo "- Se erro de psycopg2, rodar: pip install psycopg2-binary"
