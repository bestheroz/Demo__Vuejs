<script setup lang="ts">
import type { TestResult } from "@/views/test/type";
import { ref } from "vue";

const { runFn } = defineProps<{
  title: string;
  disabled?: boolean;
  runFn: () => unknown;
}>();

const loading = ref(false);
const success = ref<boolean | null>(null);
const result = ref("");
async function run() {
  success.value = null;
  result.value = "";
  loading.value = true;
  try {
    const response = (await runFn()) as TestResult<unknown>;
    success.value = response.success;
    result.value = JSON.stringify(response.data);
    return response.success;
  } finally {
    loading.value = false;
  }
}

defineExpose({ run });
</script>

<template>
  <v-col cols="1">
    <v-btn
      :color="success ? 'success' : success === false ? 'error' : 'secondary'"
      :disabled="disabled"
      :loading="loading"
      block
      @click="run"
      >{{ title }}</v-btn
    >
  </v-col>
  <v-col cols="11">{{ result }} </v-col>
</template>
