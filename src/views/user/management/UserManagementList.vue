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
        @update:options="fetchList"
      >
        <template #top>
          <v-toolbar flat class="px-4">
            <v-spacer></v-spacer>
            <v-btn
              v-if="authorities.includes(Authority.USER_EDIT)"
              color="primary"
              variant="flat"
              @click="onClickAdd"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn
              color="primary"
              variant="flat"
              class="ml-2"
              @click="debouncedFetchList"
            >
              <v-icon>mdi-reload</v-icon>
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
  <UserManagementEditDialog
    v-if="dialog"
    :model-value="editItem"
    @save="fetchList"
    @click:cancel="dialog = false"
  />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
  defaultUserCreate,
  type User,
  type UserCreate,
} from "@/views/user/management/types";
import { deleteApi, getApi, stringifyParams } from "@/utils/apis";
import type { ListApiResult } from "@/definitions/types";
import { formatDatetime } from "@/utils/formatter";
import UserAvatar from "@/views/components/datatables/UserAvatar.vue";
import UserManagementEditDialog from "@/views/user/management/UserManagementEditDialog.vue";
import useEditList from "@/composition/useEditList";
import { useConfirmStore } from "@/stores/confirm";
import { useDebounceFn } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useAdminStore } from "@/stores/admin";
import { Authority } from "@/definitions/authorities";

const { authorities } = storeToRefs(useAdminStore());

const itemsPerPage = ref(10);
const headers = computed(() => {
  const headers: { key: string; title?: string }[] = [
    { title: "ID(KEY)", key: "id" },
    { title: "로그인 아이디", key: "loginId" },
    { title: "관리자 명", key: "name" },
    { title: "사용 여부", key: "useFlag" },
    { title: "가입 일자", key: "joinedAt" },
    { title: "최종 로그인 일시", key: "latestActiveAt" },
    { title: "작업자", key: "updatedBy" },
    { title: "작업일시", key: "updatedAt" },
  ];
  if (authorities.value.includes(Authority.USER_EDIT)) {
    headers.push({ title: "작업", key: "action" });
  }
  return headers;
});

const serverItems = ref<User[]>([]);
const totalItems = ref(0);
const loading = ref(false);
const search = ref("");

async function fetchList() {
  try {
    loading.value = true;
    const { success, data } = await getApi<ListApiResult<User>>(
      `api/v1/users?${stringifyParams({
        page: 1,
        pageSize: itemsPerPage.value,
      })}`,
    );
    if (success) {
      serverItems.value = data.items;
      totalItems.value = data.total;
    }
  } finally {
    loading.value = false;
  }
}

const debouncedFetchList = useDebounceFn(fetchList, 200);

const { dialog, editItem, onClickAdd, onClickEdit } =
  useEditList<UserCreate>(defaultUserCreate);

const { confirmDelete } = useConfirmStore();
async function onClickRemove(val: User) {
  if (!(await confirmDelete())) {
    return;
  }
  loading.value = true;
  try {
    const { success } = await deleteApi(`api/v1/users/${val.id}`);
    if (success) {
      await fetchList();
    }
  } finally {
    loading.value = false;
  }
}
</script>
