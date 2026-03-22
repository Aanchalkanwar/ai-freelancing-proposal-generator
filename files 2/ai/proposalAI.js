// ============================================================
// FILE: ai/proposalAI.js
// PURPOSE: All AI logic lives here — prompt engineering,
//          Google Gemini API calls, and parsing AI responses.
//          This file has NO idea about Express or HTML.
//
// MODEL USED: gemini-2.0-flash  (fast + cheap, great for JSON)
// API DOCS:   https://ai.google.dev/gemini-api/docs
// ============================================================

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Gemini client using your API key from .env
// Get your key at: https://aistudio.google.com/app/apikey
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─────────────────────────────────────────────
// MODEL CONFIG
// gemini-2.0-flash  → fast, affordable, great JSON output
// gemini-1.5-pro    → more powerful, slower (swap if needed)
//
// responseMimeType: "application/json" tells Gemini to ONLY
// return valid JSON — no markdown, no extra text.
// This is Gemini's built-in JSON mode (more reliable than prompting).
// ─────────────────────────────────────────────
const MODEL_NAME = "gemini-2.5-flash";

// ─────────────────────────────────────────────
// HELPER: Build the full prompt
// Gemini uses a single prompt string (not separate
// system + user messages like Claude/OpenAI).
// We combine role instructions + tone + job data here.
// ─────────────────────────────────────────────
function buildPrompt(jobDescription, skills, tone) {
  // Different tone instructions based on user selection
  const toneDescriptions = {
    friendly:
      "You are warm, approachable, and conversational. Use casual but professional language. Be enthusiastic but not over-the-top.",
    formal:
      "You are highly professional and formal. Use structured language, avoid contractions, and maintain a business-like tone throughout.",
    confident:
      "You are bold, direct, and assertive. Lead with results and value. Sound like a seasoned expert who knows exactly what the client needs.",
  };

  const toneInstruction =
    toneDescriptions[tone] || toneDescriptions["friendly"];

  // The full prompt — role + tone + task + data + output format
  return `
You are an expert freelance proposal writer for platforms like Upwork and Fiverr.
${toneInstruction}

Your task: Generate a complete freelance proposal package based on the job description and skills below.

You MUST respond with a valid JSON object following this EXACT structure (no extra text):
{
  "proposal": "A compelling 3-4 paragraph proposal tailored to the job",
  "coverLetter": "A short, punchy opening cover letter (1-2 paragraphs)",
  "timeline": [
    { "phase": "Phase name", "duration": "e.g. 2 days", "description": "What happens in this phase" }
  ],
  "pricing": {
    "minimum": 150,
    "maximum": 400,
    "recommended": 250,
    "rationale": "Brief explanation of why this price range makes sense"
  }
}

Always base the timeline phases and pricing on the ACTUAL complexity of the job described.

---

JOB DESCRIPTION:
"""
${jobDescription}
"""

FREELANCER SKILLS & EXPERIENCE:
"""
${skills}
"""

Generate the proposal package now.
  `.trim();
}

// ─────────────────────────────────────────────
// HELPER: Parse Gemini response safely
// Even with JSON mode enabled, we wrap parsing
// in a try/catch as a safety net.
// ─────────────────────────────────────────────
function parseAIResponse(rawText) {
  try {
    // Direct parse — should always work with JSON mode on
    return JSON.parse(rawText);
  } catch {
    // Fallback: try to extract JSON block from the text
    // (handles edge cases where the model adds extra characters)
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    // If nothing works, throw a descriptive error
    throw new Error("Gemini returned an unreadable response format.");
  }
}

// ─────────────────────────────────────────────
// MAIN FUNCTION: generateProposal
// This is the only function exported from this file.
// The backend (server.js) calls this and gets back
// a clean structured object.
//
// Parameters:
//   jobDescription (string) - the client's job post text
//   skills         (string) - freelancer's skills & experience
//   tone           (string) - "friendly" | "formal" | "confident"
//
// Returns:
//   { proposal, coverLetter, timeline, pricing }
// ─────────────────────────────────────────────
async function generateProposal(jobDescription, skills, tone = "friendly") {
  // Step 1: Get the Gemini model instance
  // generationConfig.responseMimeType enables JSON mode —
  // Gemini will ONLY output valid JSON, nothing else.
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      responseMimeType: "application/json", // ← Gemini's JSON mode
      temperature: 0.7,     // 0 = deterministic, 1 = creative. 0.7 is a good balance.
      maxOutputTokens: 2048, // Enough tokens for a full proposal
    },
  });

  // Step 2: Build the combined prompt (role + tone + job data)
  const prompt = buildPrompt(jobDescription, skills, tone);

  // Step 3: Send the prompt to Gemini and wait for the response
  const result = await model.generateContent(prompt);

  // Step 4: Extract the raw text from Gemini's response object
  // result.response.text() gives us the string content
  const rawText = result.response.text();

  // Step 5: Parse the JSON string into a JS object and return it
  const parsedResult = parseAIResponse(rawText);

  return parsedResult;
}

// Export only the main function — keep internals private
module.exports = { generateProposal };
