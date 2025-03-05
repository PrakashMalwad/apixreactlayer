import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';

export default function KeyValueEditor({ keyPair, setKeyPair, onKeyPairRemove }) {
  const [keyValue, setKeyValue] = useState(keyPair);

  useEffect(() => {
    setKeyValue(keyPair);
  }, [keyPair]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setKeyPair(keyValue);
    }, 500); // Reduced debounce time for faster updates
    return () => clearTimeout(timerId);
  }, [keyValue, setKeyPair]);

  const handleOnChange = (e) => {
    setKeyValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex mb-3">
      <input
        className="px-4 py-1.5 w-full border border-gray-300 rounded-md hover:border-purple-500 focus:outline-purple-500 transition-colors duration-200"
        placeholder="Key"
        name="keyItem"
        value={keyValue.keyItem || ""}
        onChange={handleOnChange}
      />
      <input
        className="ml-3 px-4 py-1.5 w-full border border-gray-300 rounded-md hover:border-purple-500 focus:outline-purple-500 transition-colors duration-200"
        placeholder="Value"
        name="valueItem"
        value={keyValue.valueItem || ""}
        onChange={handleOnChange}
      />
      <button
        className="ml-4 px-4 py-1.5 rounded-md text-red-500 border border-red-300 hover:bg-red-50 transition-colors duration-200"
        onClick={() => onKeyPairRemove(keyPair)}
      >
        Remove
      </button>
    </div>
  );
}

KeyValueEditor.propTypes = {
  keyPair: PropTypes.object.isRequired,
  setKeyPair: PropTypes.func.isRequired,
  onKeyPairRemove: PropTypes.func.isRequired,
};