<<<<<<< HEAD
# AI Prompt Playground

An interactive web app for experimenting with the Google Gemini API — write a prompt, tune parameters like temperature and output length, and see the AI's response rendered live. Includes prompt templates, history, and copy-to-clipboard.

## Tech stack
- **Frontend:** HTML, CSS, vanilla JavaScript
- **Backend:** Node.js + Express (acts as a secure proxy to the Gemini API)
- **AI:** Google Gemini API (`gemini-2.0-flash`)

## Why a backend?
The Gemini API key must never be exposed in browser JavaScript — anyone could view your page source and steal it. This project uses a small Express server to hold the key privately and forward requests to Gemini on the frontend's behalf.

## Setup

### 1. Get a Gemini API key
Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and create a free API key.

### 2. Install dependencies
```bash
npm install
```

### 3. Add your API key
Copy `.env.example` to `.env` and paste in your key:
```bash
cp .env.example .env
```
Then edit `.env`:
```
GEMINI_API_KEY=your_actual_key_here
```

### 4. Run the app
```bash
npm start
```
Open **http://localhost:3000** in your browser.

## Project structure
```
ai-prompt-playground/
├── server.js           # Express backend — proxies requests to Gemini
├── package.json
├── .env.example        # Template for your API key
├── public/
│   ├── index.html       # UI layout
│   ├── style.css        # Dark-themed styling
│   └── app.js            # Frontend logic (fetch calls, history, templates)
└── README.md
```

## Features
- Prompt input with adjustable **temperature** and **max output length**
- Quick-start **prompt templates** (summarize, translate, explain simply, etc.)
- **Prompt history** saved in the browser (localStorage)
- **Markdown rendering** of AI responses (code blocks, lists, etc.)
- Copy-to-clipboard for responses
- Loading states and error handling

## Ideas to extend it
- Add streaming responses (Gemini supports `streamGenerateContent`)
- Add a model picker (e.g. `gemini-2.0-flash` vs `gemini-1.5-pro`)
- Persist history to a database instead of localStorage
- Add user accounts and saved "playgrounds"
- Deploy the frontend to Vercel/Netlify and the backend to Render/Railway

## Deployment notes
- Set `GEMINI_API_KEY` as an environment variable on your host — never commit `.env`.
- If you deploy frontend and backend separately, update `API_URL` in `public/app.js` to point to your backend's full URL.
=======
# AI-Prompt-Playground
An interactive web app for experimenting with the Google Gemini API to tune prompts, adjust parameters, and see AI responses live.
>>>>>>> bb59a6be1f541c684174c19bd9dbfa45a4be4346
