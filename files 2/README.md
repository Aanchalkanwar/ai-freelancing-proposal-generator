# ProposalCraft — AI Freelance Proposal Generator

## Project Structure

```
proposal-generator/
│
├── ai/
│   └── proposalAI.js       ← ALL Claude API logic (prompts, parsing)
│
├── backend/
│   └── server.js           ← Express server, routes, validation
│
├── frontend/
│   └── src/
│       ├── api.js                      ← All fetch() calls to backend
│       ├── App.jsx                     ← Root component, state management
│       ├── App.css                     ← All styles
│       └── components/
│           ├── InputForm.jsx           ← Form UI
│           ├── ResultPanel.jsx         ← Proposal output display
│           └── LoadingSpinner.jsx      ← Loading state
│
├── .env.example            ← Copy to .env and add your API key
└── package.json            ← Backend dependencies
```

## Separation of Concerns

| File             | What it does                        | What it does NOT do              |
|------------------|-------------------------------------|----------------------------------|
| `ai/proposalAI.js`   | Writes prompts, calls Claude API    | Handle HTTP, render HTML         |
| `backend/server.js`  | HTTP routes, validation, errors     | Write prompts, render HTML       |
| `frontend/src/api.js`| Fetch calls to backend              | Call Claude directly, render UI  |
| `App.jsx` + components | UI rendering, user interactions | Call Claude, write SQL           |

## Setup Instructions

### 1. Backend Setup
```bash
# In the root folder (proposal-generator/)
npm install

# Copy the env template and add your API key
cp .env.example .env
# Edit .env and set ANTHROPIC_API_KEY=your_key_here

# Start the backend
npm run dev
# → Server runs on http://localhost:5000
```

### 2. Frontend Setup
```bash
# In the frontend/ folder
cd frontend
npm create vite@latest . -- --template react
npm install

# Start the frontend dev server
npm run dev
# → App runs on http://localhost:5173
```

> Make sure the backend is running BEFORE you use the frontend.

## API Reference

### POST /api/generate
**Request body:**
```json
{
  "jobDescription": "I need a React developer...",
  "skills": "4 years React, Node.js...",
  "tone": "confident"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "proposal": "...",
    "coverLetter": "...",
    "timeline": [{ "phase": "...", "duration": "...", "description": "..." }],
    "pricing": { "minimum": 150, "maximum": 400, "recommended": 250, "rationale": "..." }
  }
}
```
