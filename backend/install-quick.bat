@echo off
REM Script rápido para instalar dependências mínimas no Windows

echo.
echo ========================================
echo   AcadLink Backend - Instalação Rápida
echo ========================================
echo.

REM Verificar se venv existe
if not exist "venv" (
    echo [1/3] Criando ambiente virtual...
    python -m venv venv
    echo ✓ Ambiente virtual criado
    echo.
)

REM Ativar venv
echo [2/3] Ativando ambiente virtual...
call venv\Scripts\activate.bat
echo ✓ Ambiente virtual ativado
echo.

REM Instalar dependências mínimas
echo [3/3] Instalando dependências (versão rápida)...
pip install -q -r requirements/dev-minimal.txt
echo ✓ Dependências instaladas
echo.

echo ========================================
echo   Instalação concluída!
echo ========================================
echo.
echo Próximo passo: python manage.py runserver
echo.

pause
