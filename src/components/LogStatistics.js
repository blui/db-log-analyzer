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
    ); // Split based on log sections
    const counts = {};
    const details = [];

    sections.forEach((section) => {
      // Regex to capture event type and everything up to 'Mem Usage'
      const eventRegex = /(ERROR|WARNING)\s-\s(.+?)(?=Mem Usage)/s;
      const match = section.match(eventRegex);

      if (match) {
        const eventType = match[1]; // Capture ERROR or WARNING
        const eventDescription = match[2].trim(); // Capture everything between '-' and 'Mem Usage'

        // Combine type and description for detailed counting
        const eventKey = `${eventType} - ${eventDescription}`;

        // Count occurrences of each unique event
        counts[eventKey] = counts[eventKey] ? counts[eventKey] + 1 : 1;

        // Only add unique events to the details array
        if (!details.find((detail) => detail.event === eventKey)) {
          details.push({ event: eventKey });
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
