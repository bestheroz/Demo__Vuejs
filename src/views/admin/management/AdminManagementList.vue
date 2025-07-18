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
            v-if="item.id !== info.id"
            color="error"
            icon="mdi-delete"
            variant="plain"
            @click="onClickRemove(item)"
          />
        </template>
      </DataTableServerWithFilter>
    </v-card-text>
  </v-card>
  <AdminManagementEditDialog
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
import AdminManagementEditDialog from "@/views/admin/management/AdminManagementEditDialog.vue";
import {
  type Admin,
  type AdminCreate,
  defaultAdminCreate,
} from "@/views/admin/management/types";
import FabButton from "@/views/components/buttons/FabButton.vue";
import DataTableServerWithFilter from "@/views/components/datatables/DataTableServerWithFilter.vue";

const { authorities, info } = storeToRefs(useAdminStore());

const headers = computed(() => {
  const headers: DataTableHeader[] = [
    { title: "ID(KEY)", key: "id" },
    { title: "로그인 아이디", key: "loginId" },
    { title: "관리자 명", key: "name" },
    { title: "사용 여부", key: "useFlag", valueType: "switch" },
    { title: "관리자 여부", key: "managerFlag", valueType: "switch" },
    { title: "가입 일자", key: "joinedAt", valueType: "datetime" },
    {
      title: "최종 로그인 일시",
      key: "latestActiveAt",
      valueType: "datetime",
    },
    { title: "작업자", key: "updatedBy", valueType: "operator" },
    { title: "작업일시", key: "updatedAt", valueType: "datetime" },
  ];
  if (authorities.value.includes(Authority.ADMIN_EDIT)) {
    headers.push({ title: "작업", key: "action", valueType: "button" });
  }
  return headers;
});
const serverItems = ref<Admin[]>([]);
const totalItems = ref(0);
const loading = ref(false);

async function fetchList({
  page,
  itemsPerPage,
  queryParams,
}: DataTableOptions) {
  const { success, data } = await getApi<ListApiResult<Admin>>(
    `api/v1/admins?${stringifyParams({
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
  useEditList<AdminCreate>(defaultAdminCreate);
const refDataTableServerWithFilter = ref();
const fabButton = ref<FabButtonProp[]>([
  {
    title: "추가",
    color: "primary",
    onClick: onClickAdd,
    hide: !authorities.value.includes(Authority.ADMIN_EDIT),
  },
  {
    title: "재조회",
    color: "secondary",
    onClick: () => refDataTableServerWithFilter.value.reload(),
  },
]);

const { confirmDelete } = useConfirmStore();
async function onClickRemove(val: Admin) {
  if (!(await confirmDelete())) {
    return;
  }
  const { success } = await deleteApi(`api/v1/admins/${val.id}`, {
    refLoading: loading,
  });
  if (success) {
    await refDataTableServerWithFilter.value.reload();
  }
}
</script>
