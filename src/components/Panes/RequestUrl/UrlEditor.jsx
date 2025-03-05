import React from 'react';
import PropTypes from 'prop-types';

const requestMethods = [
  { slug: 'get', method: 'GET' },
  { slug: 'post', method: 'POST' },
  { slug: 'put', method: 'PUT' },
  { slug: 'patch', method: 'PATCH' },
  { slug: 'delete', method: 'DELETE' },
];

export default function UrlEditor({
  url,
  setUrl,
  reqMethod,
  setReqMethod,
  onInputSend,
  onKeyDown, 
}) {
  return (
    <form className="flex">
      <select
        className="px-4 py-2 border rounded-md border-purple-300 hover:border-purple-500 focus:outline-purple-500 bg-purple-50 transition-colors duration-200"
        value={reqMethod}
        onChange={(e) => setReqMethod(e.target.value)}
      >
        {requestMethods.map((option) => (
          <option key={option.slug} value={option.method}>
            {option.method}
          </option>
        ))}
      </select>
      <input
        className="ml-3 w-full px-4 py-2 border rounded-md border-gray-300 hover:border-purple-500 focus:outline-purple-500 transition-colors duration-200"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={onKeyDown} 
        placeholder="Enter URL"
      />
      <button
        className="ml-3 px-6 py-2 rounded-md font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
        type="button"
        onClick={(e) => onInputSend(e)}
      >
        Send
      </button>
    </form>
  );
}

UrlEditor.propTypes = {
  url: PropTypes.string.isRequired,
  setUrl: PropTypes.func.isRequired,
  reqMethod: PropTypes.string.isRequired,
  setReqMethod: PropTypes.func.isRequired,
  onInputSend: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func, // Add onKeyDown prop type
};