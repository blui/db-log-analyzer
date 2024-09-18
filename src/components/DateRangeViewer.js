import React, { useState } from "react";
import "./DateRangeViewer.css"; // Custom styling for DateRangeViewer

/**
 * DateRangeViewer component allows the user to input a datetime
 * and navigate to that date in the log file.
 */
const DateRangeViewer = ({ onDateSelect }) => {
  const [dateInput, setDateInput] = useState(""); // Holds the user's input
  const [error, setError] = useState(""); // Holds any error message

  /**
   * Updates the dateInput state when the user types in the input field.
   * @param {Object} e - Event object from the input field.
   */
  const handleDateChange = (e) => {
    setDateInput(e.target.value); // Update the date input with the user's value
  };

  /**
   * Validates the input date and passes it to the parent component if valid.
   */
  const handleGoTo = () => {
    const inputDate = new Date(dateInput); // Convert the input value to a Date object
    // Check if the input date is valid
    if (isNaN(inputDate.getTime())) {
      setError("Invalid date format. Please enter a valid datetime."); // Show error if the date is invalid
      return;
    }

    setError(""); // Clear error message if the input is valid
    onDateSelect(inputDate); // Pass the selected date to the parent component
  };

  return (
    <div className="date-range-viewer">
      {/* Input field for entering the date */}
      <input
        type="datetime-local"
        value={dateInput}
        onChange={handleDateChange}
        placeholder="Enter a datetime"
      />
      {/* Button to trigger the 'go to' action */}
      <button onClick={handleGoTo}>View In Log</button>
      {/* Display error message if input is invalid */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default DateRangeViewer;
