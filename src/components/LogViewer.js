import React, { useRef, useEffect } from "react";
import "./LogViewer.css"; // Custom styling for LogViewer

/**
 * Function to find the index of the closest date in the log lines.
 * @param {Array} lines - Array of log lines.
 * @param {Date} date - The date to search for.
 * @returns {number} - The index of the closest log line with the matching or closest date.
 */
const findClosestDateIndex = (lines, date) => {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Match lines that have a datetime in the format: YYYY-MM-DD HH:MM:SS,SSS
    const match = line.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3}/);
    if (match) {
      // Convert matched datetime string into a valid JS Date object
      const lineDate = new Date(match[0].replace(",", ".")); // Replace comma with period to match JS Date format
      if (lineDate >= date) {
        return i; // Return index of the first line that matches or is after the target date
      }
    }
  }
  return -1; // Return -1 if no matching date is found
};

/**
 * LogViewer component to display the content of the selected log file.
 * It also scrolls to the closest datetime if provided via the scrollToDate prop.
 */
const LogViewer = ({ selectedFile, fileContent, scrollToDate }) => {
  const logViewerRef = useRef(null); // Reference to the log viewer div
  const lines = fileContent.split("\n"); // Split the file content into individual lines

  // Effect to handle scrolling to the closest datetime when scrollToDate changes
  useEffect(() => {
    if (scrollToDate) {
      const closestIndex = findClosestDateIndex(lines, scrollToDate); // Find the closest matching date in the log
      if (closestIndex !== -1 && logViewerRef.current) {
        const logLineElement = logViewerRef.current.querySelector(
          `#log-line-${closestIndex}`
        );
        if (logLineElement) {
          // Smoothly scroll the log line into view, centered vertically
          logLineElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    }
  }, [scrollToDate, lines]); // Effect depends on scrollToDate and the lines array

  return (
    <div className="log-viewer-container">
      <h3>Viewing: {selectedFile}</h3>{" "}
      {/* Display the name of the selected file */}
      <div className="log-viewer" ref={logViewerRef}>
        {/* Map through lines and display each one */}
        {lines.map((line, index) => (
          <div key={index} id={`log-line-${index}`} className="log-line">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogViewer;
