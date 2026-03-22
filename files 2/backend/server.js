// ============================================================
// FILE: backend/server.js
// PURPOSE: The Express server. Handles HTTP requests,
//          validates inputs, calls the AI layer, and
//          sends back JSON responses.
//          This file does NOT write prompts or call Claude directly.
// ============================================================

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
// This makes process.env.ANTHROPIC_API_KEY available
dotenv.config();

// Import the AI service (the only file that talks to Claude)
const { generateProposal } = require("../ai/proposalAI"); // ← Updated to new AI service file

// ─────────────────────────────────────────────
// SERVER SETUP
// ─────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware: Parse incoming JSON request bodies
app.use(express.json());

// Middleware: Allow requests from the frontend (CORS)
// In production, replace "*" with your actual frontend URL
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
  })
);

// ─────────────────────────────────────────────
// VALIDATION HELPER
// Checks that required fields are present and not empty.
// Returns an array of error messages (empty = no errors).
// ─────────────────────────────────────────────
function validateProposalInput(body) {
  const errors = [];

  if (!body.jobDescription || body.jobDescription.trim().length < 20) {
    errors.push(
      "jobDescription is required and must be at least 20 characters."
    );
  }

  if (!body.skills || body.skills.trim().length < 10) {
    errors.push("skills is required and must be at least 10 characters.");
  }

  const validTones = ["friendly", "formal", "confident"];
  if (body.tone && !validTones.includes(body.tone)) {
    errors.push(`tone must be one of: ${validTones.join(", ")}`);
  }

  return errors;
}

// ─────────────────────────────────────────────
// ROUTE: Health Check
// GET /api/health
// Used to verify the server is running.
// ─────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Proposal Generator API is running",
    timestamp: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────
// ROUTE: Generate Proposal
// POST /api/generate
//
// Expected request body:
// {
//   "jobDescription": "I need a React developer to...",
//   "skills": "5 years React, Node.js, REST APIs...",
//   "tone": "confident"          ← optional, defaults to "friendly"
// }
//
// Successful response:
// {
//   "success": true,
//   "data": { proposal, coverLetter, timeline, pricing }
// }
// ─────────────────────────────────────────────
app.post("/api/generate", async (req, res) => {
  // Step 1: Validate incoming data
  const errors = validateProposalInput(req.body);
  if (errors.length > 0) {
    // Return 400 Bad Request with the validation errors
    return res.status(400).json({
      success: false,
      errors: errors,
    });
  }

  // Step 2: Extract values from the request
  const {
    jobDescription,
    skills,
    tone = "friendly", // Default tone if not provided
  } = req.body;

  try {
    // Step 3: Call the AI layer (proposalAI.js handles all Claude logic)
    console.log(`[${new Date().toISOString()}] Generating proposal — tone: ${tone}`);
    const result = await generateProposal(jobDescription, skills, tone);

    // Step 4: Send back the successful response
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    // Step 5: Handle any errors from the AI layer
    console.error("Error generating proposal:", error.message);

    return res.status(500).json({
      success: false,
      error: "Failed to generate proposal. Please try again.",
      // Only show detailed error in development mode
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// ─────────────────────────────────────────────
// CATCH-ALL: Handle unknown routes
// Returns a 404 for any route not defined above
// ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
  });
});

// ─────────────────────────────────────────────
// START THE SERVER
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📋 API endpoint: POST http://localhost:${PORT}/api/generate`);
});