# DataBridge Log Analyzer

**DataBridge Log Analyzer** is a lightweight, browser-based tool for analyzing log files. Built using React, this application lets you upload log files in `.log` or `.txt` format, view their content, and analyze key events such as `ERROR` and `WARNING`. The UI is inspired by the clean, minimalistic style of Windows 11, providing a seamless user experience with responsive design.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Components](#components)
- [Styling](#styling)

## Features

- **File Upload**: Select and upload log files from your local machine in `.log` or `.txt` format.
- **Log Viewing**: View the content of log files in a clean, scrollable text area.
- **Event Statistics**: Automatically parse log files to categorize events (e.g., `ERROR`, `WARNING`) with occurrence counts.
- **Event Drill-Down**: Click on an event to view its occurrences, timestamps, and any stack traces in a nested table.
- **Responsive Design**: The app adapts to different screen sizes for desktop and mobile use.
- **Windows-Inspired Design**: The interface is styled with a Windows 11-inspired aesthetic.
- **Client-Side Processing**: No backend required; all processing happens in the browser.

## Installation

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)

### Setup

To run this project locally:

1. Clone the repository.

   ```bash
   git clone https://github.com/blui/db-log-analyzer.git
   ```

2. Navigate to the project directory.

   ```bash
   cd db-log-analyzer
   ```

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

1. **Upload a Log File**: Click the "Choose File" button and select a `.log` or `.txt` file from your local machine.
2. **View the Log File Content**: The log content will be displayed in a scrollable text area once the file is uploaded.
3. **Analyze Events**: The application parses the log file and shows a table of events (e.g., `ERROR`, `WARNING`) along with the count of their occurrences.
4. **Drill Down into Events**: Click on any event in the statistics table to view details, including timestamps, event messages, and stack traces (if applicable).

### Supported Log File Format

The application assumes log entries follow a format similar to this:

```
===========================================================================
2024-07-11 17:20:13,785 [1] ERROR - Error configuring session factory: .\DataBridge
Mem Usage: 992 Mb
...
```

The app captures the event starting from `ERROR`, `WARNING`, or other event descriptions, up to the `Mem Usage` line, and then tallies the occurrences.

## Components

### 1. `App.js`

The main component that holds the state for the selected file and its content. It renders the `FilePicker`, `LogViewer`, and `LogStatistics` components.

### 2. `FilePicker.js`

A file input component that allows the user to upload `.log` or `.txt` files.

### 3. `LogViewer.js`

Displays the content of the uploaded log file in a read-only text area.

### 4. `LogStatistics.js`

Analyzes the log file and displays a table of categorized log events (`ERROR`, `WARNING`) along with the count of their occurrences. It allows users to click on an event to drill down into detailed information.

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
  background-color: #f4f4f4;
  color: #333;
}

button {
  background-color: #0a74da;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
```

## License

This software is licensed, not sold. You are granted a limited, non-exclusive, non-transferable license to use this software for personal or internal business purposes only. Redistribution, modification, reverse engineering, or any other usage not explicitly allowed is strictly prohibited.

**Disclaimer of Liability**: The software is provided "as is", without warranty of any kind, express or implied. The authors or copyright holders are not liable for any claims, damages, or other liability arising from the use of the software.

By using this software, you agree to these terms.
