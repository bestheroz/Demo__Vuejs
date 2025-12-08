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
          <v-chip
            color="primary"
            variant="tonal"
            size="small"
            class="cursor-pointer font-weight-medium"
            @click="onClickEdit(item)"
          >
            {{ item.id }}
          </v-chip>
        </template>
        <template #[`item.action`]="{ item }">
          <div class="d-flex justify-center gap-1">
            <v-tooltip text="삭제" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-delete-outline"
                  size="small"
                  variant="tonal"
                  color="error"
                  density="comfortable"
                  @click="onClickRemove(item)"
                />
              </template>
            </v-tooltip>
          </div>
        </template>
      </DataTableServerWithFilter>
    </v-card-text>
  </v-card>
  <UserManagementEditDialog
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
import {
  defaultUserCreate,
  type User,
  type UserCreate,
} from "@/views/user/management/types";
import UserManagementEditDialog from "@/views/user/management/UserManagementEditDialog.vue";

const { authorities } = storeToRefs(useAdminStore());

const headers = computed(() => {
  const headers: DataTableHeader[] = [
    { title: "ID(KEY)", key: "id", valueType: "ID" },
    { title: "로그인 아이디", key: "loginId" },
    { title: "유저 이름", key: "name" },
    { title: "사용 여부", key: "useFlag", valueType: "switch" },
    { title: "가입 일자", key: "joinedAt", valueType: "datetime" },
    {
      title: "최종 로그인 일시",
      key: "latestActiveAt",
      valueType: "datetime",
    },
    { title: "작업자", key: "updatedBy", valueType: "operator" },
    { title: "작업일시", key: "updatedAt", valueType: "datetime" },
  ];
  if (authorities.value.includes(Authority.USER_EDIT)) {
    headers.push({ title: "작업", key: "action", valueType: "button" });
  }
  return headers;
});

const serverItems = ref<User[]>([]);
const totalItems = ref(0);
const loading = ref(false);

async function fetchList({
  page,
  itemsPerPage,
  queryParams,
}: DataTableOptions) {
  const { success, data } = await getApi<ListApiResult<User>>(
    `api/v1/users?${stringifyParams({
      page: page,
      pageSize: itemsPerPage,
    })}&${queryParams}`,
    {
      refLoading: loading,
    },
  );
  if (success) {
    serverItems.value = data.items;
    totalItems.value = data.total;
  }
}

const { dialog, editItem, onClickAdd, onClickEdit } =
  useEditList<UserCreate>(defaultUserCreate);
const refDataTableServerWithFilter = ref();
const fabButton = computed<FabButtonProp[]>(() => [
  {
    title: "추가",
    color: "blue-darken-2",
    icon: "mdi-plus-circle",
    onClick: onClickAdd,
    hide: !authorities.value.includes(Authority.USER_EDIT),
  },
  {
    title: "재조회",
    color: "grey-darken-2",
    icon: "mdi-refresh",
    onClick: () => refDataTableServerWithFilter.value.reload(),
  },
]);

const { confirmDelete } = useConfirmStore();
async function onClickRemove(val: User) {
  if (!(await confirmDelete())) {
    return;
  }
  const { success } = await deleteApi(`api/v1/users/${val.id}`, {
    refLoading: loading,
  });
  if (success) {
    await refDataTableServerWithFilter.value.reload();
  }
}
</script>
