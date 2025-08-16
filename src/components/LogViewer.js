import React, { useRef, useEffect } from "react";
import "./LogViewer.css";

/**
 * Finds the index of the closest log line with a datetime >= the given date.
 * @param {Array} lines - Array of log lines.
 * @param {Date} date - The date to search for.
 * @returns {number} - The index of the closest log line or -1 if not found.
 */
const findClosestDateIndex = (lines, date) => {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Match lines that have a datetime in the format: YYYY-MM-DD HH:MM:SS,SSS
    const match = line.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3}/);
    if (match) {
      // Convert matched datetime string into a valid JS Date object
      const lineDate = new Date(match[0].replace(",", "."));
      if (lineDate >= date) {
        return i;
      }
    }
  }
  return -1;
};

/**
 * LogViewer displays the content of the selected log file.
 * If scrollToDate is provided, it scrolls to the closest matching datetime.
 */
const LogViewer = ({ selectedFile, fileContent, scrollToDate }) => {
  const logViewerRef = useRef(null);
  const lines = fileContent.split("\n");

  // Scroll to the closest datetime when scrollToDate changes
  useEffect(() => {
    if (scrollToDate) {
      const closestIndex = findClosestDateIndex(lines, scrollToDate);
      if (closestIndex !== -1 && logViewerRef.current) {
        const logLineElement = logViewerRef.current.querySelector(
          `#log-line-${closestIndex}`
        );
        if (logLineElement) {
          logLineElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    }
  }, [scrollToDate, lines]);

  return (
    <div className="log-viewer-container">
      <h3>Viewing: {selectedFile}</h3>
      <div
        className="log-viewer"
        ref={logViewerRef}
        aria-label="Log file content"
        tabIndex={0}
      >
        {lines.map((line, index) => (
          <div
            key={index}
            id={`log-line-${index}`}
            className="log-line"
            aria-label={`Log line ${index + 1}`}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogViewer;
