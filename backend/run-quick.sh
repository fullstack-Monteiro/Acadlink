#!/bin/bash

# Script rápido para rodar backend com dependências mínimas

echo ""
echo "========================================"
echo "  AcadLink Backend - Execução Rápida"
echo "========================================"
echo ""

# Verificar se venv existe
if [ ! -d "venv" ]; then
    echo "[1/4] Criando ambiente virtual..."
    python3 -m venv venv
    echo "✓ Ambiente virtual criado"
    echo ""
fi

# Ativar venv
echo "[2/4] Ativando ambiente virtual..."
source venv/bin/activate
echo "✓ Ambiente virtual ativado"
echo ""

# Instalar dependências mínimas
echo "[3/4] Instalando dependências (versão rápida)..."
pip install -q -r requirements/dev-minimal.txt
echo "✓ Dependências instaladas"
echo ""

# Executar migrações
echo "[4/4] Executando migrações..."
python manage.py migrate --noinput
echo "✓ Migrações executadas"
echo ""

# Iniciar servidor
echo "========================================"
echo "  Servidor iniciado em:"
echo "  http://localhost:8000"
echo "========================================"
echo ""
python manage.py runserver
