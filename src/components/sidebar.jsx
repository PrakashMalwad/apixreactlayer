import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import PropTypes from "prop-types";
import {
  FaPlus,
  FaFolderOpen,
  FaTimes,
  FaEdit,
  FaTrash,
  FaArrowRight,
  FaChevronDown,
  FaChevronRight,
  FaFileAlt,
  FaSignOutAlt,
  FaUser,
  FaPlay,
  FaTruckLoading,
  FaLeaf,
  FaLeanpub,
  FaRecycle,
} from "react-icons/fa";
import ResponseModal from "./ResponseModal";
const API_BASE = import.meta.env.VITE_API_BASE || "";

export default function Sidebar({ collections, setCollections, onSelectCollection, responses, setResponse, setResponseModel,
  setSelectedRequest, handleEditRequest, handleDeleteRequest }) {
  
  const [activeCollectionId, setActiveCollectionId] = useState(null);
  const [expandedCollections, setExpandedCollections] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(
    JSON.parse(localStorage.getItem("sidebarCollapsed")) || false
  );
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "User");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [runningCollectionId, setRunningCollectionId] = useState(null);

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) setUserName(storedName);
  }, []);

  useEffect(() => {
    
    fetchCollections();
  }, []);
  const fetchCollections = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = axios.get(`${API_BASE}/collections`);
      setCollections(data);
    } catch (error) {
      setError("Failed to fetch collections.");
      console.error("Error fetching collections:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCollectionClick = (collection) => {
    isCollapsed && setIsCollapsed(false);
    setActiveCollectionId(collection._id);
    onSelectCollection(collection);
    setExpandedCollections((prev) => ({
      ...prev,
      [collection._id]: !prev[collection._id],
    }));
  };

  const handleAddCollection = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No authentication token found.");

      const { data: newCollection } = await axios.post(`${API_BASE}/collections`,
        { name: `New Collection ${collections.length + 1}`, requests: [] },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      setCollections([...collections, newCollection]);
      setEditingId(newCollection._id);
      setNewName(newCollection.name);
    } catch (error) {
      console.error("Error adding collection:", error);
    }
  };

  const handleRenameCollection = async (_id) => {
    if (!newName.trim()) return;
    try {
      await axios.put(`${API_BASE}/collections/${_id}`, { name: newName });
      setCollections((prev) =>
        prev.map((col) => (col._id === _id ? { ...col, name: newName } : col))
      );
      setEditingId(null);
    } catch (error) {
      console.error("Error renaming collection:", error);
    }
  };

  const handleDeleteCollection = (_id, name) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: `Are you sure you want to delete "${name}"?`,
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await axios.delete(`${API_BASE}/collections/${_id}`);
              setCollections((prev) => prev.filter((col) => col._id !== _id));
              if (activeCollectionId === _id) setActiveCollectionId(null);
            } catch (error) {
              console.error("Error deleting collection:", error);
            }
          },
        },
        { label: "No" },
      ],
    });
  };

  const handleRunCollection = async () => {
    if (!activeCollectionId) return;
  
    const collection = collections.find((col) => col._id === activeCollectionId);
    if (!collection) return;
  
    setRunningCollectionId(activeCollectionId);
    setResponse([]); // Reset responses before making new requests
    setError(""); // Reset errors
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found.");
        setResponseModel(true);
        return;
      }
  
      let newResponses = [];
  
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
            validateStatus: () => true, // Ensures all responses are captured
          });
  
          newResponses.push({
            status: response.status,
            statusText: response.statusText,
            data: response.data,
            headers: response.headers,
            request,
          });
        } catch (error) {
          // Capture request errors separately
          newResponses.push({
            status: error.response?.status || 500,
            statusText: error.response?.statusText || "Error",
            data: error.response?.data || "Request failed",
            headers: error.response?.headers || {},
            request,
          });
        }
      }
  
      setResponse(newResponses);
      setResponseModel(true);
      console.log(newResponses);
    } catch (error) {
      console.error("Error running collection:", error);
      setError(error.response?.data?.message || "Failed to run collection.");
      setResponseModel(true);
    } finally {
      setRunningCollectionId(null);
    }
  };
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    setExpandedCollections({}); // Collapse all collections
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div
      className={`h-screen  bg-purple-300 text-white shadow-xl  flex flex-col rounded-tr-xl rounded-br-xl transition-all duration-300 backdrop-blur-lg ${isCollapsed ? "w-20" : "w-64"
        }`}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-1">
          <Link to="/dashboard"><FaLeaf className="text-purple-900 m-2" /></Link>
          {!isCollapsed && <img src="/icon.jpg" alt="App Logo" className="w-10 h-10 rounded-full" />}
          {!isCollapsed && <h1 className="text-xl font-bold text-purple-700">PIX</h1>}
        </div>
        <button
          className="rounded-full p-2 text-purple-500 hover:bg-purple-700 hover:text-white transition-colors duration-200"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <FaArrowRight /> : <FaTimes />}
        </button>
      </div>

      <div className="border-b border-purple-600 flex justify-between items-center p-4">
        {!isCollapsed && <h2 className="text-lg font-semibold text-purple-700">Collections</h2>}
        <div className="flex gap-2 bg-purple-300 p-2 rounded-lg">
          <button
            className="p-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors duration-200"
            onClick={handleAddCollection}
            aria-label="Add Collection"
          >
            <FaPlus />
          </button>
          <button
            className="p-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors duration-200"
            onClick={handleRunCollection}
            aria-label="Run Collection"
            disabled={!activeCollectionId || runningCollectionId === activeCollectionId}
          >
            {runningCollectionId === activeCollectionId ? (
              <div className="animate-spin"><FaRecycle /></div>
            ) : (
              <FaPlay />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-2">
        {loading && <p className="text-center text-purple-700">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading &&
          !error &&
          collections.map((collection) => (
            <div key={collection._id}>
              <div
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-purple-700 transition-colors duration-200 ${activeCollectionId === collection._id ? "bg-purple-600" : "bg-purple-500"
                  }`}
                onClick={() => handleCollectionClick(collection)}
              >
                <div className="flex items-center gap-3">
                  {expandedCollections[collection._id] ? <FaChevronDown /> : <FaChevronRight />}
                  <FaFolderOpen className="text-yellow-400 mr-2 " />
                  {!isCollapsed &&
                    (editingId === collection._id ? (
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onBlur={() => handleRenameCollection(collection._id)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleRenameCollection(collection._id);
                        }}
                        className="bg-transparent border-b border-white focus:outline-none"
                        autoFocus
                      />
                    ) : (
                      <span>{collection.name}</span>
                    ))}
                </div>
                {!isCollapsed && (
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(collection._id);
                        setNewName(collection.name);
                      }}
                      className="p-1 hover:bg-purple-700 rounded transition-colors duration-200"
                      aria-label="Edit Collection"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCollection(collection._id, collection.name);
                      }}
                      className="p-1 hover:bg-purple-700 rounded transition-colors duration-200"
                      aria-label="Delete Collection"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
              {expandedCollections[collection._id] && (
                <div className="pl-8">
                  {collection.requests.map((request) => (
                    <div
                      key={request._id}
                      className="flex items-center justify-between gap-2 p-2 bg-purple-500 hover:bg-purple-700 hover:text-white  cursor-pointer transition-colors duration-200"
                      onClick={() => setSelectedRequest(request)}
                    >
                      <div className="flex items-center gap-2">
                        <FaFileAlt className="text-yellow-400 mr-2" />

                        {/* Edit Mode for Renaming Requests */}
                        {editingId === request._id ? (
                          <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onBlur={() => {
                              handleEditRequest(request._id, newName, collection._id);
                              setEditingId(null); // Exit edit mode
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleEditRequest(request._id, newName, collection._id);
                                setEditingId(null); // Exit edit mode
                              }
                            }}
                            className="bg-transparent border-b border-white focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <span>{request.name}</span>
                        )}

                      </div>

                      {/* Action Buttons (Edit & Delete) */}
                      <div className="flex gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(request._id);
                            setNewName(request.name);
                          }}
                          className="p-1 hover:bg-purple-700 rounded transition-colors duration-200"
                          aria-label="Edit Request"
                        >
                          <FaEdit />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRequest(request._id, collection._id);
                          }}
                          className="p-1 hover:bg-purple-700 rounded transition-colors duration-200"
                          aria-label="Delete Request"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>

      <div className="relative p-4 border-t border-purple-600">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <FaUser className="text-purple-700" />
          {!isCollapsed && <span className="text-purple-700">{userName}</span>}
        </div>
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute bottom-12 left-4 bg-purple-600 rounded-lg shadow-lg w-48"
          >
            <button
              className="w-full p-2 text-left hover:bg-purple-500 flex items-center gap-2 transition-colors duration-200"
              onClick={handleLogout}
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  onSelectCollection: PropTypes.func.isRequired,
};