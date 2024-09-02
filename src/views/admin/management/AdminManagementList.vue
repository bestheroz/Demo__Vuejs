<template>
  <v-card>
    <v-card-text>
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="serverItems"
        :items-length="totalItems"
        :loading="loading"
        :search="search"
        disable-sort
        show-current-page
        @update:options="loadItems"
      >
        <template #top>
          <v-toolbar flat class="px-4">
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="flat" @click="onClickAdd">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-toolbar>
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
          <v-btn color="error" variant="plain" @click="onClickRemove(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table-server>
    </v-card-text>
  </v-card>
  <AdminManagementEditDialog
    v-if="dialog"
    :model-value="editItem"
    @save="loadItems"
    @click:cancel="dialog = false"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  type Admin,
  type AdminCreate,
  defaultAdminCreate,
} from "@/views/admin/management/types";
import { deleteApi, getApi, stringifyParams } from "@/utils/apis";
import type { ListApiResult } from "@/definitions/types";
import { formatDatetime } from "@/utils/formatter";
import UserAvatar from "@/views/components/datatables/UserAvatar.vue";
import AdminManagementEditDialog from "@/views/admin/management/AdminManagementEditDialog.vue";
import useEditList from "@/composition/useEditList";
import { useConfirmStore } from "@/stores/confirm";

const itemsPerPage = ref(10);
const headers = [
  { title: "ID(KEY)", key: "id" },
  { title: "로그인 아이디", key: "loginId" },
  { title: "관리자 명", key: "name" },
  { title: "사용 여부", key: "useFlag" },
  { title: "관리자 여부", key: "managerFlag" },
  { title: "가입 일자", key: "joinedAt" },
  { title: "최종 로그인 일시", key: "latestActiveAt" },
  { title: "작업자", key: "updatedBy" },
  { title: "작업일시", key: "updatedAt" },
  { key: "action" },
];
const serverItems = ref<Admin[]>([]);
const totalItems = ref(0);
const loading = ref(false);
const search = ref("");

async function loadItems() {
  try {
    loading.value = true;
    const { status, data } = await getApi<ListApiResult<Admin>>(
      `api/v1/admins?${stringifyParams({
        page: 1,
        pageSize: itemsPerPage.value,
      })}`,
    );
    if (Math.floor(status / 100) === 2) {
      serverItems.value = data.items;
      totalItems.value = data.total;
    }
  } finally {
    loading.value = false;
  }
}

const { dialog, editItem, onClickAdd, onClickEdit } =
  useEditList<AdminCreate>(defaultAdminCreate);

const { confirmDelete } = useConfirmStore();
async function onClickRemove(val: Admin) {
  if (!(await confirmDelete())) {
    return;
  }
  loading.value = true;
  try {
    const { status } = await deleteApi(`api/v1/admins/${val.id}`);
    if (Math.floor(status / 100) === 2) {
      await loadItems();
    }
  } finally {
    loading.value = false;
  }
}
</script>
