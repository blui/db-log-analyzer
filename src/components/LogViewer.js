import React from "react";

const LogViewer = ({ selectedFile, fileContent }) => {
  return (
    <div>
      <h3>Viewing: {selectedFile}</h3>
      <textarea value={fileContent} readOnly />
    </div>
  );
};

export default LogViewer;
