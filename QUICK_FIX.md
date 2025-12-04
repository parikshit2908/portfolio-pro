# 🔧 Quick Fix: Ollama Showing Offline

## The Problem
Your Vite proxy was pointing to Ollama (port 11434) instead of your Express server (port 3001).

## ✅ Solution

### Step 1: Start Your Express Server
Open a terminal and run:
```bash
cd server
node index.cjs
```

You should see:
```
🔥 Server running at http://localhost:3001
```

### Step 2: Keep It Running
**Keep this terminal open!** The server must stay running for the AI to work.

### Step 3: Refresh Your Frontend
Go back to your browser and refresh the AI page. It should now show:
- ✅ Ollama Active (1 models)

## Alternative: Use the Start Script
```bash
./start-server.sh
```

This script will:
- Check if Ollama is running
- Show available models
- Start the Express server

## Why This Happened
- Ollama runs on port **11434** (the AI service)
- Your Express server runs on port **3001** (the API gateway)
- The frontend needs to talk to the Express server, which then talks to Ollama
- The Vite proxy was incorrectly pointing directly to Ollama

## Verify It's Working
1. Server running: `lsof -i :3001` should show node process
2. Ollama running: `curl http://127.0.0.1:11434/api/tags` should return models
3. Health check: `curl http://localhost:3001/api/ollama-health` should return healthy status

