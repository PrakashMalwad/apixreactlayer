import React from "react";

const TitleBar = () => {
  const handleClose = () => window.electron.send("close-app");
  const handleMinimize = () => window.electron.send("minimize-app");

  return (
    <div
      style={{
        height: "30px",
        width: "100%",
        background: "#8e44ad",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 10px",
        userSelect: "none",
        WebkitAppRegion: "drag",
      }}
    >
      <span>APIX</span>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={handleMinimize} style={{ background: "none", border: "none", color: "#fff" }}>➖</button>
        <button onClick={handleClose} style={{ background: "none", border: "none", color: "#fff" }}>❌</button>
      </div>
    </div>
  );
};

export default TitleBar;
