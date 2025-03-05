import React, { useState } from "react";

const ApiDashboard = () => {
  // State for managing form inputs and response
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState('{"Content-Type": "application/json"}');
  const [body, setBody] = useState('{"key": "value"}');
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to send the API request
  const sendRequest = async () => {
    setLoading(true);
    setError("");
    setResponse("");

    try {
      const response = await fetch(url, {
        method: method,
        headers: JSON.parse(headers),
        body: method !== "GET" ? body : null,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setError(error.message);
      setResponse("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>APIx Tool - Request/Response Dashboard</h1>

      {/* URL Input */}
      <div style={styles.formGroup}>
        <label>API Endpoint URL:</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/resource"
          style={styles.input}
        />
      </div>

      {/* HTTP Method Dropdown */}
      <div style={styles.formGroup}>
        <label>HTTP Method:</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          style={styles.input}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      {/* Headers Input */}
      <div style={styles.formGroup}>
        <label>Headers (JSON):</label>
        <textarea
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          placeholder='{"Content-Type": "application/json"}'
          style={styles.textarea}
        />
      </div>

      {/* Request Body Input */}
      <div style={styles.formGroup}>
        <label>Request Body (JSON):</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder='{"key": "value"}'
          style={styles.textarea}
        />
      </div>

      {/* Send Request Button */}
      <button onClick={sendRequest} disabled={loading} style={styles.button}>
        {loading ? "Sending..." : "Send Request"}
      </button>

      {/* Display Response */}
      {response && (
        <div style={styles.response}>
          <strong>Response:</strong>
          <pre style={styles.pre}>{response}</pre>
        </div>
      )}

      {/* Display Error */}
      {error && (
        <div style={styles.error}>
          <strong>Error:</strong>
          <pre style={styles.pre}>{error}</pre>
        </div>
      )}
    </div>
  );
};

// Styles for the component
const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  formGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "8px",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "8px",
    boxSizing: "border-box",
    height: "100px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  response: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#f4f4f4",
    border: "1px solid #ddd",
  },
  error: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#ffebee",
    border: "1px solid #ffcdd2",
  },
  pre: {
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
  },
};

export default ApiDashboard;