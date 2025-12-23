<script setup lang="ts">
import { useVModels } from "@vueuse/core";

const props = withDefaults(
  defineProps<{
    dialog: boolean;
    loading?: boolean;
    saveBtnTitle?: string;
    closeBtnTitle?: string;
    saveBtn?: boolean;
  }>(),
  {
    loading: false,
    saveBtnTitle: "저장",
    closeBtnTitle: "취소",
    saveBtn: true,
  },
);

const emits = defineEmits<{
  (e: "save"): void;
}>();

const { dialog } = useVModels(props, emits);
</script>

<template>
  <v-card-actions style="background-color: var(--v-theme-secondary)">
    <v-row class="px-6 py-1 justify-end">
      <v-btn
        color="primary"
        width="100"
        density="default"
        size="x-large"
        height="40"
        :variant="saveBtn ? 'plain' : 'flat'"
        :disabled="loading ?? false"
        @click="dialog = false"
        >{{ closeBtnTitle }}
      </v-btn>
      <v-btn
        v-if="saveBtn"
        color="primary"
        variant="flat"
        density="default"
        size="x-large"
        height="40"
        width="100"
        :loading="loading ?? false"
        @click="emits('save')"
      >
        {{ saveBtnTitle }}
      </v-btn>
    </v-row>
  </v-card-actions>
</template>
