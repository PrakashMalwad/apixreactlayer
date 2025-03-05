import React, { useEffect, useState } from "react";
import axios from "axios";
import Request from "../Workspace/Request/RequestPanel";
import Response from "../Workspace/Response/ResponsePanel";
import { Loader, Save } from "lucide-react";

export default function RequestResponsePanel({
  selectedCollection,
  selectedRequest,
  setSelectedRequest,
  updateCollection, // Ensure this function is passed as a prop
}) {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requestData, setRequestData] = useState({
    url: "",
    method: "GET",
    queryparams: [],
    headers: {},
    body: "",
    auth: {
      type: "None",
      apiKey: { key: "", value: "" },
      bearerToken: "",
      basicAuth: { username: "", password: "" },
    },
  });

  // Update requestData when selectedRequest changes
  useEffect(() => {
    if (selectedRequest) {
      setRequestData({
        url: selectedRequest.url || "",
        method: selectedRequest.method || "GET",
        headers: selectedRequest.headers || {},
        body: selectedRequest.body || "",
        auth: selectedRequest.auth || {
          type: "None",
          apiKey: { key: "", value: "" },
          bearerToken: "",
          basicAuth: { username: "", password: "" },
        },
      });
      setResponse(null);
      setLoading(false);
    }
  }, [selectedRequest]);

  // Save the updated request
  const handleSaveRequest = async () => {
    if (!selectedCollection || !selectedRequest) return;
  
    const updatedRequest = {
      ...selectedRequest,
      url: requestData.url,
      method: requestData.method,
      headers: requestData.headers,
      body: requestData.body,
      auth: requestData.auth,
    };
  
    const updatedRequests = selectedCollection.requests.map((req) =>
      req._id === selectedRequest._id ? updatedRequest : req
    );
  
    try {
      const response = await axios.put(`/api/collections/${selectedCollection._id}`, {
        requests: updatedRequests,
      });
  
      if (response.status === 200) {
        updateCollection(response.data); // Now properly updates the parent UI
        setSelectedRequest(updatedRequest);
      }
    } catch (error) {
      console.error("Error updating collection:", error);
    }
  };
  

  return (
    <>
      {selectedRequest ? (
        <>
          <div className="bg-white shadow-lg rounded-lg p-5 border border-gray-200">
            <Request
              setResponse={setResponse}
              setLoading={setLoading}
              requestData={requestData}
              setRequestData={setRequestData}
              selectedCollection={selectedCollection}
              selectedRequest={selectedRequest}
            />
            {/* Save Request Button */}
            <button
              onClick={handleSaveRequest}
              disabled={loading}
              className="mt-4 flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              Save Request
            </button>
          </div>

          {loading && (
            <div className="flex items-center gap-2 mt-4 text-blue-500">
              <Loader className="animate-spin" size={20} />
              <p>Processing request...</p>
            </div>
          )}

          {response && <Response response={response} />}
        </>
      ) : (
        <p className="text-gray-600 text-center">Select a request to begin</p>
      )}
    </>
  );
}
