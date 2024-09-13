import React, { useEffect, useState } from "react";
import "./LogStatistics.css"; // Custom styling for LogStatistics

/**
 * Parses the log file content into an object containing event messages and their occurrences.
 * @param {string} content - The content of the log file.
 * @returns {object} - An object where each key is an event message and each value is an array of occurrences.
 */
const parseLogFile = (content) => {
  const sections = content.split(
    "==========================================================================="
  ); // Split log file into sections based on the separator
  const occurrences = {};

  sections.forEach((section) => {
    // Regex to match timestamp and event message
    const eventRegex =
      /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3}) \[\d+\] (.+?)(?=Mem Usage|\n===========================================================================|\n$)/s;
    const stackTraceRegex = /(at .+)/g; // Regex to match stack traces
    const match = section.match(eventRegex); // Match timestamp and event message

    if (match) {
      const timestamp = match[1]; // Extract the timestamp
      const eventMessage = match[2].trim(); // Extract and trim the event message

      // Match any stack trace found in the section
      const stackTraceMatches = section.match(stackTraceRegex);
      const stackTrace = stackTraceMatches
        ? stackTraceMatches.join("\n") // Join multiple stack trace lines
        : "No stack trace"; // Default if no stack trace is found

      // Add the event to the occurrences object
      if (!occurrences[eventMessage]) {
        occurrences[eventMessage] = [];
      }

      // Push the occurrence with timestamp, message, and stack trace
      occurrences[eventMessage].push({
        timestamp,
        eventMessage,
        stackTrace,
      });
    }
  });

  return occurrences; // Return the parsed occurrences
};

/**
 * Sorts events based on the number of occurrences, in descending order.
 * @param {object} events - An object where each key is an event and value is an array of occurrences.
 * @returns {Array} - An array of event entries sorted by the number of occurrences.
 */
const sortEventsByOccurrences = (events) => {
  return Object.entries(events).sort(
    ([, aOccurrences], [, bOccurrences]) =>
      bOccurrences.length - aOccurrences.length
  );
};

/**
 * LogStatistics component analyzes the log file and displays a summary of events and their occurrences.
 */
const LogStatistics = ({ fileContent }) => {
  const [eventOccurrences, setEventOccurrences] = useState({}); // Holds event occurrences parsed from the log file
  const [expandedEvent, setExpandedEvent] = useState(null); // Tracks the currently expanded event for details
  const [totalEvents, setTotalEvents] = useState(0); // Tracks the total number of events in the log file

  // Parse the log file content when it changes
  useEffect(() => {
    if (fileContent) {
      const parsedEvents = parseLogFile(fileContent); // Parse the log file content
      setEventOccurrences(parsedEvents); // Update the event occurrences state

      // Calculate the total number of events
      const total = Object.values(parsedEvents).reduce(
        (acc, occurrences) => acc + occurrences.length,
        0
      );
      setTotalEvents(total); // Set the total number of events
    }
  }, [fileContent]); // Re-run the effect when fileContent changes

  /**
   * Toggles the expanded state for displaying event details.
   * @param {string} event - The event message to expand or collapse.
   */
  const toggleExpandEvent = (event) => {
    setExpandedEvent(expandedEvent === event ? null : event); // Toggle between expanded and collapsed state
  };

  return (
    <div>
      <h3>Log Statistics</h3>
      <p>Total Events: {totalEvents}</p> {/* Display total event count */}
      <table className="log-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {sortEventsByOccurrences(eventOccurrences).map(
            ([event, occurrences], index) => (
              <React.Fragment key={index}>
                <tr
                  onClick={() => toggleExpandEvent(event)} // Toggle expansion on click
                  className="clickable-row"
                >
                  <td>{event}</td>
                  <td>{occurrences.length}</td>{" "}
                  {/* Display the count of occurrences */}
                </tr>
                {expandedEvent === event && (
                  <tr>
                    <td colSpan="2">
                      <table className="expanded-table">
                        <thead>
                          <tr>
                            <th>Timestamp</th>
                            <th>Event Message</th>
                            <th>Stack Trace</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Sort occurrences by timestamp before displaying */}
                          {occurrences
                            .sort(
                              (a, b) =>
                                new Date(a.timestamp) - new Date(b.timestamp)
                            )
                            .map((occurrence, idx) => (
                              <tr key={idx}>
                                <td className="timestamp-column">
                                  {occurrence.timestamp}
                                </td>
                                <td className="event-message-column">
                                  {occurrence.eventMessage}
                                </td>
                                <td className="stack-trace-column">
                                  <pre>{occurrence.stackTrace}</pre>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LogStatistics;
