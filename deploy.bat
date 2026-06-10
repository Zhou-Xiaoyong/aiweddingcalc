@echo off
REM deploy.bat - Windows一键部署dist到GitHub
REM 用法: deploy.bat "提交说明"

cd /d "%~dp0"

if "%~1"=="" (
    set MSG=Update: sync dist to GitHub
) else (
    set MSG=%~1
)

git add -A
git status

git diff --cached --quiet
if %errorlevel%==0 (
    echo No changes to deploy.
    exit /b 0
)

git commit -m "%MSG%"
set GIT_SSL_NO_VERIFY=true
git push origin main

echo Deployed successfully!
