# Portfolio AI Server

## Quick Start

### Option 1: Run in foreground (see logs)
```bash
cd server
node index.cjs
```
Keep this terminal open. Press Ctrl+C to stop.

### Option 2: Run in background
```bash
cd server
nohup node index.cjs > server.log 2>&1 &
```
Logs will be in `server.log`. To stop: `pkill -f "node index.cjs"`

### Option 3: Use nodemon (auto-restart on changes)
```bash
cd server
npm run dev
```

## Check if Server is Running

```bash
# Check port
lsof -i :3001

# Test endpoint
curl http://localhost:3001/api/test

# Test health
curl http://localhost:3001/api/ollama-health
```

## Stop Server

```bash
# Find and kill
pkill -f "node index.cjs"

# Or find PID first
lsof -i :3001
kill <PID>
```

## Environment Variables

Create `server/.env`:
```env
PORT=3001
OLLAMA_BASE_URL=http://127.0.0.1:11434
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

## Troubleshooting

- **Port already in use**: Change PORT in .env or kill existing process
- **Ollama offline**: Start Ollama with `ollama serve`
- **CORS errors**: Add your frontend URL to CORS_ORIGINS

