import React from "react";

const LogViewer = ({ selectedFile, fileContent }) => (
  <div>
    <h3>Viewing: {selectedFile}</h3>
    <textarea value={fileContent} readOnly aria-label="Log file content" />
  </div>
);

export default LogViewer;
