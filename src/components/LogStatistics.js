import React, { useEffect, useState } from "react";

// Helper function to parse the log file content into events and their occurrences
const parseLogFile = (content) => {
  const sections = content.split(
    "==========================================================================="
  ); // Split the log by separators
  const occurrences = {};

  sections.forEach((section) => {
    // Regex to capture timestamp and event description
    const eventRegex =
      /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3}) \[\d+\] (.+?)(?=Mem Usage|\n===========================================================================|\n$)/s;
    const match = section.match(eventRegex);

    if (match) {
      const timestamp = match[1]; // Capture timestamp
      const eventDescription = match[2].trim(); // Capture event description

      // If the event hasn't been encountered yet, initialize an array for it
      if (!occurrences[eventDescription]) {
        occurrences[eventDescription] = [];
      }
      // Add the event occurrence with the timestamp
      occurrences[eventDescription].push({
        timestamp,
        fullEvent: `${timestamp} - ${eventDescription}`,
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
  const [expandedEvent, setExpandedEvent] = useState(null); // Track which event is expanded

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
      {/* Table to display event statistics */}
      <table className="log-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {/* Render the events sorted by their occurrences */}
          {sortEventsByOccurrences(eventOccurrences).map(
            ([event, occurrences], index) => (
              <React.Fragment key={index}>
                {/* Clickable row to toggle the expanded view */}
                <tr
                  onClick={() => toggleExpandEvent(event)}
                  className="clickable-row"
                >
                  <td>{event}</td>
                  <td>{occurrences.length}</td>
                </tr>
                {/* Expanded view displaying the individual occurrences with timestamps */}
                {expandedEvent === event && (
                  <tr>
                    <td colSpan="2">
                      <table className="expanded-table">
                        <thead>
                          <tr>
                            <th>Timestamp</th>
                            <th>Full Event</th>
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
                                <td>{occurrence.timestamp}</td>
                                <td>{occurrence.fullEvent}</td>
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
