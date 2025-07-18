<template>
  <thead>
    <tr id="datatable-header-filter" class="text-center">
      <td v-if="!filterFirstColumn" />
      <td
        v-for="(data, index) in finalFilterHeader"
        :key="data.key"
        :style="{
          boxShadow:
            data.filterable === false
              ? '0 2px 2px -2px rgba(211, 211, 211, 0.4), 0 4px 6px -3px rgba(0, 0, 0, 0.08)'
              : '',
        }"
      >
        <div></div>
        <v-autocomplete
          v-model.trim="filter[index]"
          :items="data.filterSelectItem"
          variant="outlined"
          hide-details
          width="98%"
          style="justify-self: center"
          v-if="
            data.filterable !== false &&
            data.filterType === 'select' &&
            data.filterSelectItem
          "
        />
        <v-select
          v-model.trim="filter[index]"
          :items="[
            { title: '예', value: true },
            { title: '아니요', value: false },
          ]"
          variant="outlined"
          hide-details
          width="95%"
          style="justify-self: center"
          v-else-if="data.filterable !== false && data.filterType === 'switch'"
        />
        <v-text-field
          v-model.trim="filter[index]"
          variant="outlined"
          hide-details
          width="99%"
          height="20px"
          style="justify-self: center"
          v-else-if="data.filterable !== false"
        />
      </td>
    </tr>
  </thead>
</template>

<script setup lang="ts">
import { watchDebounced } from "@vueuse/core";
import { fill } from "lodash-es";
import { computed, ref } from "vue";
import type { DataTableHeader } from "@/definitions/types";
import { stringifyParams } from "@/utils/apis";

const props = withDefaults(
  defineProps<{
    filterHeader: DataTableHeader[];
    originalItems: unknown[];
    filterFirstColumn: boolean;
  }>(),
  { filterFirstColumn: false },
);

const emits = defineEmits<{
  (e: "update:model-value", v: string): void;
}>();

const filter = ref<string[]>(fill(Array(props.filterHeader.length), ""));
const finalFilterHeader = computed<DataTableHeader[]>(() =>
  props.filterHeader.map((v, index) => ({
    ...v,
    title: v.title || v.key || `-${index + 1}`,
  })),
);
const filterMap = computed(() => finalFilterHeader.value.map((v) => v.key));

watchDebounced(
  () => props.filterHeader,
  (v) => {
    filter.value = fill(Array(v.length), "");
  },
  { debounce: 100 },
);

watchDebounced(
  () => [props.originalItems, filter.value],
  () => {
    emits(
      "update:model-value",
      stringifyParams(
        filter.value.reduce(
          (acc, cur, index) => {
            if (cur === undefined || cur === "" || cur === null) return acc;
            if (filterMap.value[index]) {
              acc[filterMap.value[index]] = cur;
            }
            return acc;
          },
          {} as Record<string, string>,
        ),
      ),
    );
  },
  { debounce: 200, deep: true },
);
</script>
<style lang="scss" scoped>
#datatable-header-filter {
  :deep(input) {
    padding: 2px 8px;
    min-height: 1.8rem;
  }
  :deep(.v-field__input) {
    padding: 2px 8px;
    min-height: 1.8rem;
  }
  :deep(.v-input--density-compact) {
    height: 1.8rem;
  }
  :deep(td) {
    padding: 0;
    height: 1.8rem;
  }
}
</style>
