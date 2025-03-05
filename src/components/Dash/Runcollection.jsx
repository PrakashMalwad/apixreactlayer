import { useState } from "react";
import axios from "axios";

const RunCollection = ({ collections, activeCollectionId }) => {
  const [running, setRunning] = useState(false);
  const [responses, setResponses] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const handleRunCollection = async () => {
    if (!activeCollectionId) return;
    const collection = collections.find((col) => col._id === activeCollectionId);
    if (!collection) return;

    setRunning(true);
    let newResponses = [];

    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No authentication token found.");

      for (const request of collection.requests) {
        try {
          const response = await axios({
            method: request.method,
            url: request.url,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            data: request.body,
          });

          newResponses.push({ name: request.name, status: response.status, message: response.statusText, data: response.data });
        } catch (error) {
          newResponses.push({ name: request.name, status: "Error", message: error.message, data: error.response?.data || {} });
        }
      }

      setResponses(newResponses);
      setShowPopup(true);
    } catch (error) {
      console.error("Error running collection:", error);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div>
      <button onClick={handleRunCollection} disabled={running}>
        {running ? "Running..." : "Run Collection"}
      </button>

      {showPopup && (
        <div className="modal">
          <h3>Collection Run Summary</h3>
          <button onClick={() => setShowPopup(false)}>Close</button>
          <div>
            {responses.map((res, index) => (
              <div key={index} style={{ background: res.status === "Error" ? "#ffb3b3" : "#b3ffb3", padding: "10px", margin: "5px" }}>
                <strong>{res.name}</strong> - <span>{res.status}</span>
                <p>{res.message}</p>
                <pre>{JSON.stringify(res.data, null, 2)}</pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RunCollection;
