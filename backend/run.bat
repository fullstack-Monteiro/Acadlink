@echo off
REM Script para iniciar o backend Django no Windows

echo.
echo ========================================
echo   AcadLink Backend - Django Server
echo ========================================
echo.

REM Verificar se venv existe
if not exist "venv" (
    echo [1/4] Criando ambiente virtual...
    python -m venv venv
    echo ✓ Ambiente virtual criado
    echo.
)

REM Ativar venv
echo [2/4] Ativando ambiente virtual...
call venv\Scripts\activate.bat
echo ✓ Ambiente virtual ativado
echo.

REM Instalar dependências
echo [3/4] Instalando dependências...
pip install -q -r requirements/base.txt
echo ✓ Dependências instaladas
echo.

REM Executar migrações
echo [4/4] Executando migrações...
python manage.py migrate --noinput
echo ✓ Migrações executadas
echo.

REM Iniciar servidor
echo ========================================
echo   Servidor iniciado em:
echo   http://localhost:8000
echo ========================================
echo.
python manage.py runserver

pause
