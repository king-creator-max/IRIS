const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const AI_API_KEY = process.env.AI_API_KEY;
const AI_MODEL = process.env.AI_MODEL || 'meta/llama-3.1-8b-instruct';
const AI_BASE_URL = process.env.AI_BASE_URL || 'https://integrate.api.nvidia.com/v1';
const SESSION_SECRET = process.env.SESSION_SECRET || 'fallback-secret-key';
const OWNER_USERNAME = process.env.OWNER_USERNAME || 'Ujjaval';
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || 'admin123';

app.use(express.json());
app.use(cookieParser(SESSION_SECRET));
app.use(express.static(path.join(__dirname)));

function requireAuth(req, res, next) {
  if (req.signedCookies.auth_user === OWNER_USERNAME) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized. Please log in.' });
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    configured: Boolean(AI_API_KEY && AI_MODEL)
  });
});

app.get('/api/me', requireAuth, (req, res) => {
  res.json({ username: OWNER_USERNAME });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === OWNER_USERNAME && password === OWNER_PASSWORD) {
    res.cookie('auth_user', OWNER_USERNAME, {
      httpOnly: true,
      signed: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return res.json({ success: true });
  }
  return res.status(401).json({ error: 'Invalid username or password' });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('auth_user');
  res.json({ success: true });
});

app.post('/api/chat', requireAuth, async (req, res) => {
  const { messages } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages list is required' });
  }

  if (!AI_API_KEY) {
    return res.status(500).json({ error: 'AI_API_KEY is not configured on the server' });
  }

  try {
    const response = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data.error?.message || data.error || 'Provider API error';
      return res.status(response.status).json({ error: errMsg });
    }

    const answer = data.choices?.[0]?.message?.content || 'No response generated.';
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`IRIS server running on port ${PORT}`);
});
