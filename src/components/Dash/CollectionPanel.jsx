import React, { useEffect, useState } from "react";
import axios from "axios";
import { PlusCircle, Trash2 } from "lucide-react";
import RequestResponsePanel from "./RequestResponsePanel";

export default function CollectionPanel({ selectedCollection, setSelectedCollection }) {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    if (selectedCollection) {
      setRequests(selectedCollection.requests || []);
    }
  }, [selectedCollection]);

  const handleAddApiRequest = async () => {
    if (!selectedCollection) return;

    const newRequest = {
      name: `API Request ${requests.length + 1}`,
      url: "",
      method: "GET",
      headers: {},
      body: "",
    };

    console.log("Adding request to collection:", selectedCollection._id);

    try {
      const { data } = await axios.post(
        `/api/collections/add/${selectedCollection._id}`,
        newRequest
      );

      const savedRequest = data.request;

      setRequests((prevRequests) => [...prevRequests, savedRequest]);

      setSelectedCollection((prevCollection) => ({
        ...prevCollection,
        requests: [...prevCollection.requests, savedRequest],
      }));

      setSelectedRequest(savedRequest);
    } catch (error) {
      console.error("Error adding request to collection:", error);
      alert("Failed to save API request.");
    }
  };

  // Delete an API request
  const handleDeleteRequest = async (requestId) => {
    try {
      // Delete request from backend
      await axios.delete(`/api/requests/${requestId}`);

      // Remove request from collection in backend
      await axios.delete(`/api/collections/${selectedCollection._id}/requests/${requestId}`);

      // Update local state
      setRequests((prevRequests) => prevRequests.filter((req) => req._id !== requestId));

      setSelectedCollection((prevCollection) => ({
        ...prevCollection,
        requests: prevCollection.requests.filter((req) => req._id !== requestId),
      }));

      if (selectedRequest?._id === requestId) {
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      alert("Failed to delete API request.");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-5 mb-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-700">
        Collection: <span className="text-blue-600">{selectedCollection.name}</span>
      </h2>

      {/* Add API Request Button */}
      <button
        onClick={handleAddApiRequest}
        className="mt-4 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition-all"
      >
        <PlusCircle size={20} /> Add API Request
      </button>

      {/* Request List */}
      <ul className="mt-4">
        {requests.length === 0 ? (
          <p className="text-gray-500">No requests available.</p>
        ) : (
          requests.map((request) => (
            <li
              key={request._id}
              className={`flex justify-between items-center p-2 rounded-lg my-2 cursor-pointer 
                ${request._id === selectedRequest?._id ? "bg-blue-200" : "bg-gray-100"} 
                hover:bg-gray-200`}
            >
              <span onClick={() => setSelectedRequest(request)} className="text-gray-800">
                {request.name} ({request.method})
              </span>
              <button onClick={() => handleDeleteRequest(request._id)} className="text-red-600 hover:text-red-800">
                <Trash2 size={18} />
              </button>
            </li>
          ))
        )}
      </ul>
      
        <RequestResponsePanel selectedRequest={selectedRequest} setSelectedRequest={setSelectedRequest} />
      
    </div>
  );
}
