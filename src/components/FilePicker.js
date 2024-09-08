import React, { useState } from "react";
import "./FilePicker.css"; // Add this for custom styling

const FilePicker = ({ onFileSelect }) => {
  const [files, setFiles] = useState([]);
  const [selectedDirectory, setSelectedDirectory] = useState("");
  const [error, setError] = useState("");

  const handleDirectorySelect = async () => {
    try {
      const directoryHandle = await window.showDirectoryPicker();
      const fileList = [];
      setSelectedDirectory(directoryHandle.name); // Set the selected directory name

      for await (const entry of directoryHandle.values()) {
        if (
          entry.kind === "file" &&
          (entry.name.endsWith(".log") || entry.name.endsWith(".txt"))
        ) {
          const file = await entry.getFile();
          fileList.push(file);
        }
      }

      setFiles(fileList);
      setError("");
    } catch (error) {
      console.error("Error accessing directory:", error);
      setError("Failed to access the directory. Please try again.");
    }
  };

  const handleFileClick = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      onFileSelect(file, reader.result);
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div className="directory-picker">
        <button onClick={handleDirectorySelect}>Select Directory</button>
        {selectedDirectory && (
          <span className="directory-name">
            {selectedDirectory} selected. The following log files were found:
          </span>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}

      {files.length > 0 && (
        <div className="file-grid">
          {files.map((file, index) => (
            <div
              key={index}
              className="file-item"
              onClick={() => handleFileClick(file)}
            >
              {file.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilePicker;
