import React, { useState } from "react";
import "./FilePicker.css";

/**
 * FilePicker component allows the user to select a directory and display .log and .txt files found in that directory.
 * The user can then click a file to load its contents.
 */
const FilePicker = ({ onFileSelect }) => {
  const [files, setFiles] = useState([]); // List of files in the selected directory
  const [selectedDirectory, setSelectedDirectory] = useState(""); // Name of the selected directory
  const [error, setError] = useState(""); // Error message

  // Handle directory selection using File System Access API
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
      // Handle permission denied or unsupported browser
      setError(
        "Failed to access the directory. Please try again or check browser permissions."
      );
    }
  };

  // Handle file selection when a file row is clicked
  const handleFileClick = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      onFileSelect(file, reader.result);
    };
    reader.readAsText(file);
  };

  return (
    <div>
      {/* Directory picker section */}
      <div className="directory-picker">
        <button
          onClick={handleDirectorySelect}
          aria-label="Select directory for log files"
        >
          Select Directory
        </button>
        {selectedDirectory && (
          <span className="directory-name" aria-live="polite">
            {selectedDirectory} selected. The following compatible files were
            found:
          </span>
        )}
      </div>

      {/* Display error message if there is any */}
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {/* Display table of files if files are found */}
      {files.length > 0 && (
        <table className="file-table">
          <thead>
            <tr>
              <th scope="col">File Name</th>
              <th scope="col">Size (KB)</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr
                key={index}
                className="file-row"
                onClick={() => handleFileClick(file)}
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleFileClick(file);
                }}
                aria-label={`Select file ${file.name}`}
              >
                <td>{file.name}</td>
                <td>{(file.size / 1024).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FilePicker;
