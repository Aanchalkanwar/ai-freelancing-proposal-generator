// ============================================================
// FILE: frontend/src/components/LoadingSpinner.jsx
// PURPOSE: A simple loading spinner component shown while
//          waiting for the AI to generate a proposal.
// ============================================================

import "./LoadingSpinner.css"; // Assuming we have a CSS file for styling

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Generating your proposal...</p>
    </div>
  );
};

export default LoadingSpinner;