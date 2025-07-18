<template>
  <v-card>
    <v-card-text>
      <DataTableServerWithFilter
        ref="refDataTableServerWithFilter"
        :headers="headers"
        :items="serverItems"
        :items-length="totalItems"
        :loading="loading"
        @update:options="fetchList"
      >
        <template #top>
          <FabButton v-model="fabButton" />
          <v-data-table-footer />
        </template>
        <template #[`item.id`]="{ item }">
          <a href="javascript:void(0)" @click="onClickEdit(item)">
            {{ item.id }}
          </a>
        </template>
        <template #[`item.action`]="{ item }">
          <v-btn
            color="error"
            variant="plain"
            icon="mdi-delete"
            @click="onClickRemove(item)"
          />
        </template>
      </DataTableServerWithFilter>
    </v-card-text>
  </v-card>
  <NoticeManagementEditDialog
    v-if="dialog"
    :model-value="editItem"
    @save="refDataTableServerWithFilter.reload()"
    @click:cancel="dialog = false"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import useEditList from "@/composition/useEditList";
import { Authority } from "@/definitions/authorities";
import type {
  DataTableHeader,
  DataTableOptions,
  FabButtonProp,
  ListApiResult,
} from "@/definitions/types";
import { useAdminStore } from "@/stores/admin";
import { useConfirmStore } from "@/stores/confirm";
import { deleteApi, getApi, stringifyParams } from "@/utils/apis";
import FabButton from "@/views/components/buttons/FabButton.vue";
import DataTableServerWithFilter from "@/views/components/datatables/DataTableServerWithFilter.vue";
import NoticeManagementEditDialog from "@/views/notice/management/NoticeManagementEditDialog.vue";
import { defaultNotice, type Notice } from "@/views/notice/management/types";
const { authorities } = storeToRefs(useAdminStore());

const headers = computed(() => {
  const headers: DataTableHeader[] = [
    { title: "ID(KEY)", key: "id", valueType: "ID" },
    { title: "제목", key: "title" },
    { title: "사용 여부", key: "useFlag", valueType: "switch" },
    { title: "작업자", key: "updatedBy", valueType: "operator" },
    { title: "작업일시", key: "updatedAt", valueType: "datetime" },
  ];
  if (authorities.value.includes(Authority.NOTICE_EDIT)) {
    headers.push({ title: "작업", key: "action", valueType: "button" });
  }
  return headers;
});

const serverItems = ref<Notice[]>([]);
const totalItems = ref(0);
const loading = ref(false);

async function fetchList({
  page,
  itemsPerPage,
  queryParams,
}: DataTableOptions) {
  const { success, data } = await getApi<ListApiResult<Notice>>(
    `api/v1/notices?${stringifyParams({
      page: page,
      pageSize: itemsPerPage,
    })}&${queryParams}`,
    { refLoading: loading },
  );
  if (success) {
    serverItems.value = data.items;
    totalItems.value = data.total;
  }
}

const { dialog, editItem, onClickAdd, onClickEdit } =
  useEditList<Notice>(defaultNotice);
const refDataTableServerWithFilter = ref();
const fabButton = ref<FabButtonProp[]>([
  {
    title: "추가",
    color: "primary",
    onClick: onClickAdd,
    hide: !authorities.value.includes(Authority.NOTICE_EDIT),
  },
  {
    title: "재조회",
    color: "secondary",
    onClick: () => refDataTableServerWithFilter.value.reload(),
  },
]);

const { confirmDelete } = useConfirmStore();
async function onClickRemove(val: Notice) {
  if (!(await confirmDelete())) {
    return;
  }
  const { success } = await deleteApi(`api/v1/notices/${val.id}`, {
    refLoading: loading,
  });
  if (success) {
    await refDataTableServerWithFilter.value.reload();
  }
}
</script>
