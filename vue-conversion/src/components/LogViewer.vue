<template>
  <div class="log-viewer-container">
    <h3 v-if="selectedFile">Viewing: {{ selectedFile }}</h3>
    <div v-if="entries && entries.length" class="log-entries-wrapper">
      <div
        v-for="(entry, idx) in entries"
        :key="idx"
        :ref="(el) => (entryRefs[idx] = el)"
        class="log-entry-row"
        :class="{ highlighted: idx === highlightedEntry }"
      >
        <span class="log-entry-number">{{ idx + 1 }}</span>
        <pre class="log-entry-text">{{ entry }}</pre>
      </div>
    </div>
    <div v-else class="log-viewer-placeholder">
      No log file selected or no results.
    </div>
  </div>
</template>

<script setup>
// LogViewer.vue: Displays log entries, supports scroll-to-date and highlights
import { ref, watch, nextTick } from "vue";

// Props: selectedFile (string), entries (array of log entries), scrollToDate (Date)
const props = defineProps({
  selectedFile: String,
  entries: Array,
  scrollToDate: Date,
});

// Refs for DOM elements and highlighted entry
const entryRefs = ref([]);
const highlightedEntry = ref(null);

// Find the index of the entry closest to the given date
function findClosestDateEntryIdx(entries, date) {
  if (!date) return -1;
  const dateRegex = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3}/;
  for (let i = 0; i < entries.length; i++) {
    const match = entries[i].match(dateRegex);
    if (match) {
      const entryDate = new Date(match[0].replace(",", "."));
      if (entryDate >= date) return i;
    }
  }
  return -1;
}

// Watch for scrollToDate prop and scroll to the closest entry
watch(
  () => props.scrollToDate,
  async (newDate) => {
    if (!newDate) return;
    await nextTick();
    const idx = findClosestDateEntryIdx(props.entries, newDate);
    if (idx !== -1 && entryRefs.value[idx]) {
      highlightedEntry.value = idx;
      entryRefs.value[idx].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }
);
</script>

<style scoped>
.log-viewer-container {
  width: 100%;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1rem 0 2rem 0;
  margin-bottom: 2rem;
}
.log-entries-wrapper {
  max-height: 350px;
  overflow-y: auto;
  width: 100%;
  background: #f9f9f9;
  border-radius: 6px;
  border: 1px solid #eee;
}
.log-entry-row {
  display: flex;
  align-items: flex-start;
  font-family: monospace;
  font-size: 1em;
  padding: 0.1em 0.5em;
  border-bottom: 1px solid #f0f0f0;
}
.log-entry-number {
  width: 48px;
  color: #888;
  text-align: right;
  margin-right: 12px;
  user-select: none;
}
.log-entry-text {
  flex: 1;
  white-space: pre-wrap;
  color: #222;
  margin: 0;
}
.highlighted {
  background: #ffeeba;
}
.log-viewer-placeholder {
  color: #888;
  padding: 2rem;
  text-align: center;
}
</style>
