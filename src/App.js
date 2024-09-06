import React, { useState } from "react";
import FilePicker from "./components/FilePicker";
import LogViewer from "./components/LogViewer";
import LogStatistics from "./components/LogStatistics";
import "./index.css"; // Global styles

const App = () => {
  // State to hold the selected file name
  const [selectedFile, setSelectedFile] = useState(null);
  // State to hold the content of the selected log file
  const [fileContent, setFileContent] = useState("");

  // Function to handle file selection from FilePicker
  const handleFileSelect = (file) => {
    const reader = new FileReader(); // FileReader API to read the file
    reader.onload = (e) => {
      // Set the file content once it is loaded
      setFileContent(e.target.result);
      // Set the file name for display
      setSelectedFile(file.name);
    };
    reader.readAsText(file); // Read the file as text
  };

  return (
    <>
      {/* Header banner displaying the app title */}
      <header>
        <h1>DataBridge Log Analyzer</h1>
      </header>
      <div className="container">
        {/* FilePicker component for file selection */}
        <FilePicker onFileSelect={handleFileSelect} />
        {selectedFile && (
          <>
            {/* Display the selected file content */}
            <LogViewer selectedFile={selectedFile} fileContent={fileContent} />
            {/* Display statistics based on the file content */}
            <LogStatistics fileContent={fileContent} />
          </>
        )}
      </div>
    </>
  );
};

export default App;
