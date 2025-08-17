<template>
  <div class="file-picker">
    <button
      @click="selectDirectory"
      aria-label="Select directory for log files"
    >
      Select Directory
    </button>
    <span v-if="selectedDirectory" class="directory-name" aria-live="polite">
      {{ selectedDirectory }} selected. The following compatible files were
      found:
    </span>
    <p v-if="error" class="error-message" role="alert">{{ error }}</p>
    <table v-if="files.length > 0" class="file-table">
      <thead>
        <tr>
          <th scope="col">File Name</th>
          <th scope="col">Size (KB)</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(file, index) in files"
          :key="index"
          class="file-row"
          @click="handleFileClick(file)"
          tabindex="0"
          @keypress.enter="handleFileClick(file)"
          @keypress.space="handleFileClick(file)"
          :aria-label="`Select file ${file.name}`"
        >
          <td>{{ file.name }}</td>
          <td>{{ (file.size / 1024).toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
// FilePicker.vue: Allows user to select a directory and pick log files
import { ref } from "vue";

// Emits file-selected event with file and content
const emit = defineEmits(["file-selected"]);
const files = ref([]);
const selectedDirectory = ref("");
const error = ref("");

// Open directory picker and list .log/.txt files
async function selectDirectory() {
  try {
    // @ts-ignore: showDirectoryPicker is not yet standard in all browsers
    const directoryHandle = await window.showDirectoryPicker();
    const fileList = [];
    selectedDirectory.value = directoryHandle.name;
    for await (const entry of directoryHandle.values()) {
      if (
        entry.kind === "file" &&
        (entry.name.endsWith(".log") || entry.name.endsWith(".txt"))
      ) {
        const file = await entry.getFile();
        fileList.push(file);
      }
    }
    files.value = fileList;
    error.value = "";
  } catch (e) {
    error.value =
      "Failed to access the directory. Please try again or check browser permissions.";
  }
}

// Read file and emit content to parent
function handleFileClick(file) {
  const reader = new FileReader();
  reader.onload = () => {
    emit("file-selected", { file, content: reader.result });
  };
  reader.readAsText(file);
}
</script>

<style scoped>
.file-picker {
  margin-bottom: 1rem;
}
.directory-name {
  margin-left: 1rem;
}
.error-message {
  color: red;
}
.file-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.file-row {
  cursor: pointer;
}
.file-row:focus {
  outline: 2px solid #0078d4;
}
</style>
