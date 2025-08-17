# Log Analyzer (Vue 3)

A performant, browser-based tool for analyzing large log files, now implemented in Vue 3. This project is a direct migration from the original React version, preserving all features and accessibility improvements, and is ready for integration into Vue-based applications.

## Features

- **File Selection and Directory Navigation**: Select a directory to list all `.log` and `.txt` files for analysis.
- **Virtualized Log Viewing**: Efficiently view and scroll through very large log files using virtualization (`vue-virtual-scroller`).
- **Line Numbering and Severity Highlighting**: Each log line is numbered and color-coded by severity (ERROR, WARN, INFO).
- **Search and Filter**: Filter log entries by severity and search term for focused analysis.
- **Event Statistics and Drill-Down**: Automatically parse logs to categorize events and display occurrence counts. Click any event to view all instances, timestamps, and stack traces.
- **Date Navigation**: Jump to the closest log entry for a specific datetime using the date range viewer.
- **Accessibility**: All interactive elements are keyboard accessible and use ARIA attributes for screen readers.
- **Responsive Design**: Adapts to desktop and mobile screens.
- **Client-Side Processing**: All log parsing and analysis is performed in the browser; no backend required.

## Usage

1. **Install dependencies:**

   ```sh
   npm install
   ```

2. **Run the development server:**

   ```sh
   npm run dev
   ```

3. **Open the app:**

   Visit the local URL provided in the terminal (usually `http://localhost:5173`).

4. **Select a directory:**

   Use the "Select Directory" button to choose a folder containing `.log` or `.txt` files.

5. **Analyze logs:**

   - View, search, and filter log content.
   - Use the statistics table to drill down into events.
   - Jump to a specific date using the date range viewer.

## Components

### App.vue

Main application component. Manages state for file selection, filtering, and scroll targets. Renders all other components and coordinates their interactions.

### FilePicker.vue

Allows users to select a directory and lists all `.log` and `.txt` files. Handles file reading and passes content to the app.

### LogViewer.vue

Displays log file content using virtualized rendering for performance. Shows line numbers, applies severity highlighting, and supports programmatic scrolling to a specific date.

### LogStatistics.vue

Parses the log file to extract and categorize events. Displays a summary table with occurrence counts and allows users to expand each event for detailed analysis.

### DateRangeViewer.vue

Provides a datetime input for users to jump to the closest matching log entry in the viewer.

## License

This software is licensed, not sold. You are granted a limited, non-exclusive, non-transferable license to use this software for personal or internal business purposes only. Redistribution, modification, reverse engineering, or any other usage not explicitly allowed is strictly prohibited.

**Disclaimer of Liability:** The software is provided "as is", without warranty of any kind, express or implied. The authors or copyright holders are not liable for any claims, damages, or other liability arising from the use of the software.

By using this software, you agree to these terms.
