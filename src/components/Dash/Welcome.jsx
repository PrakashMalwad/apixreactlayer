import React, { useState } from "react";
import { FaPlay } from "react-icons/fa";

export default function WelcomeScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  // Function to open the modal
  const openModal = () => setIsModalOpen(true);

  // Function to close the modal
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="text-center">
        {/* Animated Logo or Icon */}
        <div className="animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 mx-auto text-purple-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
        </div>

        {/* Welcome Message */}
        <h1 className="text-4xl font-bold text-purple-700 mt-6">
          Welcome to the <span className="text-blue-600">APIX</span> Dashboard
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Your gateway to seamless API management and testing.
        </p>

        {/* Call-to-Action */}
        <p className="mt-6 text-gray-500">
          Select a collection from the sidebar to get started.
        </p>

        {/* Button to Open the Modal */}
        <button
          className="mt-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
          onClick={openModal}
          aria-label="Learn How to Use APIX"
        >
          How to Use APIX
        </button>

        
      </div>

      {/* Modal for How to Use APIX */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-10/12 max-w-4xl p-8 overflow-y-auto max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-purple-700">
                How to Use APIX Tool
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close Modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <span className="flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-full text-xl font-bold">
                    1
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-purple-700">
                    Create a Collection
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Start by creating a new collection to organize your API requests. Click the{" "}
                    <span className="inline-flex items-center bg-purple-100 text-purple-700 px-2 py-1 rounded-md">
                      <span className="mr-1">+</span> Add Collection
                    </span>{" "}
                    button in the sidebar.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <span className="flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-full text-xl font-bold">
                    2
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-purple-700">
                    Add API Requests
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Inside your collection, add API requests by specifying the method (GET, POST, etc.), URL, headers, and body.
                    Use the{" "}
                    <span className="inline-flex items-center bg-purple-100 text-purple-700 px-2 py-1 rounded-md">
                      <span className="mr-1">+</span> Add Request
                    </span>{" "}
                    button.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <span className="flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-full text-xl font-bold">
                    3
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-purple-700">
                    Run Requests
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Execute your API requests individually or run the entire collection at once. Click the{" "}
                    <span className="inline-flex items-center bg-purple-100 text-purple-700 px-2 py-1 rounded-md">
                      <FaPlay className="mr-1" /> Run Collection
                    </span>{" "}
                    button to test your APIs.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <span className="flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-full text-xl font-bold">
                    4
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-purple-700">
                    View Responses
                  </h3>
                  <p className="mt-2 text-gray-600">
                    After running a request, view the response in the main panel. You can see the status code, response body,
                    headers, and execution time.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <span className="flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-full text-xl font-bold">
                    5
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-purple-700">
                    Save and Organize
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Save your collections and requests for future use. Use folders and tags to organize your work efficiently.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-8 text-center">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                aria-label="Close Modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}