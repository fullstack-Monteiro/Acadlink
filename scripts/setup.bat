@echo off
REM Script para configurar e rodar o AcadLink no Windows

echo.
echo ========================================
echo   AcadLink - Setup Inicial
echo ========================================
echo.

REM Verificar se estamos no diretório correto
if not exist "backend" (
    echo Erro: Diretorio 'backend' nao encontrado
    pause
    exit /b 1
)

REM Ir para backend
cd backend

REM Executar migration
echo.
echo [1/2] Executando migrations...
echo.
python manage.py migrate
if errorlevel 1 (
    echo Erro ao executar migrations
    pause
    exit /b 1
)

REM Popular universidades
echo.
echo [2/2] Populando universidades...
echo.
python manage.py populate_universities
if errorlevel 1 (
    echo Erro ao popular universidades
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Setup concluido com sucesso!
echo ========================================
echo.
echo Proximos passos:
echo.
echo 1. Abrir Terminal 1:
echo    cd backend
echo    python manage.py runserver
echo.
echo 2. Abrir Terminal 2:
echo    cd acadlink
echo    npm run dev
echo.
echo 3. Acessar http://localhost:3000
echo.
pause
