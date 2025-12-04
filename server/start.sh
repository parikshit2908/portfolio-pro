#!/bin/bash
# Start the Portfolio AI server

cd "$(dirname "$0")"

echo "🚀 Starting Portfolio AI Server..."
echo ""

# Check if server is already running
if lsof -i :3001 > /dev/null 2>&1; then
    echo "⚠️  Server is already running on port 3001"
    echo "   To stop it: pkill -f 'node index.cjs'"
    echo "   Or use: lsof -i :3001 to find the PID"
    exit 1
fi

# Check if Ollama is running
echo "Checking Ollama..."
if curl -s http://127.0.0.1:11434/api/tags > /dev/null 2>&1; then
    echo "✅ Ollama is running"
else
    echo "⚠️  Ollama is not running"
    echo "   Start it with: ollama serve"
    echo "   Or open the Ollama app"
fi

echo ""
echo "Starting server..."
echo "Press Ctrl+C to stop"
echo ""

node index.cjs

