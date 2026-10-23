# Script para configurar e rodar o sistema

Write-Host "🚀 Iniciando setup do AcadLink..." -ForegroundColor Green

# Verificar se estamos no diretório correto
if (-not (Test-Path "backend")) {
    Write-Host "❌ Erro: Diretório 'backend' não encontrado" -ForegroundColor Red
    exit 1
}

# Ativar venv
Write-Host "📦 Ativando ambiente virtual..." -ForegroundColor Yellow
$venvPath = ".\.venv\Scripts\Activate.ps1"
if (Test-Path $venvPath) {
    & $venvPath
} else {
    Write-Host "❌ Ambiente virtual não encontrado em $venvPath" -ForegroundColor Red
    exit 1
}

# Ir para backend
cd backend

# Executar migration
Write-Host "🔄 Executando migrations..." -ForegroundColor Yellow
python manage.py migrate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao executar migrations" -ForegroundColor Red
    exit 1
}

# Popular universidades
Write-Host "📚 Populando universidades..." -ForegroundColor Yellow
python manage.py populate_universities
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao popular universidades" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Setup concluído com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Abrir Terminal 1: cd backend && python manage.py runserver" -ForegroundColor White
Write-Host "2. Abrir Terminal 2: cd acadlink && npm run dev" -ForegroundColor White
Write-Host "3. Acessar http://localhost:3000" -ForegroundColor White
