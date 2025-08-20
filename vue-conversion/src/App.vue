<script setup>
// Main application logic for the Vue 3 Log Analyzer
import { ref, computed } from "vue";
import FilePicker from "./components/FilePicker.vue"; // File selection UI
import LogViewer from "./components/LogViewer.vue"; // Log display UI
import LogStatistics from "./components/LogStatistics.vue"; // Statistics panel
import DateRangeViewer from "./components/DateRangeViewer.vue"; // Date navigation UI

// State for selected file name and content
const selectedFile = ref(null);
const fileContent = ref("");
// State for scrolling to a specific date in the log
const scrollToDate = ref(null);
// Search/filter state
const searchTerm = ref("");
const selectedSeverities = ref(["INFO", "WARN", "ERROR"]);

// Handle file selection from FilePicker
function onFileSelect({ file, content }) {
  fileContent.value = content;
  selectedFile.value = file.name;
}

// Handle date selection from DateRangeViewer
function onDateSelect(date) {
  scrollToDate.value = date;
}

// Parse log file content into entries (each entry = header + stack/body)
function parseLogEntries(content) {
  if (!content) return [];
  const lines = content.split("\n");
  const entryRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3}/;
  const entries = [];
  let currentEntry = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (entryRegex.test(line)) {
      if (currentEntry.length > 0) entries.push(currentEntry.join("\n"));
      currentEntry = [line];
    } else {
      currentEntry.push(line);
    }
  }
  if (currentEntry.length > 0) entries.push(currentEntry.join("\n"));
  return entries;
}

// Compute filtered log entries based on search and selected severities
const filteredEntries = computed(() => {
  const entries = parseLogEntries(fileContent.value);
  if (selectedSeverities.value.length === 0) return [];
  return entries.filter((entry) => {
    const header = entry.split("\n")[0] || "";
    const matchesSeverity = selectedSeverities.value.some((sev) =>
      header.includes(sev)
    );
    const matchesSearch =
      !searchTerm.value ||
      entry.toLowerCase().includes(searchTerm.value.toLowerCase());
    return matchesSeverity && matchesSearch;
  });
});
</script>

<template>
  <div>
    <header>
      <h1>Log Analyzer</h1>
    </header>
    <main class="container">
      <div class="card">
        <FilePicker @file-selected="onFileSelect" />
        <div v-if="selectedFile" style="margin-top: 1.5rem">
          <div
            class="search-filter-controls"
            style="
              margin-bottom: 1.5rem;
              display: flex;
              align-items: center;
              flex-wrap: wrap;
              gap: 1rem;
            "
          >
            <input
              type="text"
              placeholder="Search logs..."
              v-model="searchTerm"
              aria-label="Search logs"
            />
            <label>
              <input
                type="checkbox"
                value="INFO"
                v-model="selectedSeverities"
              />
              INFO
            </label>
            <label>
              <input
                type="checkbox"
                value="WARN"
                v-model="selectedSeverities"
              />
              WARN
            </label>
            <label>
              <input
                type="checkbox"
                value="ERROR"
                v-model="selectedSeverities"
              />
              ERROR
            </label>
          </div>
          <DateRangeViewer @date-selected="onDateSelect" />
        </div>
      </div>
      <div class="card">
        <LogViewer
          :selectedFile="selectedFile"
          :entries="filteredEntries"
          :scrollToDate="scrollToDate"
        />
      </div>
      <div class="card">
        <LogStatistics :entries="filteredEntries" />
      </div>
    </main>
    <footer>
      <p>
        &copy; {{ new Date().getFullYear() }} Brian Lui. All rights reserved.
      </p>
    </footer>
  </div>
</template>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
header {
  background: #f5f5f5;
  padding: 1rem 0;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
}
footer {
  margin-top: 2rem;
  text-align: center;
  color: #888;
  font-size: 0.95rem;
}
.search-filter-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}
</style>
