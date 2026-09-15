// server.js
// Backend proxy for the Gemini API.
// Keeps the API key on the server so it's never exposed in the browser.

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // serves the frontend

const GEMINI_MODEL = 'gemini-3.6-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

app.post('/api/generate', async (req, res) => {
  const { prompt, temperature = 0.7, maxOutputTokens = 1024 } = req.body;

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY. Add it to your .env file.' });
  }

  try {
    const response = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: Number(temperature),
          maxOutputTokens: Number(maxOutputTokens)
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', data);
      return res.status(response.status).json({ error: data.error?.message || 'Gemini API request failed.' });
    }

    const text = data.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
    res.json({ text, raw: data });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Something went wrong contacting Gemini.' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', keyConfigured: !!process.env.GEMINI_API_KEY });
});

app.listen(PORT, () => {
  console.log(`\n🚀 AI Prompt Playground running at http://localhost:${PORT}\n`);
});
