#!/bin/bash
# Quick script to check if Ollama is running

echo "🔍 Checking Ollama connection..."
echo ""

# Check if Ollama is running
if curl -s http://127.0.0.1:11434/api/tags > /dev/null 2>&1; then
    echo "✅ Ollama is running!"
    echo ""
    echo "Available models:"
    curl -s http://127.0.0.1:11434/api/tags | grep -o '"name":"[^"]*"' | sed 's/"name":"//g' | sed 's/"//g' | sed 's/^/  - /'
else
    echo "❌ Ollama is NOT running"
    echo ""
    echo "To start Ollama:"
    echo "  1. Install: curl -fsSL https://ollama.com/install.sh | sh"
    echo "  2. Start: ollama serve"
    echo "  3. Pull a model: ollama pull mistral"
fi

echo ""
echo "Testing server health endpoint..."
if curl -s http://localhost:3001/api/ollama-health > /dev/null 2>&1; then
    echo "✅ Server is running and responding"
    curl -s http://localhost:3001/api/ollama-health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:3001/api/ollama-health
else
    echo "❌ Server is not running"
    echo "Start it with: cd server && node index.cjs"
fi

