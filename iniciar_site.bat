@echo off
setlocal
cd /d "%~dp0"
set "PORT=3001"
set "YARN_VERSION=4.18.1"

if not exist "node_modules\.bin\next.cmd" (
    echo Instalando dependencias do site...
    call corepack yarn@%YARN_VERSION% install
    if errorlevel 1 goto install_failed
)

echo Iniciando o site em http://localhost:%PORT%
call corepack yarn@%YARN_VERSION% dev --port %PORT%
pause
exit /b

:install_failed
echo Falha ao instalar as dependencias. Verifique a mensagem acima.
pause
exit /b 1