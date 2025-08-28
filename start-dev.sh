#!/bin/bash

# StaticFruit Development Startup Script
# Run this after completing Supabase setup

echo "🚀 Starting StaticFruit Development Environment..."
echo "=================================================="

# Check if we're in the right directory
if [ ! -d "staticfruit_kit" ] || [ ! -d "staticfruit_next_starter" ]; then
    echo "❌ Error: Please run this script from the StaticFruit project root directory"
    exit 1
fi

# Check if environment files exist
if [ ! -f "staticfruit_kit/.env" ]; then
    echo "❌ Error: staticfruit_kit/.env not found. Please copy .env.template and configure it."
    exit 1
fi

if [ ! -f "staticfruit_next_starter/.env.local" ]; then
    echo "❌ Error: staticfruit_next_starter/.env.local not found. Please copy .env.local.example and configure it."
    exit 1
fi

echo "✅ Environment files found"

# Check if SUPABASE_SERVICE_ROLE_KEY is set
if ! grep -q "your_service_role_key_here" staticfruit_kit/.env; then
    echo "✅ Supabase service role key appears to be configured"
else
    echo "⚠️  Warning: Please make sure to set your actual SUPABASE_SERVICE_ROLE_KEY in staticfruit_kit/.env"
fi

# Install Python dependencies for graph generation
echo "📦 Installing Python dependencies for graph generation..."
cd staticfruit_kit/graphs
if command -v pip &> /dev/null; then
    pip install -r requirements.txt
    echo "✅ Python dependencies installed"
else
    echo "⚠️  Warning: pip not found. Please install Python dependencies manually:"
    echo "   cd staticfruit_kit/graphs && pip install -r requirements.txt"
fi
cd ../..

echo ""
echo "🎯 Starting development servers..."
echo "=================================="

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down development servers..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start API server in background
echo "🔧 Starting Fastify API server on http://localhost:8787..."
cd staticfruit_kit
npm run dev &
API_PID=$!
cd ..

# Wait a moment for API server to start
sleep 3

# Start frontend in background
echo "⚛️  Starting Next.js frontend on http://localhost:3000..."
cd staticfruit_next_starter
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 Development servers started successfully!"
echo "=========================================="
echo "📱 Frontend: http://localhost:3000"
echo "🔌 API Server: http://localhost:8787"
echo ""
echo "📊 To test graph generation:"
echo "   cd staticfruit_kit/graphs && python test_graphs.py"
echo ""
echo "🛑 Press Ctrl+C to stop all servers"

# Wait for background processes
wait