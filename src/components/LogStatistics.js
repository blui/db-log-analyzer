import React, { useEffect, useState } from "react";

const LogStatistics = ({ fileContent }) => {
  const [eventCounts, setEventCounts] = useState({});
  const [eventDetails, setEventDetails] = useState([]);

  useEffect(() => {
    if (fileContent) {
      const parsedData = parseLogFile(fileContent);
      setEventCounts(parsedData.counts);
      setEventDetails(parsedData.details);
    }
  }, [fileContent]);

  const parseLogFile = (content) => {
    const sections = content.split(
      "==========================================================================="
    ); // Split by separator line
    const counts = {};
    const details = [];

    sections.forEach((section) => {
      // Regex to capture a timestamp and everything until the next separator or "Mem Usage"
      const eventRegex =
        /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3} \[\d+\] (.+?)(?=Mem Usage|\n===========================================================================|\n$)/s;
      const match = section.match(eventRegex);

      if (match) {
        const eventDescription = match[1].trim(); // Capture the event description after the timestamp

        // Count occurrences of each unique event
        counts[eventDescription] = counts[eventDescription]
          ? counts[eventDescription] + 1
          : 1;

        // Only add unique events to the details array
        if (!details.find((detail) => detail.event === eventDescription)) {
          details.push({ event: eventDescription });
        }
      }
    });

    return { counts, details };
  };

  return (
    <div>
      <h3>Log Statistics</h3>
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                borderBottom: "1px solid #ddd",
                padding: "8px",
              }}
            >
              Event
            </th>
            <th
              style={{
                textAlign: "left",
                borderBottom: "1px solid #ddd",
                padding: "8px",
              }}
            >
              Count
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(eventCounts).map(([event, count], index) => (
            <tr key={index}>
              <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                {event}
              </td>
              <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                {count}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogStatistics;
