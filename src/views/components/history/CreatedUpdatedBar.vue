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
import { formatDatetime } from "@/utils/formatter";
import { computed } from "vue";
import type { IdCreatedUpdated } from "@/definitions/types";

const props = defineProps<{
  modelValue?: IdCreatedUpdated;
}>();

const createdDateTimeString = computed((): string =>
  formatDatetime(props.modelValue?.createdAt),
);

const updatedDateTimeString = computed((): string =>
  formatDatetime(props.modelValue?.updatedAt),
);
</script>
