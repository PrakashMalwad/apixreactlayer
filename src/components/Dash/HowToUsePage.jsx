import React from "react";
import { FaPlay } from "react-icons/fa";


export default function HowToUsePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-purple-700 text-center mb-8">
          How to Use APIX Tool
        </h1>

        {/* Introduction */}
        <div className="mb-8">
          <p className="text-lg text-gray-700">
            APIX is a powerful tool for managing and testing API collections. Follow the steps below to get started:
          </p>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <span className="flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-full text-xl font-bold">
                1
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-purple-700">Create a Collection</h2>
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
              <h2 className="text-2xl font-semibold text-purple-700">Add API Requests</h2>
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
              <h2 className="text-2xl font-semibold text-purple-700">Run Requests</h2>
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
              <h2 className="text-2xl font-semibold text-purple-700">View Responses</h2>
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
              <h2 className="text-2xl font-semibold text-purple-700">Save and Organize</h2>
              <p className="mt-2 text-gray-600">
                Save your collections and requests for future use. Use folders and tags to organize your work efficiently.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Tips */}
        <div className="mt-12 p-6 bg-purple-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">Pro Tips</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Use environment variables to manage different configurations (e.g., staging vs. production).</li>
            <li>Export your collections to share with your team or for backup purposes.</li>
            <li>Use the search feature to quickly find specific requests or collections.</li>
          </ul>
        </div>

        {/* Call-to-Action */}
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700 mb-4">
            Ready to get started? Create your first collection now!
          </p>
          <button
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            onClick={() => alert("Let's create your first collection!")}
          >
            Create Collection
          </button>
        </div>
      </div>
    </div>
  );
}