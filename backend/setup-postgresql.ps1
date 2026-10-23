# Setup PostgreSQL for AcadLink
# Execute como Admin no PowerShell

Write-Host "========================================" -ForegroundColor Green
Write-Host "AcadLink PostgreSQL Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Verificar se PostgreSQL está instalado
Write-Host "`n[1/5] Verificando PostgreSQL..." -ForegroundColor Yellow
$pgPath = "C:\Program Files\PostgreSQL\bin\psql.exe"

if (Test-Path $pgPath) {
    Write-Host "✓ PostgreSQL encontrado" -ForegroundColor Green
} else {
    Write-Host "✗ PostgreSQL não encontrado. Instale em: https://www.postgresql.org/download/windows/" -ForegroundColor Red
    exit
}

# Criar arquivo .env se não existir
Write-Host "`n[2/5] Configurando variáveis de ambiente..." -ForegroundColor Yellow
$envFile = ".\.env"

if (Test-Path $envFile) {
    Write-Host "✓ Arquivo .env já existe" -ForegroundColor Green
} else {
    Copy-Item ".\.env.example" ".\.env"
    Write-Host "✓ Arquivo .env criado a partir de .env.example" -ForegroundColor Green
    Write-Host "  Abra .env e atualize DB_PASSWORD se necessário" -ForegroundColor Cyan
}

# Criar ambiente virtual Python
Write-Host "`n[3/5] Preparando Python..." -ForegroundColor Yellow

if (Test-Path ".\venv") {
    Write-Host "✓ Ambiente virtual já existe" -ForegroundColor Green
} else {
    python -m venv venv
    Write-Host "✓ Ambiente virtual criado" -ForegroundColor Green
}

# Ativar venv e instalar dependências
Write-Host "`n[4/5] Instalando dependências..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"
pip install -q -r requirements/production.txt
Write-Host "✓ Dependências instaladas" -ForegroundColor Green

# Executar migrações
Write-Host "`n[5/5] Executando migrações..." -ForegroundColor Yellow
python manage.py migrate
Write-Host "✓ Migrações completas" -ForegroundColor Green

# Resumo
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Setup Concluído!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nPróximos passos:" -ForegroundColor Yellow
Write-Host "1. Criar superuser: python manage.py createsuperuser"
Write-Host "2. Rodar servidor: python manage.py runserver"
Write-Host "3. Acessar: http://localhost:8000"
Write-Host "4. Admin: http://localhost:8000/admin"
Write-Host "`nTroubleshooting:" -ForegroundColor Cyan
Write-Host "- Se erro de conexão, verificar arquivo .env"
Write-Host "- Se erro de senha, editar .env com credenciais corretas"
Write-Host "- Se erro de psycopg2, rodar: pip install psycopg2-binary"
