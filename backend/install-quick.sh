#!/bin/bash

# Script rápido para instalar dependências mínimas no Linux/Mac

echo ""
echo "========================================"
echo "  AcadLink Backend - Instalação Rápida"
echo "========================================"
echo ""

# Verificar se venv existe
if [ ! -d "venv" ]; then
    echo "[1/3] Criando ambiente virtual..."
    python3 -m venv venv
    echo "✓ Ambiente virtual criado"
    echo ""
fi

# Ativar venv
echo "[2/3] Ativando ambiente virtual..."
source venv/bin/activate
echo "✓ Ambiente virtual ativado"
echo ""

# Instalar dependências mínimas
echo "[3/3] Instalando dependências (versão rápida)..."
pip install -q -r requirements/dev-minimal.txt
echo "✓ Dependências instaladas"
echo ""

echo "========================================"
echo "  Instalação concluída!"
echo "========================================"
echo ""
echo "Próximo passo: python manage.py runserver"
echo ""
