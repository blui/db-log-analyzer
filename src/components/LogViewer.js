import React, { useCallback, useMemo, useRef, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import "./LogViewer.css";

/**
 * LogViewer displays the content of the selected log file with virtualized rendering for performance.
 * If scrollToDate is provided, the viewer scrolls to the closest matching datetime.
 * Line numbers and severity highlighting are included for clarity and usability.
 *
 * @component
 * @param {Object} props
 * @param {string} props.selectedFile - The name of the currently selected file.
 * @param {string} props.fileContent - The content of the selected log file.
 * @param {Date|null} props.scrollToDate - The datetime to scroll to, if provided.
 */

/**
 * Finds the index of the first log line with a datetime greater than or equal to the specified date.
 * @param {string[]} lines - Array of log lines.
 * @param {Date} date - The date to search for.
 * @returns {number} The index of the closest log line, or -1 if not found.
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
  // Split file content into lines for rendering
  const lines = useMemo(
    () => (fileContent ? fileContent.split("\n") : []),
    [fileContent]
  );
  // Fixed row height for virtualized list performance
  const rowHeight = 28;
  // Height of the log viewer container
  const containerHeight = 350;
  // Ref to the virtualized list for programmatic scrolling
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

  /**
   * Renders a single row in the virtualized log list.
   * Applies severity-based styling and displays the line number.
   *
   * @param {Object} param0
   * @param {number} param0.index - The index of the log line.
   * @param {Object} param0.style - The style object for positioning (from react-window).
   * @returns {JSX.Element}
   */
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
