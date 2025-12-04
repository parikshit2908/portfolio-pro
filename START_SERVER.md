# How to Start the Server

## Quick Start

1. **Start Ollama** (if not already running):
   ```bash
   ollama serve
   ```
   In another terminal, verify it's working:
   ```bash
   ollama list
   ```

2. **Start the Express Server**:
   ```bash
   cd server
   node index.cjs
   ```
   
   Or use nodemon for auto-reload:
   ```bash
   cd server
   npm run dev
   ```

3. **Start the Frontend** (in another terminal):
   ```bash
   npm run dev
   ```

## Check Ollama Status

Run the diagnostic script:
```bash
./check-ollama.sh
```

Or manually test:
```bash
curl http://127.0.0.1:11434/api/tags
```

## Troubleshooting

### Ollama shows offline:
1. Check if Ollama is running: `curl http://127.0.0.1:11434/api/tags`
2. If not, start it: `ollama serve`
3. Make sure you have at least one model: `ollama pull mistral`
4. Check server logs for connection errors

### Server won't start:
1. Make sure you're in the `server/` directory
2. Check if port 3001 is already in use
3. Verify all dependencies are installed: `npm install` (in root directory)

### CORS errors:
- Make sure your frontend URL is in `CORS_ORIGINS` env var or defaults
- Default includes: localhost:5173, localhost:5174

## Environment Variables

Create `server/.env` (optional):
```env
PORT=3001
OLLAMA_BASE_URL=http://127.0.0.1:11434
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

