<script setup lang="ts">
import type { DataTableHeader } from "@/definitions/types";
import { watchDebounced } from "@vueuse/core";
import { computed, ref } from "vue";
import { stringifyParams } from "@/utils/apis";

const props = withDefaults(
  defineProps<{
    filterHeader: DataTableHeader[];
    originalItems: unknown[];
    filterFirstColumn?: boolean;
  }>(),
  { filterFirstColumn: false },
);

const emit = defineEmits<{
  (e: "update:model-value", v: string): void;
}>();

const filter = ref<(string | boolean | null | undefined)[]>(
  new Array(props.filterHeader.length).fill(null),
);
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
    filter.value = new Array(v.length).fill(null);
  },
  { debounce: 100 },
);

watchDebounced(
  () => [props.originalItems, filter.value],
  () => {
    emit(
      "update:model-value",
      stringifyParams(
        filter.value.reduce<Record<string, string>>(
          (acc, cur, index) => {
            // undefined, null, 빈 문자열은 필터에서 제외
            if (cur === undefined || cur === "" || cur === null) return acc;

            // boolean 값만 문자열로 변환하여 전송
            if (filterMap.value[index] && typeof cur === "boolean") {
              acc[filterMap.value[index]] = String(cur);
            } else if (filterMap.value[index] && typeof cur === "string") {
              // 문자열 값은 그대로 전송
              acc[filterMap.value[index]] = cur;
            }
            return acc;
          },
          {},
        ),
      ),
    );
  },
  { debounce: 200, deep: true },
);
</script>

<template>
  <thead>
    <tr id="datatable-header-filter" class="text-center">
      <td v-if="!filterFirstColumn" class="filter-cell" />
      <td
        v-for="(data, index) in finalFilterHeader"
        :key="data.key"
        class="filter-cell"
        :class="{ 'filter-cell--disabled': data.filterable === false }"
      >
        <v-autocomplete
          v-model.trim="filter[index]"
          :items="data.filterSelectItem"
          variant="solo-filled"
          density="compact"
          flat
          hide-details
          single-line
          :placeholder="`${data.title} 검색`"
          clearable
          class="filter-input"
          v-if="
            data.filterable !== false &&
            data.filterType === 'select' &&
            data.filterSelectItem
          "
        >
          <template #prepend-inner>
            <v-icon size="small" color="grey">mdi-filter-variant</v-icon>
          </template>
        </v-autocomplete>
        <v-select
          v-model="filter[index]"
          :items="[
            { title: '전체', value: null },
            { title: '사용', value: true },
            { title: '미사용', value: false },
          ]"
          variant="solo-filled"
          density="compact"
          flat
          hide-details
          single-line
          :clearable="false"
          class="filter-input"
          v-else-if="data.filterable !== false && data.filterType === 'switch'"
        >
          <template #prepend-inner>
            <v-icon
              v-if="filter[index] !== null"
              size="small"
              :color="filter[index] === true ? 'primary' : 'grey'"
            >
              {{
                filter[index] === true
                  ? "mdi-toggle-switch"
                  : "mdi-toggle-switch-off-outline"
              }}
            </v-icon>
          </template>
        </v-select>
        <v-text-field
          v-model.trim="filter[index]"
          variant="solo-filled"
          density="compact"
          flat
          hide-details
          single-line
          :placeholder="`${data.title} 검색`"
          clearable
          class="filter-input"
          v-else-if="data.filterable !== false"
        />
      </td>
    </tr>
  </thead>
</template>
<style lang="scss" scoped>
#datatable-header-filter {
  background: rgba(var(--v-theme-surface-variant), 0.04);
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);

  .filter-cell {
    padding: 1px 4px;
    position: relative;
    vertical-align: middle;
    height: 100%;

    &--disabled {
      background: transparent;

      &::after {
        content: "";
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
          45deg,
          transparent,
          transparent 10px,
          rgba(var(--v-theme-on-surface), 0.03) 10px,
          rgba(var(--v-theme-on-surface), 0.03) 20px
        );
        pointer-events: none;
      }
    }
  }

  .filter-input {
    width: 100%;
    max-width: 100%;

    :deep(.v-field) {
      background: rgba(var(--v-theme-surface), 0.9);
      border-radius: 6px;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(var(--v-theme-surface), 1);
      }

      &.v-field--focused {
        background: rgba(var(--v-theme-surface), 1);
        box-shadow:
          0 0 0 2px rgba(var(--v-theme-primary), 0.1),
          0 0 0 1px rgba(var(--v-theme-primary), 0.3);
      }
    }

    :deep(.v-field__input) {
      padding: 0 12px;
      min-height: 28px;
      font-size: 0.875rem;
    }

    :deep(.v-field__prepend-inner) {
      padding-left: 8px;
    }

    :deep(.v-field__append-inner) {
      padding-right: 4px;
    }

    :deep(.v-field__clearable) {
      margin-inline-start: 2px;
    }

    :deep(input::placeholder) {
      color: rgba(var(--v-theme-on-surface), 0.3);
      font-size: 0.8125rem;
    }
  }
}
</style>
