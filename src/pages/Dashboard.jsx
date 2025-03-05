import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar";
import WelcomeScreen from "../components/Dash/Welcome";
import RequestResponsePanel from "../components/Dash/RequestResponsePanel";
import { PlusCircle, Trash2 } from "lucide-react";
import ResponseModal from "../components/ResponseModal";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
export default function Dashboard() {
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [requests, setRequests] = useState([]);
  const [response, setResponse] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [collections, setCollections] = useState([]);

  const [responseModel, setResponseModel] = useState(false);

  // Fetch collections on component mount
  useEffect(() => {

    fetchCollections();
  }, []);
  const fetchCollections = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get("/api/collections");
      setCollections(data);
    } catch (error) {
      setError("Failed to fetch collections.");
      console.error("Error fetching collections:", error);
    } finally {
      setLoading(false);
    }
  };
  const updateCollection = (updatedCollection) => {
    setCollections((prevCollections) =>
      prevCollections.map((col) =>
        col._id === updatedCollection._id ? updatedCollection : col
      )
    );

    if (selectedCollection && selectedCollection._id === updatedCollection._id) {
      setSelectedCollection(updatedCollection);
      console.log("Updated Collection: ", updatedCollection);
      console.log(updatedCollection);

      setRequests(updatedCollection.requests || []);
    }
  };

  // Handle collection selection
  const handleSelectCollection = (collection) => {
    setSelectedCollection(collection);
    setRequests(collection?.requests || []);
    setSelectedRequest(null);
  };

  // Update requests when selected collection changes
  useEffect(() => {
    if (selectedCollection) {
      setRequests(selectedCollection.requests || []);
    }
  }, [selectedCollection]);

  // Add a new API request
  const handleAddApiRequest = async () => {
    if (!selectedCollection) return;

    const newRequest = {
      name: `API Request ${requests.length + 1}`,
      url: "",
      method: "GET",
      headers: {},
      body: "",
    };

    try {
      const { data } = await axios.post(
        `/api/collections/add/${selectedCollection._id}`,
        newRequest
      );

      const savedRequest = data.request;

      setRequests((prevRequests) => [...prevRequests, savedRequest]);
      window.location.reload();
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

  // Rename a request
  const handleRenameRequest = async (requestId, newName, collectionId) => {
    if (!newName.trim() || !collectionId) return;

    try {
      // Update the request name within the collection
      const updatedRequests = selectedCollection.requests.map((req) =>
        req._id === requestId ? { ...req, name: newName } : req
      );

      // Send the update request to the backend
      await axios.put(`/api/collections/${collectionId}`, { requests: updatedRequests });

      // Update state
      setSelectedCollection((prev) =>
        prev._id === collectionId ? { ...prev, requests: updatedRequests } : prev
      );

      if (selectedRequest?._id === requestId) {
        setSelectedRequest((prev) => ({ ...prev, name: newName }));
      }
      window.location.reload();
    } catch (error) {
      console.error("Error renaming request:", error);
      alert("Failed to rename request.");
    }
  };

  // Delete a request
  const handleDeleteRequest = async (requestId, collectionId) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: `Are you sure you want to delete "${name}"?`,
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              if (!selectedCollection || selectedCollection._id !== collectionId) return;

              // Create a new collection object with the request removed
              const updatedRequests = selectedCollection.requests.filter(
                (req) => req._id !== requestId
              );

              // Update the collection in the backend
              await axios.put(`/api/collections/${collectionId}`, {
                requests: updatedRequests, // Send the updated requests array
              });


              // If the deleted request was selected, reset the selected request
              if (selectedRequest?._id === requestId) {
                setSelectedRequest(null);
              }
              window.location.reload();

            } catch (error) {
              console.error("Error deleting request:", error);
              alert("Failed to delete API request.");
            }
          },
        },
        { label: "No" },
      ],
    });
  }

return (
  <div className="flex h-screen bg-gray-100">
    {/* Sidebar */}
    <Sidebar
      onSelectCollection={handleSelectCollection}
      responses={response}
      setResponse={setResponse}
      setResponseModel={setResponseModel}
      collections={collections}
      setCollections={setCollections}
      selectedCollection={selectedCollection}
      setSelectedRequest={setSelectedRequest}
      handleDeleteRequest={handleDeleteRequest}
      handleEditRequest={handleRenameRequest}
    />
    {responseModel && <ResponseModal response={response} onClose={() => setResponseModel(false)} />}

    {/* Main Content */}
    <div className="flex-1 p-6 overflow-y-auto">
      {!selectedCollection ? (
        <WelcomeScreen />
      ) : (
        <div className="bg-white shadow-xl rounded-lg p-6 border border-gray-200">
          {/* Collection and Request Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Collection: <span className="text-indigo-600">{selectedCollection?.name || "NA"}</span>
              {" | "} Request: <span className="text-indigo-600">{selectedRequest?.name || "NA"}</span>
            </h2>

            {/* Add API Request Button */}
            <button
              onClick={handleAddApiRequest}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-700 transition-all"
            >
              <PlusCircle size={20} /> Add API Request
            </button>
          </div>

          {/* Request Details Panel */}
          {selectedRequest && (
            <RequestResponsePanel
              selectedRequest={selectedRequest}
              selectedCollection={selectedCollection}
              setSelectedRequest={setSelectedRequest}
              updateCollection={updateCollection}
            />
          )}
        </div>
      )}
    </div>
  </div>
);
  }