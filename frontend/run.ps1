# Script PowerShell para iniciar frontend no Windows

Write-Host ""
Write-Host "========================================"
Write-Host "  AcadLink Frontend - React + Vite"
Write-Host "========================================"
Write-Host ""

# Verificar se node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "[1/2] Instalando dependências..."
    npm install
    Write-Host "✓ Dependências instaladas"
    Write-Host ""
}

# Iniciar servidor
Write-Host "[2/2] Iniciando servidor de desenvolvimento..."
Write-Host ""
Write-Host "========================================"
Write-Host "  Servidor iniciado em:"
Write-Host "  http://localhost:3000"
Write-Host "========================================"
Write-Host ""
npm run dev
