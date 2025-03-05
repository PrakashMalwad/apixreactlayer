import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { fetchData } from '../api';

export default function AuthPane({ paneValue, setPaneValue }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchData('https://api.example.com/data', paneValue);
      setData(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!paneValue) {
      setPaneValue({ type: "None" }); // Initialize paneValue if not provided
    }
  }, [paneValue, setPaneValue]);

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(paneValue));
  }, [paneValue]);

  return (
    <div className="p-4">
      {/* Auth Type Selector */}
      <label className="block text-gray-700 font-semibold mb-2">Auth Type</label>
      <select
        value={paneValue.type}
        onChange={(e) => setPaneValue({ ...paneValue, type: e.target.value })}
        className="border p-2 rounded w-full mb-3"
      >
        <option value="None">None</option>
        <option value="API Key">API Key</option>
        <option value="Bearer Token">Bearer Token</option>
        <option value="Basic Auth">Basic Auth</option>
      </select>

      {/* API Key Fields */}
      {paneValue.type === "API Key" && (
        <div className="mb-3">
          <input
            type="text"
            placeholder="Header Name (e.g., 'x-api-key')"
            value={paneValue.apiKey?.key || ""}
            onChange={(e) =>
              setPaneValue({
                ...paneValue,
                apiKey: { key: e.target.value, value: paneValue.apiKey?.value || "" },
              })
            }
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="text"
            placeholder="Value"
            value={paneValue.apiKey?.value || ""}
            onChange={(e) =>
              setPaneValue({
                ...paneValue,
                apiKey: { key: paneValue.apiKey?.key || "", value: e.target.value },
              })
            }
            className="border p-2 rounded w-full"
          />
        </div>
      )}

      {/* Bearer Token Field */}
      {paneValue.type === "Bearer Token" && (
        <input
          type="text"
          placeholder="Enter Bearer Token"
          value={paneValue.bearerToken || ""}
          onChange={(e) => setPaneValue({ ...paneValue, bearerToken: e.target.value })}
          className="border p-2 rounded w-full mb-3"
        />
      )}

      {/* Basic Auth Fields */}
      {paneValue.type === "Basic Auth" && (
        <div className="mb-3">
          <input
            type="text"
            placeholder="Username"
            value={paneValue.basicAuth?.username || ""}
            onChange={(e) =>
              setPaneValue({
                ...paneValue,
                basicAuth: {
                  username: e.target.value,
                  password: paneValue.basicAuth?.password || "",
                },
              })
            }
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={paneValue.basicAuth?.password || ""}
            onChange={(e) =>
              setPaneValue({
                ...paneValue,
                basicAuth: {
                  username: paneValue.basicAuth?.username || "",
                  password: e.target.value,
                },
              })
            }
            className="border p-2 rounded w-full"
          />
        </div>
      )}

    </div>
  );
}

AuthPane.propTypes = {
  paneValue: PropTypes.shape({
    type: PropTypes.string.isRequired,
    apiKey: PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string,
    }),
    bearerToken: PropTypes.string,
    basicAuth: PropTypes.shape({
      username: PropTypes.string,
      password: PropTypes.string,
    }),
  }).isRequired,
  setPaneValue: PropTypes.func.isRequired,
};