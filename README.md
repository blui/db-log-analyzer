# Log Analyzer

**Log Analyzer** is a lightweight, browser-based tool for analyzing log files. Built using React, this application lets you upload log files in `.log` or `.txt` format, view their content, and analyze key events such as `ERROR`, `WARNING`, and other important messages. The UI is inspired by the clean, minimalistic style of Windows 11, providing a seamless user experience with responsive design.

At the time of writing this, the application is configured for use with DataBridge log files. There are plans to extend the functionality to allow log files from different applications to be compatible.

## Table of Contents

- [Features](#features)
- [Usage](#usage)
- [Components](#components)

## Features

- **File Selection and Directory Navigation**: Select log files or entire directories to list `.log` or `.txt` files available for analysis.
- **Log Viewing**: View the content of log files in a clean, scrollable text area.
- **Event Statistics**: Automatically parse log files to categorize events (e.g., `ERROR`, `WARNING`, or other messages) with occurrence counts.
- **Event Drill-Down**: Click on an event to view its occurrences, timestamps, and any stack traces in a nested table.
- **Date Range Viewer**: Jump to a specific log entry by entering a datetime value.
- **Responsive Design**: The app adapts to different screen sizes for desktop and mobile use.
- **Windows-Inspired Design**: The interface is styled with a Windows 11-inspired aesthetic.
- **Client-Side Processing**: No backend required; all processing happens in the browser.

## Usage

1. **Select a Directory or File**: Use the "Select Directory" button to choose a folder containing .log or .txt files, or directly upload a log file.

2. **View the Log File Content**: Once a file is selected, the log content will be displayed in a scrollable text area.

3. **Analyze Events**: The application parses the log file and shows a table of events (e.g., ERROR, WARNING, or other messages) along with the count of their occurrences.

4. **Drill Down into Events**: Click on any event in the statistics table to view details, including timestamps, event messages, and stack traces (if applicable).

5. **Date Range Viewer**: Use the date range viewer to jump to a specific log entry by entering a valid datetime value.

### Currently Support Log Formats (DataBridge)

```
===========================================================================
2024-07-11 17:20:13,785 [1] ERROR - Error configuring session factory: .\DataBridge
Mem Usage: 992 Mb
...
```

The app captures the event starting from ERROR, WARNING, or other event descriptions, up to the Mem Usage line, and then tallies the occurrences.

## Components

**App.js**

- The main component that holds the state for the selected file and its content. It renders the FilePicker, LogViewer, DateRangeViewer, and LogStatistics components.

**FilePicker.js**

- A component that allows users to select a directory or upload .log or .txt files. It lists all available files from the selected directory.

**LogViewer.js**

- Displays the content of the uploaded log file in a read-only text area. It also scrolls to a specific datetime when provided by the DateRangeViewer.

**LogStatistics.js**

- Analyzes the log file and displays a table of categorized log events (e.g., ERROR, WARNING). Users can click on an event to drill down into details such as timestamps, event messages, and stack traces.

**DateRangeViewer.js**

- Provides a facility for users to enter a datetime value and jump to the closest matching log entry.

## License

This software is licensed, not sold. You are granted a limited, non-exclusive, non-transferable license to use this software for personal or internal business purposes only. Redistribution, modification, reverse engineering, or any other usage not explicitly allowed is strictly prohibited.

Disclaimer of Liability: The software is provided "as is", without warranty of any kind, express or implied. The authors or copyright holders are not liable for any claims, damages, or other liability arising from the use of the software.

By using this software, you agree to these terms.
