import React, { useState } from "react";
import "./FilePicker.css";

/**
 * FilePicker enables users to select a directory and lists all .log and .txt files found within.
 * Users can select a file to load its contents for analysis.
 *
 * @component
 * @param {Object} props
 * @param {function} props.onFileSelect - Callback invoked with the selected file and its content.
 */
const FilePicker = ({ onFileSelect }) => {
  // List of files in the selected directory
  const [files, setFiles] = useState([]);
  // Name of the selected directory
  const [selectedDirectory, setSelectedDirectory] = useState("");
  // Error message for directory or file access
  const [error, setError] = useState("");

  /**
   * Handles directory selection using the File System Access API.
   * Populates the file list with .log and .txt files from the selected directory.
   */
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

  /**
   * Handles file selection when a file row is clicked.
   * Reads the file content and invokes the onFileSelect callback.
   * @param {File} file - The selected file object.
   */
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

      {/* Error message display */}
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {/* Table of files if any are found */}
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
