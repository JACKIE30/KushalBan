#!/bin/bash

# BanRakshak Backend Startup Script

echo "🚀 Starting BanRakshak Backend Server..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies if requirements.txt is newer than last install
if [ requirements.txt -nt venv/pyvenv.cfg ] || [ ! -f "venv/.deps_installed" ]; then
    echo "Installing/updating dependencies..."
    pip install --upgrade pip
    pip install -r requirements.txt
    
    # Try to install spaCy model
    echo "Installing spaCy English model..."
    python -m spacy download en_core_web_sm || echo "Warning: Could not install spaCy model automatically"
    
    # Mark dependencies as installed
    touch venv/.deps_installed
fi

# Create uploads directory if it doesn't exist
mkdir -p uploads

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Please create one with your API keys."
fi

# Start the server
echo "Starting FastAPI server on http://localhost:8000"
echo "API Documentation available at http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Use the correct uvicorn command
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
