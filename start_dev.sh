#!/bin/bash

# Real Estate Investment Tool - Start Development Servers
# This script starts both the Flask backend and React frontend

echo "🏠 Real Estate Investment Tool - Development Setup"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "main.py" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Function to start Flask backend
start_backend() {
    echo "🐍 Starting Flask Backend..."
    cd /home/ravin/Code/RealEstateProblem
    export PYTHONPATH="${PYTHONPATH}:/home/ravin/Code/RealEstateProblem/src"
    source .venv/bin/activate
    python web/app.py &
    BACKEND_PID=$!
    echo "✅ Flask backend started (PID: $BACKEND_PID) - http://localhost:5000"
}

# Function to start React frontend
start_frontend() {
    echo "⚛️  Starting React Frontend..."
    cd /home/ravin/Code/RealEstateProblem/frontend
    npm run dev &
    FRONTEND_PID=$!
    echo "✅ React frontend started (PID: $FRONTEND_PID) - http://localhost:3000"
}

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo "   Stopped Flask backend"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo "   Stopped React frontend"
    fi
    echo "👋 Goodbye!"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start both servers
start_backend
sleep 2
start_frontend

echo ""
echo "🎉 Both servers are starting up!"
echo "📱 React Frontend: http://localhost:3000"
echo "🔧 Flask Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait
