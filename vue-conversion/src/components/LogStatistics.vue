<template>
  <div>
    <h3>Log Statistics</h3>
    <p>Total Events: {{ totalEvents }}</p>
    <table class="log-table" aria-label="Log event statistics">
      <thead>
        <tr>
          <th scope="col">Event</th>
          <th scope="col">Count</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="[event, occurrences] in sortedEvents" :key="event">
          <tr
            class="clickable-row"
            tabindex="0"
            @click="toggleExpandEvent(event)"
            @keypress.enter="toggleExpandEvent(event)"
            @keypress.space="toggleExpandEvent(event)"
            :aria-label="`Expand event ${event}`"
          >
            <td>{{ event }}</td>
            <td>{{ occurrences.length }}</td>
          </tr>
          <tr v-if="expandedEvent === event">
            <td :colspan="2">
              <table
                class="expanded-table"
                :aria-label="`Occurrences for event ${event}`"
              >
                <thead>
                  <tr>
                    <th scope="col">Timestamp</th>
                    <th scope="col">Event Message</th>
                    <th scope="col">Stack Trace</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(occurrence, idx) in sortedOccurrences(occurrences)"
                    :key="idx"
                  >
                    <td class="timestamp-column">{{ occurrence.timestamp }}</td>
                    <td class="event-message-column">
                      {{ occurrence.eventMessage }}
                    </td>
                    <td class="stack-trace-column">
                      <pre>{{ occurrence.stackTrace }}</pre>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  fileContent: String,
});

function parseLogFile(content) {
  if (!content) return {};
  const sections = content.split(
    "==========================================================================="
  );
  const occurrences = {};
  sections.forEach((section) => {
    const eventRegex =
      /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3}) \[\d+\] (.+?)(?=Mem Usage|\n===========================================================================|\n$)/s;
    const stackTraceRegex = /(at .+)/g;
    const match = section.match(eventRegex);
    if (match) {
      const timestamp = match[1];
      const eventMessage = match[2].trim();
      const stackTraceMatches = section.match(stackTraceRegex);
      const stackTrace = stackTraceMatches
        ? stackTraceMatches.join("\n")
        : "No stack trace";
      if (!occurrences[eventMessage]) occurrences[eventMessage] = [];
      occurrences[eventMessage].push({ timestamp, eventMessage, stackTrace });
    }
  });
  return occurrences;
}

function sortEventsByOccurrences(events) {
  return Object.entries(events).sort(([, a], [, b]) => b.length - a.length);
}

const eventOccurrences = ref({});
const expandedEvent = ref(null);
const totalEvents = ref(0);

watch(
  () => props.fileContent,
  (newContent) => {
    const parsedEvents = parseLogFile(newContent);
    eventOccurrences.value = parsedEvents;
    totalEvents.value = Object.values(parsedEvents).reduce(
      (acc, occurrences) => acc + occurrences.length,
      0
    );
    expandedEvent.value = null;
  },
  { immediate: true }
);

const sortedEvents = computed(() =>
  sortEventsByOccurrences(eventOccurrences.value)
);

function sortedOccurrences(occurrences) {
  return [...occurrences].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );
}

function toggleExpandEvent(event) {
  expandedEvent.value = expandedEvent.value === event ? null : event;
}
</script>

<style scoped>
.log-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.clickable-row {
  cursor: pointer;
}
.clickable-row:focus {
  outline: 2px solid #0078d4;
}
.expanded-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
}
.timestamp-column {
  width: 160px;
}
.event-message-column {
  width: 40%;
}
.stack-trace-column pre {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
