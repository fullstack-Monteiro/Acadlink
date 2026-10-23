# Script completo para setup e rodar backend

Write-Host ""
Write-Host "========================================"
Write-Host "  AcadLink Backend - Setup Completo"
Write-Host "========================================"
Write-Host ""

# Passo 1: Criar venv se não existir
if (-not (Test-Path "venv")) {
    Write-Host "[1/5] Criando ambiente virtual..."
    python -m venv venv
    Write-Host "✓ Ambiente virtual criado"
} else {
    Write-Host "[1/5] Ambiente virtual já existe"
}
Write-Host ""

# Passo 2: Ativar venv
Write-Host "[2/5] Ativando ambiente virtual..."
& ".\venv\Scripts\Activate.ps1"
Write-Host "✓ Ambiente virtual ativado"
Write-Host ""

# Passo 3: Instalar dependências
Write-Host "[3/5] Instalando dependências..."
pip install -q -r requirements/dev-minimal-flexible.txt
Write-Host "✓ Dependências instaladas"
Write-Host ""

# Passo 4: Executar migrações
Write-Host "[4/5] Executando migrações..."
python manage.py migrate --noinput
Write-Host "✓ Migrações executadas"
Write-Host ""

# Passo 5: Iniciar servidor
Write-Host "[5/5] Iniciando servidor..."
Write-Host ""
Write-Host "========================================"
Write-Host "  Servidor iniciado em:"
Write-Host "  http://localhost:8000"
Write-Host "========================================"
Write-Host ""
python manage.py runserver
