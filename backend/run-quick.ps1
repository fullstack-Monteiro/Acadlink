# Script PowerShell para iniciar backend rápido no Windows

Write-Host ""
Write-Host "========================================"
Write-Host "  AcadLink Backend - Execução Rápida"
Write-Host "========================================"
Write-Host ""

# Verificar se venv existe
if (-not (Test-Path "venv")) {
    Write-Host "[1/4] Criando ambiente virtual..."
    python -m venv venv
    Write-Host "✓ Ambiente virtual criado"
    Write-Host ""
}

# Ativar venv
Write-Host "[2/4] Ativando ambiente virtual..."
& ".\venv\Scripts\Activate.ps1"
Write-Host "✓ Ambiente virtual ativado"
Write-Host ""

# Instalar dependências mínimas
Write-Host "[3/4] Instalando dependências (versão rápida)..."
pip install -q -r requirements/dev-minimal.txt
Write-Host "✓ Dependências instaladas"
Write-Host ""

# Executar migrações
Write-Host "[4/4] Executando migrações..."
python manage.py migrate --noinput
Write-Host "✓ Migrações executadas"
Write-Host ""

# Iniciar servidor
Write-Host "========================================"
Write-Host "  Servidor iniciado em:"
Write-Host "  http://localhost:8000"
Write-Host "========================================"
Write-Host ""
python manage.py runserver
