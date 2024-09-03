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

<script setup lang="ts">
import { ref } from "vue";
import type { ApiResponse } from "@/utils/apis";

const props = defineProps<{
  title: string;
  disabled?: boolean;
  runFn: () => unknown;
}>();

const loading = ref(false);
const success = ref<boolean | null>(null);
const result = ref("");
async function run() {
  loading.value = true;
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const response: ApiResponse<unknown> = await props.runFn();
    success.value = response.success;
    result.value = JSON.stringify(response.data);
    return response.success;
  } finally {
    loading.value = false;
  }
}

defineExpose({ run });
</script>
