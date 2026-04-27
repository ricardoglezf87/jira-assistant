@echo off
setlocal

set "ROOT=%~dp0"
set "NODE_DIR=%ROOT%nodejs"
set "NODE_EXE=%NODE_DIR%\node.exe"
set "NPM_CMD=%NODE_DIR%\npm.cmd"

cd /d "%ROOT%"

if not exist "%NODE_EXE%" (
    echo No se encontro Node.js portable en:
    echo %NODE_EXE%
    goto :error
)

if not exist "%NPM_CMD%" (
    echo No se encontro npm portable en:
    echo %NPM_CMD%
    goto :error
)

set "PATH=%NODE_DIR%;%NODE_DIR%\node_modules\npm\bin;%PATH%"

echo Usando Node:
"%NODE_EXE%" --version
echo.

echo Usando npm:
call "%NPM_CMD%" --version
echo.

if not exist "%ROOT%node_modules\" (
    echo Instalando dependencias...
    call "%NPM_CMD%" install --force
    if errorlevel 1 goto :error
) else (
    echo Dependencias ya instaladas. Saltando npm install.
)

echo.
echo Compilando extension...
call "%NPM_CMD%" run build
if errorlevel 1 goto :error

echo.
echo Build finalizado correctamente.
echo Puedes cargar la extension desde:
echo %ROOT%build\chrome
echo.
pause
exit /b 0

:error
echo.
echo El build no se pudo completar.
pause
exit /b 1
