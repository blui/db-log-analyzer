import React, { useCallback, useMemo, useRef, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import "./LogViewer.css";

/**
 * LogViewer displays the content of the selected log file.
 * If scrollToDate is provided, it scrolls to the closest matching datetime.
 */

/**
 * Finds the index of the closest log line with a datetime >= the given date.
 * @param {Array} lines - Array of log lines.
 * @param {Date} date - The date to search for.
 * @returns {number} - The index of the closest log line or -1 if not found.
 */
function findClosestDateIndex(lines, date) {
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
}

const LogViewer = ({ selectedFile, fileContent, scrollToDate }) => {
  const lines = useMemo(
    () => (fileContent ? fileContent.split("\n") : []),
    [fileContent]
  );
  const rowHeight = 28;
  const containerHeight = 350;
  const listRef = useRef();

  // Scroll to the closest datetime when scrollToDate changes
  useEffect(() => {
    if (scrollToDate && listRef.current) {
      const idx = findClosestDateIndex(lines, scrollToDate);
      if (idx !== -1) {
        listRef.current.scrollToItem(idx, "center");
      }
    }
  }, [scrollToDate, lines]);

  // Row renderer for FixedSizeList
  const Row = useCallback(
    ({ index, style }) => {
      const line = lines[index];
      let severityClass = "";
      if (/\bERROR\b/.test(line)) severityClass = "error";
      else if (/\bWARN(ING)?\b/.test(line)) severityClass = "warn";
      else if (/\bINFO(RMATION)?\b/.test(line)) severityClass = "info";
      // Render a flex row: line number and log line
      return (
        <div
          key={index}
          id={`log-line-${index}`}
          className={`log-line${severityClass ? ` ${severityClass}` : ""}`}
          aria-label={`Line ${index + 1}: Log line ${index + 1}`}
          style={style}
        >
          {/* Line number column */}
          <span className="log-line-number" aria-hidden="true">
            {index + 1}
          </span>
          {/* Log line text */}
          <span className="log-line-text">{line}</span>
        </div>
      );
    },
    [lines]
  );

  return (
    <div className="log-viewer-container">
      <h3>Viewing: {selectedFile}</h3>
      {lines.length > 0 ? (
        <List
          height={containerHeight}
          itemCount={lines.length}
          itemSize={rowHeight}
          width={"100%"}
          aria-label="Log file content"
          ref={listRef}
        >
          {Row}
        </List>
      ) : (
        <div className="log-viewer-placeholder">No log file selected.</div>
      )}
    </div>
  );
};

export default LogViewer;
