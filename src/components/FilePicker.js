import React, { useState } from "react";
import "./FilePicker.css"; // Custom styling for FilePicker

/**
 * FilePicker component allows the user to select a directory and display .log and .txt files found in that directory.
 * The user can then click a file to load its contents.
 */
const FilePicker = ({ onFileSelect }) => {
  const [files, setFiles] = useState([]); // Holds the list of files from the selected directory
  const [selectedDirectory, setSelectedDirectory] = useState(""); // Holds the name of the selected directory
  const [error, setError] = useState(""); // Holds any error messages

  // Handle directory selection using File System Access API
  const handleDirectorySelect = async () => {
    try {
      // Show directory picker and allow the user to choose a directory
      const directoryHandle = await window.showDirectoryPicker();
      const fileList = [];

      setSelectedDirectory(directoryHandle.name); // Set the name of the selected directory

      // Iterate through all entries in the directory
      for await (const entry of directoryHandle.values()) {
        // Filter for .log and .txt files
        if (
          entry.kind === "file" &&
          (entry.name.endsWith(".log") || entry.name.endsWith(".txt"))
        ) {
          const file = await entry.getFile(); // Retrieve file object
          fileList.push(file); // Add valid files to the list
        }
      }

      setFiles(fileList); // Update the state with the list of files
      setError(""); // Reset error if directory selection is successful
    } catch (error) {
      console.error("Error accessing directory:", error);
      setError("Failed to access the directory. Please try again."); // Set error message if directory access fails
    }
  };

  // Handle file selection when a file row is clicked
  const handleFileClick = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      onFileSelect(file, reader.result); // Pass the file content and file object to the parent component
    };
    reader.readAsText(file); // Read the file content as text
  };

  return (
    <div>
      {/* Directory picker section */}
      <div className="directory-picker">
        <button onClick={handleDirectorySelect}>Select Directory</button>
        {/* Display selected directory name if a directory is selected */}
        {selectedDirectory && (
          <span className="directory-name">
            {selectedDirectory} selected. The following compatible files were
            found:
          </span>
        )}
      </div>

      {/* Display error message if there is any */}
      {error && <p className="error-message">{error}</p>}

      {/* Display table of files if files are found */}
      {files.length > 0 && (
        <table className="file-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Size (KB)</th>
            </tr>
          </thead>
          <tbody>
            {/* Iterate through files and display each in a table row */}
            {files.map((file, index) => (
              <tr
                key={index}
                className="file-row"
                onClick={() => handleFileClick(file)}
              >
                <td>{file.name}</td>
                <td>{(file.size / 1024).toFixed(2)}</td>{" "}
                {/* Convert file size to KB */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FilePicker;
