import React from "react";

// LogViewer displays the content of the selected log file
const LogViewer = ({ selectedFile, fileContent }) => {
  return (
    <div>
      {/* Display the name of the selected file */}
      <h3>Viewing: {selectedFile}</h3>
      {/* Display the log content in a read-only text area */}
      <textarea value={fileContent} readOnly />
    </div>
  );
};

export default LogViewer;
