<template>
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
    @update:options="onUpdateOptions"
  >
    <template #loading>
      <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
    </template>
    <template #thead>
      <DataTableHeaderFilter
        v-if="!hideFilter"
        :filter-header="filterHeaders"
        :original-items="items"
        :filter-first-column="true"
        @update:model-value="onUpdateQueryParams"
      />
    </template>

    <template
      v-for="header in headers.filter((v) => !!v.valueSelectItem)"
      :key="header.key"
      #[`item.${header.key}`]="{ value }"
    >
      {{ getTitleByValue(header.valueSelectItem ?? [], value) }}
    </template>
    <template
      v-for="header in filterHeaders.filter((v) => !!v.valueType)"
      :key="header.key"
      #[`item.${header.key}`]="{ value }"
    >
      <template v-if="header.valueType === 'datetime'">{{
        formatDatetime(value)
      }}</template>
      <template v-else-if="header.valueType === 'datetimeSeconds'">{{
        formatDatetimeSeconds(value)
      }}</template>
      <template v-else-if="header.valueType === 'date'">{{
        formatDate(value)
      }}</template>
      <template v-else-if="header.valueType === 'number'">{{
        value != null ? (+value).toLocaleString() : "-"
      }}</template>
      <UserAvatar v-else-if="header.valueType === 'operator'" :value="value" />
      <v-switch
        v-else-if="header.valueType === 'switch'"
        class="d-inline-block"
        :model-value="value"
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
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from "vue";
import type { DataTableHeader, DataTableOptions } from "@/definitions/types";
import {
  formatDate,
  formatDatetimeSeconds,
  formatDatetime,
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

const emits = defineEmits<{
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
        width: v.width ?? 142,
        minWidth: v.minWidth ?? 142,
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
    } else if (!!v.valueSelectItem) {
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
  itemsPerPage: 10,
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
  emits("update:options", lastOptions.value);
}

defineExpose({ reload });
</script>

<style lang="scss" scoped>
:deep(.v-selection-control) {
  justify-content: center;
}
</style>
