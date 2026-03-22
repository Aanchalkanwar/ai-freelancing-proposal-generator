import { useState } from "react";
import "./App.css";
import InputForm from "./components/InputForm";
import ResultPanel from "./components/ResultPanel";
import { generateProposal } from "./api";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [proposalData, setProposalData] = useState(null);

  async function handleFormSubmit({ jobDescription, skills, tone }) {
    setIsLoading(true);
    setError("");

    try {
      const data = await generateProposal(jobDescription, skills, tone);
      setProposalData(data);
    } catch (err) {
      setError(err.message || "Unable to generate proposal. Please try again.");
      setProposalData(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AI Freelancing Proposal Generator</h1>
        <p>Paste the job post, add your strengths, and get a tailored proposal instantly.</p>
      </header>

      <main className="app-main">
        <InputForm onSubmit={handleFormSubmit} isLoading={isLoading} />

        {error && <div className="error-message">{error}</div>}

        {isLoading && <div className="loading-message">Generating proposal…</div>}

        {proposalData && <ResultPanel data={proposalData} />}
      </main>

      <footer className="app-footer">
        <p>Backend: http://localhost:5001/api (make sure backend is running)</p>
      </footer>
    </div>
  );
}

export default App;
