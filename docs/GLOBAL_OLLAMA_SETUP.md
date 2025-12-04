# GLOBAL_OLLAMA_SETUP (generated)

## Quick steps to run a global Ollama + Proxy

1. Provision a VM and map DNS (e.g. ollama.yourcompany.com).
2. Install Docker or Ollama natively.
3. Install Ollama and pull models: `ollama pull <model>`
4. Copy the server/ folder to the VM.
5. Create server/.env (see .env.example) and set:
   - OLLAMA_BASE_URL=http://localhost:11434
   - CORS_ORIGINS=https://yourfrontend.com
   - SERVER_API_KEY=secret
6. Start the Node app: `npm install && pm2 start index.cjs` or use Docker compose.
7. Verify: `GET https://api.yourcompany.com/api/ollama-health`

## Notes
- Use HTTPS in production (nginx + certbot).
- Keep port 11434 closed publicly and front it with nginx.
