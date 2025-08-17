<template>
  <div class="log-viewer-container">
    <h3 v-if="selectedFile">Viewing: {{ selectedFile }}</h3>
    <div v-if="fileContent" class="log-raw-wrapper">
      <pre class="log-raw">{{ fileContent }}</pre>
    </div>
    <div v-else class="log-viewer-placeholder">No log file selected.</div>
  </div>
</template>

<script setup>
const props = defineProps({
  selectedFile: String,
  fileContent: String,
  scrollToDate: Date,
});
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
.log-raw-wrapper {
  max-height: 350px;
  overflow-y: auto;
  width: 100%;
  background: #f9f9f9;
  border-radius: 6px;
  border: 1px solid #eee;
}
.log-raw {
  font-family: monospace;
  font-size: 1em;
  margin: 0;
  padding: 1em;
  white-space: pre;
  color: #222;
}
.log-viewer-placeholder {
  color: #888;
  padding: 2rem;
  text-align: center;
}
</style>
