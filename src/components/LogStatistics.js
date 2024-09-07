import React, { useEffect, useState } from "react";

// Helper function to parse the log file content into events, timestamps, messages, and stack traces
const parseLogFile = (content) => {
  const sections = content.split(
    "==========================================================================="
  );
  const occurrences = {};

  sections.forEach((section) => {
    // Regex to capture timestamp, event description, and stack trace
    const eventRegex =
      /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3}) \[\d+\] (.+?)(?=Mem Usage|\n===========================================================================|\n$)/s;
    const stackTraceRegex = /(at .+)/g;
    const match = section.match(eventRegex);

    if (match) {
      const timestamp = match[1]; // Capture timestamp
      const eventMessage = match[2].trim(); // Capture event message

      const stackTraceMatches = section.match(stackTraceRegex); // Capture any stack trace
      const stackTrace = stackTraceMatches
        ? stackTraceMatches.join("\n")
        : "No stack trace";

      // If the event hasn't been encountered yet, initialize an array for it
      if (!occurrences[eventMessage]) {
        occurrences[eventMessage] = [];
      }
      // Add the event occurrence with the timestamp and stack trace
      occurrences[eventMessage].push({
        timestamp,
        eventMessage,
        stackTrace,
      });
    }
  });

  return occurrences;
};

// Helper function to sort events by the number of occurrences
const sortEventsByOccurrences = (events) => {
  return Object.entries(events).sort(
    ([, aOccurrences], [, bOccurrences]) =>
      bOccurrences.length - aOccurrences.length
  );
};

const LogStatistics = ({ fileContent }) => {
  const [eventOccurrences, setEventOccurrences] = useState({});
  const [expandedEvent, setExpandedEvent] = useState(null);

  // Parse the log file content when it changes
  useEffect(() => {
    if (fileContent) {
      setEventOccurrences(parseLogFile(fileContent));
    }
  }, [fileContent]);

  // Toggle the visibility of the expanded event details
  const toggleExpandEvent = (event) => {
    setExpandedEvent(expandedEvent === event ? null : event);
  };

  return (
    <div>
      <h3>Log Statistics</h3>
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
                  onClick={() => toggleExpandEvent(event)}
                  className="clickable-row"
                >
                  <td>{event}</td>
                  <td>{occurrences.length}</td>
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
