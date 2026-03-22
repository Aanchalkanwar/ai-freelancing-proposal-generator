// ============================================================
// FILE: frontend/src/api.js
// PURPOSE: All communication between the frontend and the
//          backend lives here. No fetch() calls should ever
//          appear inside components — always call this file.
// ============================================================

// The base URL of the backend server
// In development: http://localhost:5001
// In production: replace with your deployed backend URL
const BASE_URL = "http://localhost:5001/api";

// ─────────────────────────────────────────────
// FUNCTION: generateProposal
// Sends user input to the backend and returns
// the AI-generated proposal data.
//
// Parameters:
//   jobDescription (string) - the job post text
//   skills         (string) - user's skills
//   tone           (string) - "friendly" | "formal" | "confident"
//
// Returns:
//   { proposal, coverLetter, timeline, pricing }
//
// Throws:
//   Error with a user-friendly message if something goes wrong
// ─────────────────────────────────────────────
export async function generateProposal(jobDescription, skills, tone) {
  // Build the request to send to the backend
  const response = await fetch(`${BASE_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Tell the server we're sending JSON
    },
    body: JSON.stringify({
      jobDescription,
      skills,
      tone,
    }),
  });

  // Parse the JSON response from the server
  const data = await response.json();

  // If the server returned an error status, throw it so the component can catch it
  if (!response.ok || !data.success) {
    const message =
      data.errors?.join(", ") || data.error || "Something went wrong.";
    throw new Error(message);
  }

  // Return just the proposal data (not the wrapper object)
  return data.data;
}

// ─────────────────────────────────────────────
// FUNCTION: checkHealth
// Optional utility to verify the server is up.
// Can be called on app startup.
// ─────────────────────────────────────────────
export async function checkHealth() {
  const response = await fetch(`${BASE_URL}/health`);
  return response.json();
}
