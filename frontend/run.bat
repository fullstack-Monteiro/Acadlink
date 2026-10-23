@echo off
REM Script para iniciar o frontend React no Windows

echo.
echo ========================================
echo   AcadLink Frontend - React + Vite
echo ========================================
echo.

REM Verificar se node_modules existe
if not exist "node_modules" (
    echo [1/2] Instalando dependências...
    call npm install
    echo ✓ Dependências instaladas
    echo.
)

REM Iniciar servidor
echo [2/2] Iniciando servidor de desenvolvimento...
echo.
echo ========================================
echo   Servidor iniciado em:
echo   http://localhost:3000
echo ========================================
echo.
call npm run dev

pause
