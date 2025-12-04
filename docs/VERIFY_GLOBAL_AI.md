# Verify Your Global AI is Active

## Quick Check in Frontend

1. **Dashboard**: Look for the AI status badge in the top-right corner
   - ✅ Green dot = AI Active
   - ❌ Red dot = AI Offline
   - ⏳ Yellow dot = Checking...

2. **Ask AI Page**: The status indicator shows:
   - Connection status
   - Number of available models
   - Whether you're using local proxy or global API

## Test via Browser Console

Open your browser console (F12) and run:

```javascript
fetch('/api/ollama-health')
  .then(r => r.json())
  .then(data => {
    console.log('Status:', data.status);
    console.log('Models:', data.models?.map(m => m.name));
    console.log('Ollama:', data.ollama);
  });
```

## Test via Command Line

```bash
# Test local proxy (default)
node test-ai-connection.js

# Test global API
VITE_API_BASE_URL=https://api.yourcompany.com node test-ai-connection.js
```

## Expected Response

```json
{
  "status": "healthy",
  "ollama": "running",
  "models": [
    { "name": "mistral", "size": 4100000000, ... },
    { "name": "llama2", "size": 3800000000, ... }
  ],
  "availableModels": ["llama2", "mistral", "codellama"]
}
```

## Troubleshooting

### ❌ "Connection failed" or CORS error
- Check `CORS_ORIGINS` in `server/.env` includes your frontend URL
- Verify server is running: `cd server && node index.cjs`

### ❌ "Ollama not running"
- Check `OLLAMA_BASE_URL` in `server/.env`
- If using global API, ensure the remote Ollama service is accessible
- Test Ollama directly: `curl http://your-ollama-host:11434/api/tags`

### ⚠️ "No models available"
- Pull models on the Ollama host: `ollama pull mistral`
- Verify models are listed: `ollama list`

## Environment Variables

**Frontend** (`.env`):
```env
VITE_API_BASE_URL=https://api.yourcompany.com
```

**Backend** (`server/.env`):
```env
OLLAMA_BASE_URL=http://localhost:11434
# OR for remote:
OLLAMA_BASE_URL=http://ollama.yourcompany.com:11434
CORS_ORIGINS=https://portfolio.yourcompany.com,http://localhost:5173
```

## Success Indicators

✅ Dashboard shows "AI Active (X models)"  
✅ Ask AI page shows healthy status with model selector  
✅ Test script returns `status: "healthy"`  
✅ You can send prompts and get responses  

Your global AI is ready for your team! 🚀



