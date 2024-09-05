import React, { useEffect, useState } from "react";

// Helper function to parse log file content
const parseLogFile = (content) => {
  const sections = content.split(
    "==========================================================================="
  );
  const occurrences = {};

  sections.forEach((section) => {
    const eventRegex =
      /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3}) \[\d+\] (.+?)(?=Mem Usage|\n===========================================================================|\n$)/s;
    const match = section.match(eventRegex);

    if (match) {
      const timestamp = match[1];
      const eventDescription = match[2].trim();

      if (!occurrences[eventDescription]) {
        occurrences[eventDescription] = [];
      }
      occurrences[eventDescription].push({
        timestamp,
        fullEvent: `${timestamp} - ${eventDescription}`,
      });
    }
  });

  return occurrences;
};

// Helper function to sort events by occurrences
const sortEventsByOccurrences = (events) => {
  return Object.entries(events).sort(
    ([, aOccurrences], [, bOccurrences]) =>
      bOccurrences.length - aOccurrences.length
  );
};

const LogStatistics = ({ fileContent }) => {
  const [eventOccurrences, setEventOccurrences] = useState({});
  const [expandedEvent, setExpandedEvent] = useState(null);

  useEffect(() => {
    if (fileContent) {
      setEventOccurrences(parseLogFile(fileContent));
    }
  }, [fileContent]);

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
                            <th>Full Event</th>
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
