<template>
  <div class="crt-upd-info">
    <span v-if="createdDateTimeString">
      {{ modelValue?.createdBy?.name ?? "-" }} / {{ createdDateTimeString }}
      추가됨
    </span>
    <span v-if="updatedDateTimeString">
      <v-divider
        vertical
        color="black"
        style="margin-right: 4px; height: 13px"
      />
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
<style scoped lang="scss">
.crt-upd-info {
  align-self: center;
  text-align: start;
  width: 100%;
  z-index: -1;
  > span {
    color: rgba(0, 0, 0, 0.4);
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0;
    text-align: left;
    padding-right: 8px;
  }
}
</style>
