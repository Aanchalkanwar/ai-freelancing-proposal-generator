// ============================================================
// FILE: frontend/src/components/InputForm.jsx
// PURPOSE: The form where users enter job description,
//          skills, and select a tone.
//          This component manages its own form state locally
//          and calls onSubmit (from App.jsx) when ready.
// ============================================================

import { useState } from "react";

// Props:
//   onSubmit   (function) - called with { jobDescription, skills, tone }
//   isLoading  (boolean)  - disables the button while generating
function InputForm({ onSubmit, isLoading }) {
  // ─── Local form state ────────────────────────
  const [jobDescription, setJobDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [tone, setTone] = useState("friendly"); // default tone

  // ─── Handler: Form Submit ─────────────────────
  function handleSubmit(e) {
    e.preventDefault(); // Prevent page reload (default form behavior)

    // Basic client-side check before sending to backend
    if (!jobDescription.trim() || !skills.trim()) return;

    // Pass data up to App.jsx
    onSubmit({ jobDescription, skills, tone });
  }

  // Tone options with labels and emoji for the UI
  const toneOptions = [
    { value: "friendly", label: "Friendly", emoji: "😊", hint: "Warm & approachable" },
    { value: "formal",   label: "Formal",   emoji: "💼", hint: "Professional & structured" },
    { value: "confident",label: "Confident",emoji: "⚡", hint: "Bold & results-driven" },
  ];

  // ─── Render ───────────────────────────────────
  return (
    <form className="input-form" onSubmit={handleSubmit}>
      <h2 className="form-heading">Enter Job Details</h2>

      {/* ── Job Description ── */}
      <div className="field-group">
        <label htmlFor="jobDescription" className="field-label">
          Job Description
          <span className="field-hint">Paste the job posting here</span>
        </label>
        <textarea
          id="jobDescription"
          className="field-textarea"
          rows={7}
          placeholder="e.g. I need a React developer to build a dashboard with charts..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      {/* ── Skills / Experience ── */}
      <div className="field-group">
        <label htmlFor="skills" className="field-label">
          Your Skills & Experience
          <span className="field-hint">What makes you the right fit?</span>
        </label>
        <textarea
          id="skills"
          className="field-textarea"
          rows={5}
          placeholder="e.g. 4 years React, built 3 dashboards, expert in Chart.js..."
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      {/* ── Tone Selector ── */}
      <div className="field-group">
        <label className="field-label">
          Cover Letter Tone
          <span className="field-hint">Pick the voice for your proposal</span>
        </label>
        <div className="tone-options">
          {toneOptions.map((option) => (
            <button
              key={option.value}
              type="button" // Important: prevents form submission on click
              className={`tone-btn ${tone === option.value ? "tone-btn--active" : ""}`}
              onClick={() => setTone(option.value)}
              disabled={isLoading}
            >
              <span className="tone-emoji">{option.emoji}</span>
              <span className="tone-label">{option.label}</span>
              <span className="tone-hint">{option.hint}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Submit Button ── */}
      <button
        type="submit"
        className="submit-btn"
        disabled={isLoading || !jobDescription.trim() || !skills.trim()}
      >
        {isLoading ? "Generating..." : "Generate Proposal →"}
      </button>
    </form>
  );
}

export default InputForm;
