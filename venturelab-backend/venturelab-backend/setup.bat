@echo off
echo ========================================
echo DreamCraft Backend - Quick Setup
echo ========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not in PATH
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo [1/4] Stopping any existing containers...
docker-compose down

echo.
echo [2/4] Building Docker images...
docker-compose build

echo.
echo [3/4] Starting database and API...
docker-compose up -d

echo.
echo [4/4] Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Backend API is running at: http://localhost:3000
echo.
echo Test it with:
echo   curl http://localhost:3000/health
echo.
echo View logs with:
echo   docker-compose logs -f api
echo.
echo Stop services with:
echo   docker-compose down
echo.
pause
