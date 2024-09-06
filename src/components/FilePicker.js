import React from "react";

// FilePicker component allows users to select a log file for analysis
const FilePicker = ({ onFileSelect }) => {
  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    // Check if the file is either a .log or .txt file
    if (file && (file.name.endsWith(".log") || file.name.endsWith(".txt"))) {
      onFileSelect(file); // Pass the file to the parent component
    }
  };

  return (
    <div>
      {/* File input for selecting .log or .txt files */}
      <input type="file" accept=".log,.txt" onChange={handleFileChange} />
      <button>Select File</button>
    </div>
  );
};

export default FilePicker;
