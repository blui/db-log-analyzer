import React, { useState } from "react";
import FilePicker from "./components/FilePicker";
import LogViewer from "./components/LogViewer";
import LogStatistics from "./components/LogStatistics";
import "./index.css"; // Ensure that the global styles are applied

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");

  const handleFileSelect = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result);
      setSelectedFile(file.name);
    };
    reader.readAsText(file);
  };

  return (
    <div className="container">
      <h1>DataBridge Log Analyzer</h1>
      <FilePicker onFileSelect={handleFileSelect} />
      {selectedFile && (
        <>
          <LogViewer selectedFile={selectedFile} fileContent={fileContent} />
          <LogStatistics fileContent={fileContent} />
        </>
      )}
    </div>
  );
};

export default App;
