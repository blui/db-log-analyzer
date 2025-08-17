<template>
  <div class="log-statistics-container">
    <h3>Log Statistics</h3>
    <div v-if="stats.total > 0" class="stats-table">
      <div class="stat-row">
        <span>Total Entries:</span> <b>{{ stats.total }}</b>
      </div>
      <div class="stat-row">
        <span>Errors:</span> <b class="error">{{ stats.error }}</b>
      </div>
      <div class="stat-row">
        <span>Warnings:</span> <b class="warn">{{ stats.warn }}</b>
      </div>
      <div class="stat-row">
        <span>Info:</span> <b class="info">{{ stats.info }}</b>
      </div>
      <div class="stat-row">
        <span>Debug:</span> <b class="debug">{{ stats.debug }}</b>
      </div>
      <div class="stat-row">
        <span>Other:</span> <b>{{ stats.other }}</b>
      </div>
    </div>
    <div v-else class="stats-placeholder">No entries to analyze.</div>

    <div v-if="stats.total > 0" class="focused-stats">
      <h4>Common Error Messages</h4>
      <div v-if="common.error.length" class="focused-list">
        <div
          v-for="item in common.error"
          :key="item.message"
          class="focused-row"
        >
          <span class="error">{{ item.message }}</span>
          <span class="focused-count">×{{ item.count }}</span>
        </div>
      </div>
      <div v-else class="focused-none">No error messages found.</div>

      <h4>Common Warning Messages</h4>
      <div v-if="common.warn.length" class="focused-list">
        <div
          v-for="item in common.warn"
          :key="item.message"
          class="focused-row"
        >
          <span class="warn">{{ item.message }}</span>
          <span class="focused-count">×{{ item.count }}</span>
        </div>
      </div>
      <div v-else class="focused-none">No warning messages found.</div>

      <h4>Common Info Messages</h4>
      <div v-if="common.info.length" class="focused-list">
        <div
          v-for="item in common.info"
          :key="item.message"
          class="focused-row"
        >
          <span class="info">{{ item.message }}</span>
          <span class="focused-count">×{{ item.count }}</span>
        </div>
      </div>
      <div v-else class="focused-none">No info messages found.</div>
    </div>
    <div v-if="topErrorDays.length" class="top-error-days">
      <h4>Top Days with Most Errors</h4>
      <div class="top-error-list">
        <div
          v-for="item in topErrorDays"
          :key="item.date"
          class="top-error-row"
        >
          <span class="top-error-date">{{ item.date }}</span>
          <span class="top-error-count">×{{ item.count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  entries: Array,
});

function parseStats(entries) {
  const stats = {
    total: entries.length,
    error: 0,
    warn: 0,
    info: 0,
    debug: 0,
    other: 0,
  };
  const levelRegex = /\b(ERROR|WARN|INFO|DEBUG)\b/;
  for (const entry of entries) {
    const match = entry.match(levelRegex);
    if (match) {
      const level = match[1].toLowerCase();
      if (stats[level] !== undefined) stats[level]++;
      else stats.other++;
    } else {
      stats.other++;
    }
  }
  return stats;
}

function extractCommonMessages(entries, level) {
  // Extract message after the level (e.g., after 'ERROR', 'WARN', 'INFO')
  const regex = new RegExp(`\\b${level.toUpperCase()}\\b[ :\-]*([^\n]*)`, "i");
  const counts = {};
  for (const entry of entries) {
    const match = entry.match(regex);
    if (match && match[1]) {
      const msg = match[1].trim();
      if (msg) counts[msg] = (counts[msg] || 0) + 1;
    }
  }
  // Sort by count descending, then alphabetically
  return Object.entries(counts)
    .map(([message, count]) => ({ message, count }))
    .sort((a, b) => b.count - a.count || a.message.localeCompare(b.message))
    .slice(0, 5); // Show top 5
}

function extractErrorDays(entries) {
  // Extract date (YYYY-MM-DD) from error entries
  const dateRegex = /(\d{4}-\d{2}-\d{2})/;
  const errorRegex = /\bERROR\b/;
  const counts = {};
  for (const entry of entries) {
    if (errorRegex.test(entry)) {
      const match = entry.match(dateRegex);
      if (match) {
        const day = match[1];
        counts[day] = (counts[day] || 0) + 1;
      }
    }
  }
  return Object.entries(counts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => b.count - a.count || a.date.localeCompare(b.date))
    .slice(0, 5); // Show top 5 days
}

const stats = computed(() => parseStats(props.entries || []));
const common = computed(() => ({
  error: extractCommonMessages(props.entries || [], "error"),
  warn: extractCommonMessages(props.entries || [], "warn"),
  info: extractCommonMessages(props.entries || [], "info"),
}));
const topErrorDays = computed(() => extractErrorDays(props.entries || []));
</script>

<style scoped>
.log-statistics-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem 1rem 1rem 1rem;
  margin-bottom: 2rem;
}
.stats-table {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
.stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.1em;
}
.error {
  color: #d9534f;
}
.warn {
  color: #f0ad4e;
}
.info {
  color: #5bc0de;
}
.debug {
  color: #5cb85c;
}
.stats-placeholder {
  color: #888;
  padding: 1rem;
  text-align: center;
}
.focused-stats {
  margin-top: 2rem;
  background: #f8f9fa;
  border-radius: 6px;
  padding: 1rem;
}
.focused-list {
  margin-bottom: 1rem;
}
.focused-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.2em 0;
  font-family: monospace;
  font-size: 1em;
}
.focused-count {
  color: #888;
  margin-left: 1em;
}
.focused-none {
  color: #bbb;
  font-style: italic;
  margin-bottom: 1rem;
}
.top-error-days {
  margin-top: 2rem;
  background: #fffbe6;
  border-radius: 6px;
  padding: 1rem;
}
.top-error-list {
  margin-bottom: 1rem;
}
.top-error-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.2em 0;
  font-family: monospace;
  font-size: 1em;
}
.top-error-date {
  color: #b8860b;
}
.top-error-count {
  color: #d9534f;
  margin-left: 1em;
  font-weight: bold;
}
</style>
