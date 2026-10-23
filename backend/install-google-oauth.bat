@echo off
REM Script para instalar dependências do Google OAuth
REM AcadLink - 2026

echo 🔐 Instalando dependências do Google OAuth...

REM Ativar virtual environment se existir
if exist "venv\Scripts\activate.bat" (
    echo ✓ Ativando virtual environment...
    call venv\Scripts\activate.bat
) else if exist ".venv\Scripts\activate.bat" (
    echo ✓ Ativando virtual environment...
    call .venv\Scripts\activate.bat
)

REM Instalar dependências
echo 📦 Instalando pacotes...
pip install requests==2.31.0
pip install google-auth==2.23.0
pip install google-auth-oauthlib==1.1.0
pip install google-auth-httplib2==0.1.1

echo.
echo ✅ Dependências instaladas com sucesso!
echo.
echo 📝 Próximos passos:
echo   1. Configure VITE_GOOGLE_CLIENT_ID no frontend/.env
echo   2. Inicie o servidor: python manage.py runserver
echo   3. Teste em: http://localhost:3000/login
echo.
pause
