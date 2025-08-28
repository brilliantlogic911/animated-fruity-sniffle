@echo off
REM StaticFruit Development Startup Script (Windows)
REM Run this after completing Supabase setup

echo 🚀 Starting StaticFruit Development Environment...
echo ==================================================

REM Check if we're in the right directory
if not exist "staticfruit_kit" (
    echo ❌ Error: Please run this script from the StaticFruit project root directory
    pause
    exit /b 1
)

if not exist "staticfruit_next_starter" (
    echo ❌ Error: Please run this script from the StaticFruit project root directory
    pause
    exit /b 1
)

REM Check if environment files exist
if not exist "staticfruit_kit\.env" (
    echo ❌ Error: staticfruit_kit\.env not found. Please copy .env.template and configure it.
    pause
    exit /b 1
)

if not exist "staticfruit_next_starter\.env.local" (
    echo ❌ Error: staticfruit_next_starter\.env.local not found. Please copy .env.local.example and configure it.
    pause
    exit /b 1
)

echo ✅ Environment files found

REM Check if Python dependencies need installation
echo 📦 Checking Python dependencies...
cd staticfruit_kit\graphs
if exist requirements.txt (
    python -m pip install -r requirements.txt 2>nul
    if %errorlevel% equ 0 (
        echo ✅ Python dependencies installed
    ) else (
        echo ⚠️  Warning: Could not install Python dependencies. Please install manually:
        echo    cd staticfruit_kit\graphs ^&^& pip install -r requirements.txt
    )
) else (
    echo ⚠️  Warning: requirements.txt not found in graphs directory
)
cd ..\..

echo.
echo 🎯 Starting development servers...
echo ==================================

REM Start API server in new command window
echo 🔧 Starting Fastify API server on http://localhost:8787...
start "StaticFruit API Server" cmd /k "cd staticfruit_kit && npm run dev"

REM Wait a moment for API server to start
timeout /t 5 /nobreak >nul

REM Start frontend in new command window
echo ⚛️  Starting Next.js frontend on http://localhost:3000...
start "StaticFruit Frontend" cmd /k "cd staticfruit_next_starter && npm run dev"

echo.
echo 🎉 Development servers started successfully!
echo ==========================================
echo 📱 Frontend: http://localhost:3000
echo 🔌 API Server: http://localhost:8787
echo.
echo 📊 To test graph generation in a new terminal:
echo    cd staticfruit_kit\graphs ^&^& python test_graphs.py
echo.
echo 🛑 Close the command windows to stop the servers
echo.
pause