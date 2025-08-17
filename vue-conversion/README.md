# DB Log Analyzer (Vue 3)

A browser-based tool for analyzing log files, implemented in Vue 3. This project is a migration from the original React version, with improved performance, accessibility, and a robust feature set for log analysis.

## Features

- **File Selection & Directory Navigation:** Select a directory and choose `.log` or `.txt` files for analysis.
- **Efficient Log Viewing:** View and scroll through large log files with smooth performance.
- **Line Numbering & Severity Highlighting:** Each log entry is numbered and color-coded by severity (ERROR, WARN, INFO, DEBUG).
- **Search & Filter:** Filter log entries by severity and search term for focused analysis.
- **Statistics & Focused Breakdown:**
  - See total counts for each severity.
  - View the most common error, warning, and info messages (top 7 in each category).
  - See the top 7 days with the highest error counts.
- **Date Navigation:** Jump to the closest log entry for a specific datetime using the date range viewer.
- **Accessibility:** All interactive elements are keyboard accessible and use ARIA attributes for screen readers.
- **Responsive Design:** Adapts to desktop and mobile screens.
- **Client-Side Processing:** All log parsing and analysis is performed in the browser; no backend required.

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

   Visit the local URL provided in the terminal.

4. **Select a directory:**

   Use the "Select Directory" button to choose a folder containing `.log` or `.txt` files.

5. **Analyze logs:**

   - View, search, and filter log content.
   - Use the statistics panel to see severity breakdowns, common messages, and error days.
   - Jump to a specific date using the date range viewer.

## Main Components

### App.vue

Coordinates file selection, filtering, and state. Renders all other components and manages their interactions.

### FilePicker.vue

Lets users select a directory and lists all `.log` and `.txt` files. Handles file reading and passes content to the app.

### LogViewer.vue

Displays log file content, supports line numbering, severity highlighting, and programmatic scrolling to a specific date.

### LogStatistics.vue

Parses the log file to extract and categorize events. Shows a summary table, top messages, and top error days.

### DateRangeViewer.vue

Lets users input a datetime and jump to the closest matching log entry in the viewer.

## License

This software is licensed, not sold. You are granted a limited, non-exclusive, non-transferable license to use this software for personal or internal business purposes only. Redistribution, modification, reverse engineering, or any other usage not explicitly allowed is strictly prohibited.

**Disclaimer of Liability:** The software is provided "as is", without warranty of any kind, express or implied. The authors or copyright holders are not liable for any claims, damages, or other liability arising from the use of the software.

By using this software, you agree to these terms.
