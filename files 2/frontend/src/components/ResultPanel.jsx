// ============================================================
// FILE: frontend/src/components/ResultPanel.jsx
// PURPOSE: Displays the AI-generated proposal results.
//          Receives the data object from App.jsx via props.
//          Has tab-based navigation between sections.
//          Copy-to-clipboard is handled here.
// ============================================================

import { useState } from "react";

// Props:
//   data (object) - { proposal, coverLetter, timeline, pricing }
function ResultPanel({ data }) {
  // Track which tab the user is viewing
  const [activeTab, setActiveTab] = useState("proposal");

  // Track which section was just copied (for the "Copied!" feedback)
  const [copiedKey, setCopiedKey] = useState(null);

  // ─── Handler: Copy to Clipboard ──────────────
  async function copyToClipboard(text, key) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      // Reset the "Copied!" indicator after 2 seconds
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      alert("Could not copy. Please select and copy manually.");
    }
  }

  // ─── Tab Config ───────────────────────────────
  // Defines the 4 output tabs
  const tabs = [
    { key: "proposal",    label: "Proposal",      icon: "📄" },
    { key: "coverLetter", label: "Cover Letter",   icon: "✉️" },
    { key: "timeline",    label: "Timeline",       icon: "📅" },
    { key: "pricing",     label: "Pricing",        icon: "💰" },
  ];

  // ─── Render ───────────────────────────────────
  return (
    <div className="result-panel">
      {/* Tab Navigation */}
      <nav className="tab-nav">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab-btn ${activeTab === tab.key ? "tab-btn--active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="tab-content">

        {/* ── Proposal Tab ── */}
        {activeTab === "proposal" && (
          <div className="tab-pane">
            <div className="tab-pane-header">
              <h3>Your Proposal</h3>
              <button
                className="copy-btn"
                onClick={() => copyToClipboard(data.proposal, "proposal")}
              >
                {copiedKey === "proposal" ? "✓ Copied!" : "Copy"}
              </button>
            </div>
            {/* Render each paragraph separately for readability */}
            {data.proposal.split("\n\n").map((para, i) => (
              <p key={i} className="proposal-para">{para}</p>
            ))}
          </div>
        )}

        {/* ── Cover Letter Tab ── */}
        {activeTab === "coverLetter" && (
          <div className="tab-pane">
            <div className="tab-pane-header">
              <h3>Cover Letter</h3>
              <button
                className="copy-btn"
                onClick={() => copyToClipboard(data.coverLetter, "cover")}
              >
                {copiedKey === "cover" ? "✓ Copied!" : "Copy"}
              </button>
            </div>
            {data.coverLetter.split("\n\n").map((para, i) => (
              <p key={i} className="proposal-para">{para}</p>
            ))}
          </div>
        )}

        {/* ── Timeline Tab ── */}
        {activeTab === "timeline" && (
          <div className="tab-pane">
            <h3>Project Timeline</h3>
            <div className="timeline-list">
              {/* data.timeline is an array of { phase, duration, description } */}
              {data.timeline.map((item, index) => (
                <div key={index} className="timeline-item">
                  {/* Step number badge */}
                  <div className="timeline-step">{index + 1}</div>
                  <div className="timeline-info">
                    <div className="timeline-header">
                      <span className="timeline-phase">{item.phase}</span>
                      <span className="timeline-duration">{item.duration}</span>
                    </div>
                    <p className="timeline-desc">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Pricing Tab ── */}
        {activeTab === "pricing" && (
          <div className="tab-pane">
            <h3>Suggested Pricing</h3>

            {/* Price cards: min, recommended, max */}
            <div className="pricing-cards">
              <div className="pricing-card pricing-card--low">
                <span className="pricing-label">Minimum</span>
                <span className="pricing-amount">${data.pricing.minimum}</span>
              </div>
              <div className="pricing-card pricing-card--mid">
                <span className="pricing-label">Recommended</span>
                <span className="pricing-amount">${data.pricing.recommended}</span>
                <span className="pricing-badge">Best Fit</span>
              </div>
              <div className="pricing-card pricing-card--high">
                <span className="pricing-label">Maximum</span>
                <span className="pricing-amount">${data.pricing.maximum}</span>
              </div>
            </div>

            {/* Rationale text from AI */}
            <div className="pricing-rationale">
              <h4>Why this range?</h4>
              <p>{data.pricing.rationale}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultPanel;
