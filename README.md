# DataBridge Log Analyzer

**DataBridge Log Analyzer** is a lightweight, browser-based tool for analyzing log files. Built using React, this application lets you upload log files in `.log` or `.txt` format, view their content, and analyze key events such as `ERROR` and `WARNING`. The UI is inspired by the clean, minimalistic style of Windows 11.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Components](#components)
- [Styling](#styling)

## Features

- **File Upload**: Easily select and upload log files from your local machine.
- **Log Viewing**: View the content of log files in a clean, scrollable interface.
- **Event Statistics**: Automatically parse log files and categorize `ERROR` and `WARNING` events with counts.
- **Windows-Inspired Design**: The interface is designed with a Windows 11-inspired aesthetic.
- **Client-Side Processing**: No backend required; all processing happens in the browser.

## Installation

### Prerequisites

- **Node.js** (v12 or higher)
- **npm** (comes with Node.js)

### Setup

To run this project locally:

1. Clone the repository.

2. Navigate to the project directory.

3. Install the dependencies.

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm start
   ```

5. Open your browser and go to `http://localhost:3000`.

## Usage

1. **Upload a Log File**: Click the "Select File" button and choose a `.log` or `.txt` file from your local machine.
2. **View the Log File Content**: Once the file is uploaded, the log content will be displayed in a scrollable text area.
3. **Analyze Events**: The application automatically parses the log file and displays a table showing different events (such as `ERROR` and `WARNING`) and their occurrence counts.

### Supported Log File Format

The application assumes the log entries follow this format:

```
=========================================================================== 2024-07-11 17:20:13,785 [1] ERROR - Error configuring session factory: .\DataBridge Mem Usage: 992 Mb ...
```

The application captures the event starting from `ERROR` or `WARNING` and everything up to the `Mem Usage` line, then tallies the number of occurrences for each unique event.

## Components

### 1. `App.js`

- The main component that holds the state for the selected file and its content. It renders the `FilePicker`, `LogViewer`, and `LogStatistics` components.

### 2. `FilePicker.js`

- A file input component that allows the user to upload `.log` or `.txt` files.

### 3. `LogViewer.js`

- Displays the content of the uploaded log file in a read-only text area.

### 4. `LogStatistics.js`

- Analyzes the log file and displays a table of categorized log events (`ERROR`, `WARNING`) along with the count of their occurrences.

## Styling

The app is styled to resemble the Windows 11 interface with minimalistic elements, soft shadows, and smooth edges. The following global styles are applied:

- **Font**: `Segoe UI` (the default Windows font).
- **Buttons**: Styled with a blue background that matches the Windows 11 theme.
- **Tables**: Clean, grid-like format for displaying event statistics with hover effects.

### Example CSS Snippet

```css
body {
  margin: 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f3f3f3;
  color: #333;
}

button {
  background-color: #0a74da;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
}

table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}

th,
td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
```
