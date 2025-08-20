<template>
  <div class="date-range-viewer">
    <input
      type="datetime-local"
      v-model="dateInput"
      placeholder="Enter a datetime"
      aria-label="Enter a datetime to jump to in the log"
    />
    <button @click="handleGoTo" aria-label="View log at selected datetime">
      View In Log
    </button>
    <p v-if="error" style="color: red" role="alert">{{ error }}</p>
  </div>
</template>

<script setup>
// DateRangeViewer.vue: Lets user input a datetime and jump to that point in the log
import { ref } from "vue";

// Emits date-selected event with Date object
const emit = defineEmits(["date-selected"]);
const dateInput = ref("");
const error = ref("");

// Parse input and emit date if valid
function handleGoTo() {
  const inputDate = new Date(dateInput.value);
  if (isNaN(inputDate.getTime())) {
    error.value = "Invalid date format. Please enter a valid datetime.";
    return;
  }
  error.value = "";
  emit("date-selected", inputDate);
}
</script>

<style scoped>
.date-range-viewer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
input[type="datetime-local"] {
  padding: 4px 8px;
}
button {
  padding: 4px 12px;
  background: #0078d4;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:focus {
  outline: 2px solid #0078d4;
}
</style>
