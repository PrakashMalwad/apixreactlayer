import React from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import KeyValueEditor from "./KeyValueEditor";

export default function KeyValuePane({ paneValue, setPaneValue }) {
  const onKeyPairAdd = () => {
    setPaneValue((prev) => [
      ...prev,
      { id: uuidv4(), keyItem: "", valueItem: "" },
    ]);
  };

  const onKeyPairRemove = (keyPair) => {
    setPaneValue((prev) => prev.filter((x) => x.id !== keyPair.id));
  };

  const onKeyPairUpdate = (updatedPair) => {
    setPaneValue((prev) =>
      prev.map((pair) => (pair.id === updatedPair.id ? updatedPair : pair))
    );
  };

  return (
    <div>
      {paneValue.map((keyPair) => (
        <KeyValueEditor
          key={keyPair.id}
          keyPair={keyPair}
          setKeyPair={onKeyPairUpdate}
          onKeyPairRemove={onKeyPairRemove}
        />
      ))}
      <button
        className="px-6 py-1.5 mt-2 rounded-md text-purple-600 border border-purple-400 hover:bg-purple-50 transition-colors duration-200"
        onClick={onKeyPairAdd}
      >
        Add
      </button>
    </div>
  );
}

KeyValuePane.propTypes = {
  paneValue: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      keyItem: PropTypes.string,
      valueItem: PropTypes.string,
    })
  ).isRequired,
  setPaneValue: PropTypes.func.isRequired,
};