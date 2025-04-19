<template>
  <v-card>
    <v-card-text>
      <v-data-table-server
        :headers="headers"
        :items="serverItems"
        :items-length="totalItems"
        :loading="loading"
        disable-sort
        show-current-page
        hide-default-footer
        @update:options="fetchList"
      >
        <template #top>
          <v-toolbar flat class="px-4">
            <v-spacer></v-spacer>
            <v-btn
              v-if="authorities.includes(Authority.ADMIN_EDIT)"
              color="primary"
              variant="flat"
              @click="onClickAdd"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-toolbar>
          <v-data-table-footer />
        </template>
        <template #[`item.id`]="{ item }">
          <v-btn variant="plain" color="primary" @click="onClickEdit(item)">
            {{ item.id }}
          </v-btn>
        </template>
        <template #[`item.useFlag`]="{ value }">
          <v-switch :model-value="value" disabled />
        </template>
        <template #[`item.managerFlag`]="{ value }">
          <v-switch :model-value="value" disabled />
        </template>
        <template #[`item.joinedAt`]="{ value }">
          {{ formatDatetime(value) }}
        </template>
        <template #[`item.latestActiveAt`]="{ value }">
          {{ formatDatetime(value) }}
        </template>
        <template #[`item.updatedBy`]="{ value }">
          <UserAvatar :value="value" />
        </template>
        <template #[`item.updatedAt`]="{ value }">
          {{ formatDatetime(value) }}
        </template>
        <template #[`item.action`]="{ item }">
          <v-btn
            v-if="item.id !== info.id"
            color="error"
            variant="plain"
            @click="onClickRemove(item)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table-server>
    </v-card-text>
  </v-card>
  <AdminManagementEditDialog
    v-if="dialog"
    :model-value="editItem"
    @save="fetchList"
    @click:cancel="dialog = false"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import useEditList from "@/composition/useEditList";
import { Authority } from "@/definitions/authorities";
import type { ListApiResult } from "@/definitions/types";
import { useAdminStore } from "@/stores/admin";
import { useConfirmStore } from "@/stores/confirm";
import { deleteApi, getApi, stringifyParams } from "@/utils/apis";
import { formatDatetime } from "@/utils/formatter";
import AdminManagementEditDialog from "@/views/admin/management/AdminManagementEditDialog.vue";
import {
  type Admin,
  type AdminCreate,
  defaultAdminCreate,
} from "@/views/admin/management/types";
import UserAvatar from "@/views/components/datatables/UserAvatar.vue";

const { authorities, info } = storeToRefs(useAdminStore());

const headers = computed(() => {
  const headers: { key: string; title?: string }[] = [
    { title: "ID(KEY)", key: "id" },
    { title: "로그인 아이디", key: "loginId" },
    { title: "관리자 명", key: "name" },
    { title: "사용 여부", key: "useFlag" },
    { title: "관리자 여부", key: "managerFlag" },
    { title: "가입 일자", key: "joinedAt" },
    { title: "최종 로그인 일시", key: "latestActiveAt" },
    { title: "작업자", key: "updatedBy" },
    { title: "작업일시", key: "updatedAt" },
  ];
  if (authorities.value.includes(Authority.ADMIN_EDIT)) {
    headers.push({ key: "action" });
  }
  return headers;
});
const serverItems = ref<Admin[]>([]);
const totalItems = ref(0);
const loading = ref(false);

async function fetchList(
  { page, itemsPerPage } = { page: 1, itemsPerPage: 10 },
) {
  const { success, data } = await getApi<ListApiResult<Admin>>(
    `api/v1/admins?${stringifyParams({
      page: page,
      pageSize: itemsPerPage,
    })}`,
    { refLoading: loading },
  );
  if (success) {
    serverItems.value = data.items;
    totalItems.value = data.total;
  }
}

const { dialog, editItem, onClickAdd, onClickEdit } =
  useEditList<AdminCreate>(defaultAdminCreate);

const { confirmDelete } = useConfirmStore();
async function onClickRemove(val: Admin) {
  if (!(await confirmDelete())) {
    return;
  }
  const { success } = await deleteApi(`api/v1/admins/${val.id}`, {
    refLoading: loading,
  });
  if (success) {
    await fetchList();
  }
}
</script>
