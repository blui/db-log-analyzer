import React, { useState } from "react";
import "./DateRangeViewer.css";

/**
 * DateRangeViewer provides a control for users to input a datetime and navigate to the corresponding entry in the log file.
 *
 * @component
 * @param {Object} props
 * @param {function} props.onDateSelect - Callback invoked with the selected Date object.
 */
const DateRangeViewer = ({ onDateSelect }) => {
  const [dateInput, setDateInput] = useState("");
  const [error, setError] = useState("");

  /**
   * Updates the dateInput state when the user types in the input field.
   * @param {object} e - The input change event.
   */
  const handleDateChange = (e) => {
    setDateInput(e.target.value);
  };

  /**
   * Validates the input date and, if valid, passes it to the parent component.
   * Displays an error message if the input is not a valid datetime.
   */
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
      {/* Error message display */}
      {error && (
        <p style={{ color: "red" }} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default DateRangeViewer;
