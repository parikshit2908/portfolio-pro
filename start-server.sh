#!/bin/bash
# Start script for the Portfolio AI server

echo "🚀 Starting Portfolio AI Server..."
echo ""

# Check if Ollama is running
echo "Checking Ollama..."
if curl -s http://127.0.0.1:11434/api/tags > /dev/null 2>&1; then
    echo "✅ Ollama is running"
    curl -s http://127.0.0.1:11434/api/tags | grep -o '"name":"[^"]*"' | sed 's/"name":"//g' | sed 's/"//g' | sed 's/^/   Models: /' | head -5
else
    echo "❌ Ollama is NOT running"
    echo "   Start it with: ollama serve"
    echo "   Or open the Ollama app"
    exit 1
fi

echo ""
echo "Starting Express server on port 3001..."
echo ""

cd "$(dirname "$0")/server"
node index.cjs

