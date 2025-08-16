import React, { useState } from "react";
import "./DateRangeViewer.css";

/**
 * DateRangeViewer allows the user to input a datetime and navigate to that date in the log file.
 */
const DateRangeViewer = ({ onDateSelect }) => {
  const [dateInput, setDateInput] = useState("");
  const [error, setError] = useState("");

  // Update the dateInput state when the user types in the input field
  const handleDateChange = (e) => {
    setDateInput(e.target.value);
  };

  // Validate the input date and pass it to the parent component if valid
  const handleGoTo = () => {
    const inputDate = new Date(dateInput);
    if (isNaN(inputDate.getTime())) {
      setError("Invalid date format. Please enter a valid datetime.");
      return;
    }
    setError("");
    onDateSelect(inputDate);
  };

  return (
    <div className="date-range-viewer">
      <input
        type="datetime-local"
        value={dateInput}
        onChange={handleDateChange}
        placeholder="Enter a datetime"
        aria-label="Enter a datetime to jump to in the log"
      />
      <button onClick={handleGoTo} aria-label="View log at selected datetime">
        View In Log
      </button>
      {error && (
        <p style={{ color: "red" }} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default DateRangeViewer;
