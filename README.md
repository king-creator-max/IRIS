# IRIS — Intelligent Resource Information System

IRIS is a private AI-assistant website with a protected server-side API key.

## What is upgraded

- NVIDIA-compatible OpenAI API integration
- API key stays on the server
- Owner username/password login
- Signed HTTP-only session cookie
- Rate limiting on API routes
- Security headers
- Mobile-friendly ChatGPT-style interface
- Voice input when supported by the browser
- Easy `.env` configuration
- GitHub-safe `.gitignore`
- Health/status endpoint
- No API key in frontend JavaScript

NVIDIA's current NIM documentation exposes an OpenAI-compatible `/v1/chat/completions` endpoint, which is the interface used by this project.

## 1. Install

Install Node.js 18+.

Then:

```bash
npm install
```

## 2. Configure the API

Copy:

```text
.env.example
```

to:

```text
.env
```

Then change these three values:

```env
AI_API_KEY=YOUR_NVIDIA_API_KEY
AI_MODEL=YOUR_MODEL_ID
SESSION_SECRET=YOUR_LONG_RANDOM_SECRET
```

You can also change:

```env
OWNER_USERNAME=Ujjaval
OWNER_PASSWORD=YOUR_OWNER_PASSWORD
```

The default NVIDIA-compatible base URL is:

```env
AI_BASE_URL=https://integrate.api.nvidia.com/v1
```

## 3. Run

```bash
npm start
```

Open:

```text
http://localhost:3000
```

Sign in with the owner username/password from `.env`.

## 4. IMPORTANT — GitHub

Never commit `.env`.

The `.gitignore` file already excludes it.

Do not put the NVIDIA API key in `public/index.html`.

GitHub Pages is suitable for static frontend files, but this IRIS version needs a Node server because the API key must remain server-side. Deploy the complete Node app to a host that supports Node.js, then connect your custom domain to that host.

## 5. Model

The model must be a model ID supported by the API endpoint/account you are using. If the provider returns a model error, replace `AI_MODEL` with the exact supported model ID.

## 6. Security

The owner password protects access to the AI endpoint, while the API key is kept server-side. Rate limiting provides basic abuse protection, but production deployments should also use HTTPS and strong credentials.

Do not paste your API key into GitHub, screenshots, chat messages, frontend source code, or public configuration files.
