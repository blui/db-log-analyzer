import React, { useState } from "react";
import "./FilePicker.css"; // Add this for custom table styling

const FilePicker = ({ onFileSelect }) => {
  const [files, setFiles] = useState([]);
  const [selectedDirectory, setSelectedDirectory] = useState("");
  const [error, setError] = useState("");

  const handleDirectorySelect = async () => {
    try {
      const directoryHandle = await window.showDirectoryPicker();
      const fileList = [];
      setSelectedDirectory(directoryHandle.name);

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
        <table className="file-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Size (KB)</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr
                key={index}
                className="file-row"
                onClick={() => handleFileClick(file)}
              >
                <td>{file.name}</td>
                <td>{(file.size / 1024).toFixed(2)}</td> {/* File size in KB */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FilePicker;
