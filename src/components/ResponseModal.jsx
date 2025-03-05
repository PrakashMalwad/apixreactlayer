import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const ResponseModal = ({ response, error, onClose }) => {
  const [expandedIndexes, setExpandedIndexes] = useState({});
  const [copySuccess, setCopySuccess] = useState(null);

  // Close modal when pressing Esc key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Function to check if a response is an HTML string
  const isHTML = (str) => {
    if (typeof str !== "string") return false;
    const trimmedStr = str.trim();
    return /^<!DOCTYPE html>|<html[\s>]|<body[\s>]|<div[\s>]|<p[\s>]|<span[\s>]|<h\d[\s>]/i.test(trimmedStr);
  };

  // Copy response to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(JSON.stringify(text, null, 2));
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(null), 1500);
  };

  // Toggle visibility of headers and JSON data
  const toggleExpand = (index) => {
    setExpandedIndexes((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Determine pass/fail summary
  let summary = "No response available.";
  if (error) {
    summary = "Test Failed ❌";
  } else if (Array.isArray(response) && response.length > 0) {
    const allPassed = response.every((item) => item.status >= 200 && item.status < 300);
    summary = allPassed ? "Test Passed ✅" : "Test Failed ❌";
  } else if (response && typeof response === "object" && response.status) {
    summary = response.status >= 200 && response.status < 300 ? "Test Passed ✅" : "Test Failed ❌";
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-3xl overflow-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Summary Section */}
        <h2 className={`text-xl font-bold mb-4 ${summary.includes("Passed") ? "text-green-600" : "text-red-600"}`}>
          {summary}
        </h2>

        {/* Display Error */}
        {error ? (
          <div className="p-4 bg-red-500 text-white rounded text-sm">
            <p>{error}</p>
          </div>
        ) : response ? (
          <div className="p-4 bg-gray-100 rounded overflow-auto max-h-80 space-y-3">
            {Array.isArray(response) ? (
              response.map((item, index) => (
                <div key={index} className="p-3 bg-white shadow-md rounded-lg border border-gray-300">
                  <h3 className="text-blue-600 font-bold">Response {index + 1}</h3>
                  <p className="text-gray-800">
                    <strong className="text-green-600">Status:</strong> {item.status} {item.statusText}
                  </p>

                  {/* Copy to Clipboard Button */}
                  <button
                    className="text-xs text-purple-600 hover:underline mt-1"
                    onClick={() => handleCopy(item)}
                  >
                    {copySuccess ? copySuccess : "Copy Response"}
                  </button>

                  {/* Collapsible Headers */}
                  <div className="mt-2">
                    <button
                      onClick={() => toggleExpand(index)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {expandedIndexes[index] ? "Hide Headers" : "Show Headers"}
                    </button>
                    {expandedIndexes[index] && (
                      <div className="text-sm bg-gray-200 p-2 rounded-lg mt-1">
                        {Object.entries(item.headers || {}).map(([key, value]) => (
                          <p key={key} className="text-gray-700">
                            <strong>{key}:</strong> {value}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Handle HTML response */}
                  {isHTML(item.data) ? (
                    <div
                      className="p-3 bg-white shadow-md rounded-lg border border-gray-300 overflow-auto max-h-60 mt-2"
                      dangerouslySetInnerHTML={{ __html: item.data }}
                    />
                  ) : typeof item.data === "object" ? (
                    <div className="mt-2">
                      <button
                        onClick={() => toggleExpand(`json-${index}`)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {expandedIndexes[`json-${index}`] ? "Hide JSON" : "Show JSON"}
                      </button>
                      {expandedIndexes[`json-${index}`] && (
                        <pre className="p-3 bg-white shadow-md rounded-lg border border-gray-300 overflow-auto max-h-60 text-sm mt-1">
                          {JSON.stringify(item.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-800">{String(item.data)}</p>
                  )}
                </div>
              ))
            ) : typeof response === "object" ? (
              <div className="p-3 bg-white shadow-md rounded-lg border border-gray-300">
                {Object.entries(response).map(([key, value]) => (
                  <p key={key} className="text-gray-800">
                    <strong className="text-purple-600">{key}:</strong> {JSON.stringify(value, null, 2)}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-gray-800">{String(response)}</p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No response available.</p>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

ResponseModal.propTypes = {
  response: PropTypes.any,
  error: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default ResponseModal;
