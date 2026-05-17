require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const { getAnswer } = require('./chatbot');

const app = express();
const port = process.env.PORT || 5000;

// ── Body parsing ────────────────────────────────────────────
app.use(express.json());

// ── CORS ────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://jecrc-gpt.vercel.app', // update this once you deploy
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || ALLOWED_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// ── Rate limiting ───────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute window
  max: 15,                   // max 15 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please wait a moment before trying again.'
  }
});

app.use('/chat', limiter);

// ── Health check ────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('JECRC GPT API is running 🚀');
});

// ── Chat route ──────────────────────────────────────────────
app.post('/chat', async (req, res) => {
  const { query } = req.body;

  // Input validation
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query is required.' });
  }

  const trimmed = query.trim();

  if (trimmed.length === 0) {
    return res.status(400).json({ error: 'Query cannot be empty.' });
  }

  if (trimmed.length > 500) {
    return res.status(400).json({
      error: 'Query is too long. Please keep it under 500 characters.'
    });
  }

  // Basic sanitization — strip HTML tags if anyone tries injection
  const sanitized = trimmed.replace(/<[^>]*>/g, '');

  try {
    const answer = await getAnswer(sanitized);
    res.json({ response: answer });
  } catch (err) {
    console.error('Error in /chat:', err.message);
    res.status(500).json({
      error: 'Something went wrong. Please try again in a moment.'
    });
  }
});

// ── Start ───────────────────────────────────────────────────
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});