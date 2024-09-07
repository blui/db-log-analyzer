import React, { useEffect, useState } from "react";

// Helper function to parse and sort log file content
const parseAndSortLogFile = (content) => {
  const sections = content.split(
    "==========================================================================="
  );
  const occurrences = {};

  sections.forEach((section) => {
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

      if (!occurrences[eventMessage]) {
        occurrences[eventMessage] = [];
      }

      occurrences[eventMessage].push({ timestamp, eventMessage, stackTrace });
    }
  });

  return Object.entries(occurrences).sort(
    ([, aOccurrences], [, bOccurrences]) =>
      bOccurrences.length - aOccurrences.length
  );
};

const LogStatistics = ({ fileContent }) => {
  const [eventOccurrences, setEventOccurrences] = useState([]);
  const [expandedEvent, setExpandedEvent] = useState(null);

  useEffect(() => {
    if (fileContent) {
      setEventOccurrences(parseAndSortLogFile(fileContent));
    }
  }, [fileContent]);

  const toggleExpandEvent = (event) => {
    setExpandedEvent((prevEvent) => (prevEvent === event ? null : event));
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
          {eventOccurrences.map(([event, occurrences], index) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogStatistics;
