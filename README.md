# Log Analyzer

**Log Analyzer** is a performant, browser-based tool for analyzing large log files. Built with React, it supports uploading and viewing `.log` or `.txt` files, advanced filtering, and interactive event analysis. The UI is inspired by Windows 11, with a focus on accessibility, responsiveness, and professional code quality. The log viewer uses virtualized rendering for smooth performance, even with very large files.

The application is currently optimized for DataBridge log files, but its modular design allows for future support of additional log formats.

## Table of Contents

- [Features](#features)
- [Usage](#usage)
- [Components](#components)

## Features

- **File Selection and Directory Navigation**: Select a directory to list all `.log` and `.txt` files for analysis.
- **Virtualized Log Viewing**: Efficiently view and scroll through very large log files using virtualized rendering (`react-window`).
- **Line Numbering and Severity Highlighting**: Each log line is numbered and color-coded by severity (ERROR, WARN, INFO) for quick scanning.
- **Search and Filter**: Filter log entries by severity and search term for focused analysis.
- **Event Statistics and Drill-Down**: Automatically parse logs to categorize events and display occurrence counts. Click any event to view all instances, timestamps, and stack traces.
- **Date Navigation**: Jump to the closest log entry for a specific datetime using the date range viewer.
- **Accessibility**: All interactive elements are keyboard accessible and use ARIA attributes for screen readers.
- **Responsive Design**: Adapts to desktop and mobile screens.
- **Client-Side Processing**: All log parsing and analysis is performed in the browser; no backend required.
- **Professional Codebase**: All code is documented with professional, concise comments and follows best practices for maintainability.

## Usage

1. **Select a Directory**: Click "Select Directory" to choose a folder containing `.log` or `.txt` files. All compatible files will be listed for selection.
2. **View Log Content**: Select a file to view its content in a performant, virtualized log viewer with line numbers and severity highlighting.
3. **Search and Filter**: Use the search box and severity checkboxes to filter log entries in real time.
4. **Analyze Events**: The statistics table summarizes all detected events and their occurrence counts.
5. **Drill Down into Events**: Click any event in the statistics table to expand and view all occurrences, including timestamps and stack traces.
6. **Jump to Date**: Use the date range viewer to jump to the closest log entry for a specific datetime.

### Supported Log Format Example (DataBridge)

```text
===========================================================================
2024-07-11 17:20:13,785 [1] ERROR - Error configuring session factory: .\DataBridge
Mem Usage: 992 Mb
...
```

The app captures each event starting from ERROR, WARNING, or other event descriptions, up to the `Mem Usage` line, and tallies the occurrences for analysis.

## Components

### App.js

Main application component. Manages state for file selection, filtering, and scroll targets. Renders all other components and coordinates their interactions.

### FilePicker.js

Allows users to select a directory and lists all `.log` and `.txt` files. Handles file reading and passes content to the app.

### LogViewer.js

Displays log file content using virtualized rendering for performance. Shows line numbers, applies severity highlighting, and supports programmatic scrolling to a specific date.

### LogStatistics.js

Parses the log file to extract and categorize events. Displays a summary table with occurrence counts and allows users to expand each event for detailed analysis.

### DateRangeViewer.js

Provides a datetime input for users to jump to the closest matching log entry in the viewer.

## License

This software is licensed, not sold. You are granted a limited, non-exclusive, non-transferable license to use this software for personal or internal business purposes only. Redistribution, modification, reverse engineering, or any other usage not explicitly allowed is strictly prohibited.

**Disclaimer of Liability:** The software is provided "as is", without warranty of any kind, express or implied. The authors or copyright holders are not liable for any claims, damages, or other liability arising from the use of the software.

By using this software, you agree to these terms.
