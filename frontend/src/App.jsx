import React, { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setError(null);

      const form = new FormData();
      form.append("text", text);
      if (file) form.append("file", file);

      // ✅ Always call backend at localhost:8000
      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h2>Multimodal Analyzer — Demo</h2>

      {/* Text Input */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        style={{ width: "100%", padding: "8px" }}
        placeholder="Enter text here..."
      ></textarea>

      {/* File Upload */}
      <div style={{ marginTop: 8 }}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      {/* Analyze Button */}
      <div style={{ marginTop: 12 }}>
        <button onClick={handleAnalyze} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ marginTop: 20, color: "red" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Results</h3>
          <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
            {result.text_sentiment && (
              <p><strong>Sentiment:</strong> {result.text_sentiment[0].label}</p>
            )}
            {result.text_summary && (
              <p><strong>Summary:</strong> {result.text_summary}</p>
            )}
            {result.topic_classification && (
              <p><strong>Topic:</strong> {result.topic_classification}</p>
            )}
            {result.image_classification && (
              <p><strong>Image Labels:</strong> {result.image_classification.map(c => c.label).join(", ")}</p>
            )}
            {result.ocr_text && (
              <p><strong>OCR Text:</strong> {result.ocr_text}</p>
            )}
            {result.text_toxicity_score && (
              <p><strong>Text Toxicity:</strong> {result.text_toxicity_score}</p>
            )}
            {result.image_toxicity_score && (
              <p><strong>Image Toxicity:</strong> {result.image_toxicity_score}</p>
            )}
            {result.automated_response && (
              <p style={{ marginTop: "1rem", fontWeight: "bold" }}>
                {result.automated_response}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
