<script setup lang="ts">
import type { DataTableHeader, DataTableOptions } from "@/definitions/types";
import { computed, ref, useSlots } from "vue";
import {
  formatDate,
  formatDatetime,
  formatDatetimeSeconds,
  getTitleByValue,
} from "@/utils/formatter";
import DataTableColumnEllipsis from "@/views/components/datatables/DataTableColumnEllipsis.vue";
import DataTableHeaderFilter from "@/views/components/datatables/DataTableHeaderFilter.vue";
import UserAvatar from "@/views/components/datatables/UserAvatar.vue";

const props = withDefaults(
  defineProps<{
    headers: DataTableHeader[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: any[];
    itemsLength: number;
    itemsPerPage?: number;
    loading?: boolean;
    itemValue?: string;
    hideFilter?: boolean;
    showDefaultFooter?: boolean;
    showExpand?: boolean;
    showSelect?: boolean;
    singleSelect?: boolean;
  }>(),
  { itemsPerPage: 25, itemValue: "id" },
);

const emit = defineEmits<{
  (e: "update:options", v: DataTableOptions): void;
}>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const modelValue = defineModel<any[]>("modelValue");

const slots = useSlots();

const filterHeaders = computed(() =>
  props.headers.map((v) => {
    if (v.valueType === "datetime") {
      return {
        ...v,
        align: v.align ?? "center",
        filterable: v.filterable ?? false,
        width: v.width ?? 145,
        minWidth: v.minWidth ?? 145,
      };
    } else if (v.valueType === "datetimeSeconds") {
      return {
        ...v,
        align: v.align ?? "center",
        filterable: v.filterable ?? false,
        width: v.width ?? 150,
        minWidth: v.minWidth ?? 150,
      };
    } else if (v.valueType === "date") {
      return {
        ...v,
        align: v.align ?? "center",
        filterable: v.filterable ?? false,
      };
    } else if (v.valueType === "number") {
      return {
        ...v,
        align: v.align ?? "end",
      };
    } else if (v.valueType === "ID") {
      return {
        ...v,
        align: v.align ?? "center",
        filterType: v.filterType ?? "input",
        width: v.width ?? "8rem",
        maxWidth: v.maxWidth ?? "8rem",
      };
    } else if (v.valueType === "operator") {
      return {
        ...v,
        filterable: v.filterable ?? false,
        filterType: v.filterType ?? "input",
        width: v.width ?? "8rem",
        maxWidth: v.maxWidth ?? "8rem",
      };
    } else if (v.valueType === "switch") {
      return {
        ...v,
        align: v.align ?? "center",
        filterType: v.filterType ?? "switch",
        width: v.width ?? "6rem",
        maxWidth: v.maxWidth ?? "6rem",
      };
    } else if (v.valueType === "button") {
      return {
        ...v,
        align: v.align ?? "center",
        filterable: v.filterable ?? false,
        width: v.width ?? "8rem",
        maxWidth: v.maxWidth ?? "8rem",
      };
    } else if (v.valueSelectItem) {
      return {
        ...v,
        valueSelectItem: v.valueSelectItem,
        filterType: v.filterType ?? "select",
        filterSelectItem: v.filterSelectItem ?? v.valueSelectItem,
      };
    } else {
      return v;
    }
  }),
);

const lastOptions = ref<DataTableOptions>({
  page: 1,
  itemsPerPage: props.itemsPerPage,
  queryParams: "",
});

function onUpdateOptions(val: DataTableOptions) {
  lastOptions.value = {
    ...lastOptions.value,
    ...val,
  };
  reload();
}

function onUpdateQueryParams(val: string) {
  if (lastOptions.value.queryParams === val) return;
  lastOptions.value = {
    ...lastOptions.value,
    queryParams: val,
  };
  reload();
}

function reload() {
  emit("update:options", lastOptions.value);
}

defineExpose({ reload });
</script>

<template>
  <div class="data-table-wrapper">
    <v-data-table-server
      v-model="modelValue"
      :select-strategy="singleSelect ? 'single' : 'all'"
      :show-select="showSelect"
      fixed-header
      :headers="filterHeaders"
      :items="items"
      :items-length="itemsLength"
      :loading="loading"
      :item-value="itemValue"
      :show-expand="showExpand"
      :items-per-page="itemsPerPage"
      disable-sort
      show-current-page
      :hide-default-footer="!showDefaultFooter"
      class="custom-data-table"
      @update:options="onUpdateOptions"
    >
      <template #loading>
        <v-skeleton-loader type="table-row@10" />
      </template>
      <template #thead>
        <DataTableHeaderFilter
          v-if="!hideFilter"
          :filter-header="filterHeaders"
          :original-items="items"
          filter-first-column
          @update:model-value="onUpdateQueryParams"
        />
      </template>

      <template
        v-for="header in headers.filter((v) => !!v.valueSelectItem)"
        :key="header.key"
        #[`item.${header.key}`]="{ value }"
      >
        <span class="data-cell-value">
          {{ getTitleByValue(header.valueSelectItem ?? [], value) }}
        </span>
      </template>
      <template
        v-for="header in filterHeaders.filter((v) => !!v.valueType)"
        :key="header.key"
        #[`item.${header.key}`]="{ value }"
      >
        <template v-if="header.valueType === 'datetime'"
          ><span class="data-cell-value data-cell-value--datetime">{{
            formatDatetime(value)
          }}</span></template
        >
        <template v-else-if="header.valueType === 'datetimeSeconds'"
          ><span class="data-cell-value data-cell-value--datetime">{{
            formatDatetimeSeconds(value)
          }}</span></template
        >
        <template v-else-if="header.valueType === 'date'"
          ><span class="data-cell-value data-cell-value--date">{{
            formatDate(value)
          }}</span></template
        >
        <template v-else-if="header.valueType === 'number'"
          ><span class="data-cell-value data-cell-value--number">{{
            value != null ? (+value).toLocaleString() : "-"
          }}</span></template
        >
        <UserAvatar
          v-else-if="header.valueType === 'operator'"
          :value="value"
        />
        <v-switch
          v-else-if="header.valueType === 'switch'"
          class="d-inline-block custom-switch"
          :model-value="value"
          color="primary"
          density="compact"
          disabled
        />
        <DataTableColumnEllipsis
          v-else-if="header.valueType === 'textEllipsis'"
          :text="value"
          :width="header.width"
        />
      </template>

      <!-- useSlots로 동적 슬롯 전달 -->
      <template v-for="(_slot, name) in slots" :key="name" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </v-data-table-server>
  </div>
</template>

<style lang="scss" scoped>
.data-table-wrapper {
  border-radius: 8px;
  overflow: hidden;
  background: rgba(var(--v-theme-surface), 1);
}

.custom-data-table {
  :deep(.v-table__wrapper) {
    border-radius: 0;
  }

  :deep(.v-data-table__th) {
    background: rgba(var(--v-theme-surface-variant), 0.08) !important;
    font-weight: 600;
    font-size: 0.875rem;
    color: rgba(var(--v-theme-on-surface), 0.87);
    border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);
    white-space: nowrap;
  }

  :deep(.v-data-table__td) {
    font-size: 0.875rem;
    border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.05);
  }

  :deep(tbody tr) {
    transition: background-color 0.2s ease;

    // 홀수 행 (1, 3, 5...)
    &:nth-child(odd) {
      background: rgba(var(--v-theme-surface), 1);
    }

    // 짝수 행 (2, 4, 6...)
    &:nth-child(even) {
      background: rgba(var(--v-theme-surface-variant), 0.03);
    }

    &:hover {
      background: rgba(var(--v-theme-primary), 0.04) !important;
    }
  }

  :deep(.v-selection-control) {
    justify-content: center;
  }
}

.data-cell-value {
  &--datetime,
  &--date {
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.02em;
  }

  &--number {
    font-variant-numeric: tabular-nums;
    font-weight: 500;
  }
}

.custom-switch {
  :deep(.v-switch__track) {
    opacity: 0.6;
  }
}
</style>
