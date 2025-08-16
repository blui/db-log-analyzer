import React, { useEffect, useState } from "react";
import "./LogStatistics.css";

/**
 * Parses the log file content into an object containing event messages and their occurrences.
 * @param {string} content - The content of the log file.
 * @returns {object} - An object where each key is an event message and each value is an array of occurrences.
 */
const parseLogFile = (content) => {
  if (!content) return {};
  const sections = content.split(
    "==========================================================================="
  );
  const occurrences = {};
  sections.forEach((section) => {
    // Regex to match timestamp and event message
    const eventRegex =
      /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3}) \[\d+\] (.+?)(?=Mem Usage|\n===========================================================================|\n$)/s;
    const stackTraceRegex = /(at .+)/g;
    const match = section.match(eventRegex);
    if (match) {
      const timestamp = match[1];
      const eventMessage = match[2].trim();
      const stackTraceMatches = section.match(stackTraceRegex);
      const stackTrace = stackTraceMatches
        ? stackTraceMatches.join("\n")
        : "No stack trace";
      if (!occurrences[eventMessage]) occurrences[eventMessage] = [];
      occurrences[eventMessage].push({ timestamp, eventMessage, stackTrace });
    }
  });
  return occurrences;
};

/**
 * Sorts events based on the number of occurrences, in descending order.
 * @param {object} events - An object where each key is an event and value is an array of occurrences.
 * @returns {Array} - An array of event entries sorted by the number of occurrences.
 */
const sortEventsByOccurrences = (events) =>
  Object.entries(events).sort(([, a], [, b]) => b.length - a.length);

/**
 * LogStatistics analyzes the log file and displays a summary of events and their occurrences.
 */
const LogStatistics = ({ fileContent }) => {
  const [eventOccurrences, setEventOccurrences] = useState({});
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [totalEvents, setTotalEvents] = useState(0);

  // Parse the log file content when it changes
  useEffect(() => {
    const parsedEvents = parseLogFile(fileContent);
    setEventOccurrences(parsedEvents);
    const total = Object.values(parsedEvents).reduce(
      (acc, occurrences) => acc + occurrences.length,
      0
    );
    setTotalEvents(total);
  }, [fileContent]);

  // Toggle the expanded state for displaying event details
  const toggleExpandEvent = (event) => {
    setExpandedEvent(expandedEvent === event ? null : event);
  };

  return (
    <div>
      <h3>Log Statistics</h3>
      <p>Total Events: {totalEvents}</p>
      <table className="log-table" aria-label="Log event statistics">
        <thead>
          <tr>
            <th scope="col">Event</th>
            <th scope="col">Count</th>
          </tr>
        </thead>
        <tbody>
          {sortEventsByOccurrences(eventOccurrences).map(
            ([event, occurrences], index) => (
              <React.Fragment key={index}>
                <tr
                  onClick={() => toggleExpandEvent(event)}
                  className="clickable-row"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      toggleExpandEvent(event);
                  }}
                  aria-label={`Expand event ${event}`}
                >
                  <td>{event}</td>
                  <td>{occurrences.length}</td>
                </tr>
                {expandedEvent === event && (
                  <tr>
                    <td colSpan="2">
                      <table
                        className="expanded-table"
                        aria-label={`Occurrences for event ${event}`}
                      >
                        <thead>
                          <tr>
                            <th scope="col">Timestamp</th>
                            <th scope="col">Event Message</th>
                            <th scope="col">Stack Trace</th>
                          </tr>
                        </thead>
                        <tbody>
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
