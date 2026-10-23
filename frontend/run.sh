#!/bin/bash

# Script para iniciar o frontend React no Linux/Mac

echo ""
echo "========================================"
echo "  AcadLink Frontend - React + Vite"
echo "========================================"
echo ""

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "[1/2] Instalando dependências..."
    npm install
    echo "✓ Dependências instaladas"
    echo ""
fi

# Iniciar servidor
echo "[2/2] Iniciando servidor de desenvolvimento..."
echo ""
echo "========================================"
echo "  Servidor iniciado em:"
echo "  http://localhost:3000"
echo "========================================"
echo ""
npm run dev
