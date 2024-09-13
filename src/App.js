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
            {/* DateRangeViewer to select a specific date in the log */}
            <DateRangeViewer
              fileContent={fileContent}
              onDateSelect={handleDateSelect}
            />
            {/* LogViewer to display the log content */}
            <LogViewer
              selectedFile={selectedFile}
              fileContent={fileContent}
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
