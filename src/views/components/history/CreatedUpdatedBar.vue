<template>
  <div class="text-sm-caption">
    <span v-if="modelValue?.createdAt">
      {{ modelValue?.createdBy?.name ?? "-" }} / {{ createdDateTimeString }}
      추가됨
    </span>
    <span v-if="modelValue?.updatedAt">
      <v-divider vertical />
      {{ modelValue?.updatedBy?.name ?? "-" }} / {{ updatedDateTimeString }}
      수정됨
    </span>
  </div>
</template>

<script setup lang="ts">
import type { IdCreatedUpdated } from "@/definitions/types";
import { computed } from "vue";
import { formatDatetimeSeconds } from "@/utils/formatter";

const props = defineProps<{
  modelValue?: IdCreatedUpdated;
}>();

const createdDateTimeString = computed((): string =>
  formatDatetimeSeconds(props.modelValue?.createdAt),
);

const updatedDateTimeString = computed((): string =>
  formatDatetimeSeconds(props.modelValue?.updatedAt),
);
</script>
