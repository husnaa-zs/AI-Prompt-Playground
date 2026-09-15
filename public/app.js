const promptEl = document.getElementById('prompt');
const submitBtn = document.getElementById('submit');
const submitText = document.getElementById('submitText');
const spinner = document.getElementById('spinner');
const outputEl = document.getElementById('output');
const errorBox = document.getElementById('errorBox');
const clearPromptBtn = document.getElementById('clearPrompt');
const copyBtn = document.getElementById('copyBtn');
const tempSlider = document.getElementById('temperature');
const tempValue = document.getElementById('tempValue');
const tokensSlider = document.getElementById('maxTokens');
const tokensValue = document.getElementById('tokensValue');
const historyEl = document.getElementById('history');
const clearHistoryBtn = document.getElementById('clearHistory');
const templateBtns = document.querySelectorAll('.template-btn');

const API_URL = '/api/generate';
const HISTORY_KEY = 'ai_playground_history';

let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');

// --- Slider labels ---
tempSlider.addEventListener('input', () => (tempValue.textContent = tempSlider.value));
tokensSlider.addEventListener('input', () => (tokensValue.textContent = tokensSlider.value));

// --- Templates ---
templateBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    promptEl.value = btn.dataset.template;
    promptEl.focus();
    promptEl.setSelectionRange(promptEl.value.length, promptEl.value.length);
  });
});

// --- Clear prompt ---
clearPromptBtn.addEventListener('click', () => {
  promptEl.value = '';
  promptEl.focus();
});

// --- Submit ---
submitBtn.addEventListener('click', generate);
promptEl.addEventListener('keydown', e => {
  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) generate();
});

async function generate() {
  const prompt = promptEl.value.trim();
  if (!prompt) {
    showError('Please enter a prompt.');
    return;
  }

  setLoading(true);
  hideError();
  copyBtn.classList.add('hidden');

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        temperature: tempSlider.value,
        maxOutputTokens: tokensSlider.value
      })
    });

    const data = await res.json();

    if (!res.ok) {
      showError(data.error || 'Something went wrong.');
      return;
    }

    renderOutput(data.text);
    addToHistory(prompt, data.text);

  } catch (err) {
    showError('Could not reach the server. Is it running?');
  } finally {
    setLoading(false);
  }
}

function renderOutput(text) {
  outputEl.innerHTML = window.marked ? marked.parse(text) : text;
  copyBtn.classList.remove('hidden');
  copyBtn.dataset.text = text;
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitText.textContent = isLoading ? 'Generating...' : 'Generate';
  spinner.classList.toggle('hidden', !isLoading);
}

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.remove('hidden');
}

function hideError() {
  errorBox.classList.add('hidden');
}

// --- Copy button ---
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(copyBtn.dataset.text || '');
  copyBtn.textContent = '✅ Copied';
  setTimeout(() => (copyBtn.textContent = '📋 Copy'), 1500);
});

// --- History ---
function addToHistory(prompt, response) {
  history.unshift({ prompt, response, time: Date.now() });
  history = history.slice(0, 20); // cap at 20
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  if (history.length === 0) {
    historyEl.innerHTML = '<p class="empty-state">No prompts yet</p>';
    return;
  }
  historyEl.innerHTML = '';
  history.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.textContent = item.prompt;
    div.title = item.prompt;
    div.addEventListener('click', () => {
      promptEl.value = item.prompt;
      renderOutput(item.response);
    });
    historyEl.appendChild(div);
  });
}

clearHistoryBtn.addEventListener('click', () => {
  history = [];
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
});

renderHistory();
