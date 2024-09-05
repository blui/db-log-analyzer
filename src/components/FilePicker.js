import React from "react";

const FilePicker = ({ onFileSelect }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.name.endsWith(".log") || file.name.endsWith(".txt"))) {
      onFileSelect(file);
    }
  };

  return (
    <div>
      <input type="file" accept=".log,.txt" onChange={handleFileChange} />
      <button>Select File</button>
    </div>
  );
};

export default FilePicker;
