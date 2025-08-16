import React, { useState, useMemo } from "react";
import FilePicker from "./components/FilePicker";
import LogViewer from "./components/LogViewer";
import LogStatistics from "./components/LogStatistics";
import DateRangeViewer from "./components/DateRangeViewer";
import "./index.css"; // Import global styles

/**
 * Main App component to handle file selection, log viewing, and statistics.
 */
const App = () => {
  // State for selected file, file content, scroll target, search, and severity filters
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [scrollToDate, setScrollToDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverities, setSelectedSeverities] = useState({
    INFO: true,
    WARN: true,
    ERROR: true,
  });
  /**
   * Handles changes to the search input.
   * @param {object} e - The input event.
   */
  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  /**
   * Handles changes to severity checkboxes.
   * @param {object} e - The input event.
   */
  // Handle severity checkbox changes
  const handleSeverityChange = (e) => {
    const { name, checked } = e.target;
    setSelectedSeverities((prev) => ({ ...prev, [name]: checked }));
  };

  /**
   * Filters log entries (multi-line) based on search term and selected severities.
   * Each entry starts with a timestamped line (YYYY-MM-DD HH:MM:SS,SSS) and includes all following lines until the next timestamped line or end of file.
   * @param {string} content - The log file content.
   * @returns {string} - Filtered log content as a string.
   */
  /**
   * Memoized function to filter log entries (multi-line) based on search term and selected severities.
   * Each entry starts with a timestamped line (YYYY-MM-DD HH:MM:SS,SSS) and includes all following lines until the next timestamped line or end of file.
   * If all severities are unchecked, returns an empty string for performance.
   */
  const filteredContent = useMemo(() => {
    if (!fileContent) return "";
    const severities = Object.keys(selectedSeverities).filter(
      (sev) => selectedSeverities[sev]
    );
    // If no severities are selected, show nothing
    if (severities.length === 0) return "";
    const lines = fileContent.split("\n");
    const entryRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3}/;
    const entries = [];
    let currentEntry = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (entryRegex.test(line)) {
        if (currentEntry.length > 0) entries.push(currentEntry);
        currentEntry = [line];
      } else {
        currentEntry.push(line);
      }
    }
    if (currentEntry.length > 0) entries.push(currentEntry);
    // Filter entries by header line
    const filtered = entries.filter((entry) => {
      const header = entry[0] || "";
      const matchesSeverity = severities.some((sev) => header.includes(sev));
      const matchesSearch =
        searchTerm === "" ||
        header.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSeverity && matchesSearch;
    });
    return filtered.map((entry) => entry.join("\n")).join("\n");
  }, [fileContent, selectedSeverities, searchTerm]);

  /**
   * Handles file selection and reads the content of the file.
   * @param {File} file - The file object selected by the user.
   */
  // Handle file selection and read content
  const handleFileSelect = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result);
      setSelectedFile(file.name);
    };
    reader.readAsText(file);
  };

  /**
   * Handles the date selection to scroll to in the log viewer.
   * @param {Date} date - The datetime selected by the user.
   */
  // Handle date selection for scrolling
  const handleDateSelect = (date) => {
    setScrollToDate(date);
  };

  return (
    <>
      <header>
        <h1>Log Analyzer</h1> {/* Application title */}
      </header>
      <div className="container">
        {/* FilePicker component to select a log file */}
        <FilePicker onFileSelect={handleFileSelect} />
        {selectedFile && (
          <>
            {/* Search and filter controls */}
            <div
              className="search-filter-controls"
              style={{ margin: "16px 0" }}
            >
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ marginRight: "16px", padding: "4px 8px" }}
                aria-label="Search logs"
              />
              <label style={{ marginRight: "8px" }}>
                <input
                  type="checkbox"
                  name="INFO"
                  checked={selectedSeverities.INFO}
                  onChange={handleSeverityChange}
                />
                INFO
              </label>
              <label style={{ marginRight: "8px" }}>
                <input
                  type="checkbox"
                  name="WARN"
                  checked={selectedSeverities.WARN}
                  onChange={handleSeverityChange}
                />
                WARN
              </label>
              <label>
                <input
                  type="checkbox"
                  name="ERROR"
                  checked={selectedSeverities.ERROR}
                  onChange={handleSeverityChange}
                />
                ERROR
              </label>
            </div>
            {/* DateRangeViewer to select a specific date in the log */}
            <DateRangeViewer
              fileContent={fileContent}
              onDateSelect={handleDateSelect}
            />
            {/* LogViewer to display the filtered log content */}
            <LogViewer
              selectedFile={selectedFile}
              fileContent={filteredContent}
              scrollToDate={scrollToDate}
            />
            {/* LogStatistics to display the log analysis for filtered content */}
            <LogStatistics fileContent={filteredContent} />
          </>
        )}
      </div>
      <footer>
        <p>&copy; {new Date().getFullYear()} Brian Lui. All rights reserved.</p>{" "}
        {/* Footer with current year */}
      </footer>
    </>
  );
};

export default App;
