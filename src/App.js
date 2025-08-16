import React, { useState } from "react";
import FilePicker from "./components/FilePicker";
import LogViewer from "./components/LogViewer";
import LogStatistics from "./components/LogStatistics";
import DateRangeViewer from "./components/DateRangeViewer";
import "./index.css"; // Import global styles

/**
 * Main App component to handle file selection, log viewing, and statistics.
 */
const App = () => {
  const [selectedFile, setSelectedFile] = useState(null); // Holds the selected file name
  const [fileContent, setFileContent] = useState(""); // Holds the content of the selected log file
  const [scrollToDate, setScrollToDate] = useState(null); // Holds the datetime to scroll to in the log file
  const [searchTerm, setSearchTerm] = useState(""); // Search keyword
  const [selectedSeverities, setSelectedSeverities] = useState({
    INFO: true,
    WARN: true,
    ERROR: true,
  });
  /**
   * Handles changes to the search input.
   * @param {object} e - The input event.
   */
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  /**
   * Handles changes to severity checkboxes.
   * @param {object} e - The input event.
   */
  const handleSeverityChange = (e) => {
    const { name, checked } = e.target;
    setSelectedSeverities((prev) => ({ ...prev, [name]: checked }));
  };

  /**
   * Filters log lines based on search term and selected severities.
   * @param {string} content - The log file content.
   * @returns {string} - Filtered log content as a string.
   */
  const getFilteredContent = (content) => {
    if (!content) return "";
    const severities = Object.keys(selectedSeverities).filter(
      (sev) => selectedSeverities[sev]
    );
    return content
      .split("\n")
      .filter((line) => {
        // Check severity
        const matchesSeverity =
          severities.length === 0 ||
          severities.some((sev) => line.includes(sev));
        // Check search term
        const matchesSearch =
          searchTerm === "" ||
          line.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSeverity && matchesSearch;
      })
      .join("\n");
  };

  /**
   * Handles file selection and reads the content of the file.
   * @param {File} file - The file object selected by the user.
   */
  const handleFileSelect = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result); // Set the content of the file
      setSelectedFile(file.name); // Set the selected file name
    };
    reader.readAsText(file); // Read the file content as text
  };

  /**
   * Handles the date selection to scroll to in the log viewer.
   * @param {Date} date - The datetime selected by the user.
   */
  const handleDateSelect = (date) => {
    setScrollToDate(date); // Set the datetime to scroll to
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
              fileContent={getFilteredContent(fileContent)}
              scrollToDate={scrollToDate}
            />
            {/* LogStatistics to display the log analysis */}
            <LogStatistics fileContent={fileContent} />
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
