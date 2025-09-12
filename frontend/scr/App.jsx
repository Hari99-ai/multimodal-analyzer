import React, { useState } from "react";
import './App.css';

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

      const res = await fetch('/analyze', {
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
    <div className="app">
      <div className="container">
        <h1 className="title">Multimodal Analyzer- Text & Image Understanding System</h1>
        
        <div className="input-section">
          <div className="input-row">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="I hate how messy this restaurant is."
              className="text-input"
              rows={3}
            />
            
            <div className="file-upload-section">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                id="file-input"
                className="file-input"
              />
              <label htmlFor="file-input" className="file-label">
                📁 Choose Image
              </label>
              {file && <div className="file-name">{file.name}</div>}
            </div>
          </div>
          
          <button 
            className="analyze-button" 
            onClick={handleAnalyze} 
            disabled={loading || (!text && !file)}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="results-section">
            <h2 className="results-title">Results</h2>
            
            <div className="results-grid">
              {/* Text Sentiment Card */}
              <div className="result-card">
                <h3 className="card-title">Text Sentiment</h3>
                <div className={`sentiment-label ${result.text_sentiment?.[0]?.label?.toLowerCase()}`}>
                  {result.text_sentiment?.[0]?.label || "Unknown"}
                </div>
                <p className="card-description">
                  {result.text_summary || "Analysis of the provided text content"}
                </p>
              </div>

              {/* Topic Classification Card */}
              <div className="result-card">
                <h3 className="card-title">Topic Classification</h3>
                <div className="topic-result">
                  {typeof result.topic_classification === 'string' 
                    ? result.topic_classification 
                    : (result.topic_classification?.primary || 
                       result.topic_classification?.categories?.[0]?.name || 
                       "General")}
                </div>
              </div>

              {/* OCR and Toxicity Cards */}
              <div className="result-card">
                <h3 className="card-title">OCR</h3>
                <div className="ocr-result">
                  '{result.ocr_text || "No text detected"}'
                </div>
              </div>

              <div className="result-card">
                <h3 className="card-title">Text Toxicity</h3>
                <div className="toxicity-result">
                  {Math.round((result.text_toxicity_score || 0) * 100)}%
                </div>
              </div>

              <div className="result-card">
                <h3 className="card-title">Image Toxicity</h3>
                <div className="toxicity-result">
                  {Math.round((result.image_toxicity_score || 0) * 100)}%
                </div>
              </div>

              {/* Image Category Card */}
              {result.image_classification && (
                <div className="result-card image-card">
                  {file && (
                    <div className="image-preview">
                      <img src={URL.createObjectURL(file)} alt="Uploaded" />
                    </div>
                  )}
                  <div className="image-info">
                    <h3 className="card-title">Image Category</h3>
                    <div className="image-category">
                      {result.scene_classification || result.image_classification[0]?.label || "Unknown"}
                    </div>
                    <div className="image-ocr-label">OCR</div>
                  </div>
                </div>
              )}

              {/* Automated Response Card */}
              <div className="result-card response-card">
                <p className="response-text">
                  {result.automated_response || 
                   "Thank you for your feedback. We'll review this content accordingly."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}