# Troubleshooting: Ollama Health Check 500 Error

## Quick Diagnosis

### Step 1: Check if server is running
```bash
curl http://localhost:3001/api/test
```
Should return: `{"message":"Server is running!","timestamp":"..."}`

If this fails → **Server is not running**. Start it:
```bash
cd server
node index.cjs
```

### Step 2: Test health endpoint directly
```bash
curl http://localhost:3001/api/ollama-health
```
Should return JSON with `status: "healthy"` or `status: "unhealthy"`

### Step 3: Check Ollama directly
```bash
curl http://127.0.0.1:11434/api/tags
```
Should return list of models.

## Common Issues

### Issue 1: Server not running
**Symptom**: `Failed to fetch` or connection refused
**Fix**: Start server with `cd server && node index.cjs`

### Issue 2: Ollama not running  
**Symptom**: Health check returns `status: "unhealthy"`
**Fix**: Start Ollama with `ollama serve` or open Ollama app

### Issue 3: Port conflict
**Symptom**: Server won't start
**Fix**: Change PORT in `server/.env` or kill process on port 3001

### Issue 4: CORS error
**Symptom**: Browser console shows CORS error
**Fix**: Check `CORS_ORIGINS` in server/.env includes your frontend URL

## Debug Steps

1. **Check server logs** - Look for error messages when health check is called
2. **Check browser console** - Look for the actual error message
3. **Test endpoints manually** - Use curl to isolate the issue
4. **Verify Ollama** - Make sure Ollama is actually running

## Expected Behavior

- ✅ Server running → `/api/test` returns JSON
- ✅ Ollama running → `/api/ollama-health` returns `status: "healthy"`
- ✅ Frontend → Shows "✅ Ollama Active"

If any step fails, check the error message for specific guidance.

