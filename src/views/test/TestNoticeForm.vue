<template>
  <v-card>
    <v-card-title>공지</v-card-title>
    <v-card-text>
      <v-row dense>
        <TestRunForm ref="refTestRunForm1" title="조회" :run-fn="run1" />
        <TestRunForm ref="refTestRunForm2" title="추가" :run-fn="run2" />
        <TestRunForm
          ref="refTestRunForm3"
          :disabled="!createdId"
          title="상세조회"
          :run-fn="run3"
        />
        <TestRunForm
          ref="refTestRunForm4"
          :disabled="!createdId"
          title="수정"
          :run-fn="run4"
        />
        <TestRunForm
          ref="refTestRunForm5"
          :disabled="!createdId"
          title="삭제"
          :run-fn="run5"
        />
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn
        v-if="authorities.includes(Authority.NOTICE_EDIT)"
        color="primary"
        :loading="loading"
        variant="flat"
        density="default"
        size="x-large"
        height="40"
        width="100"
        @click="run"
        >모두 테스트</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { Authority } from "@/definitions/authorities";
import { storeToRefs } from "pinia";
import { useAdminStore } from "@/stores/admin";
import { ref } from "vue";
import TestRunForm from "@/views/test/TestRunForm.vue";
import { deleteApi, getApi, postApi, putApi } from "@/utils/apis";
import type { Notice } from "@/views/notice/management/types";

const { authorities } = storeToRefs(useAdminStore());

const loading = ref(false);

const refTestRunForm1 = ref();
const refTestRunForm2 = ref();
const refTestRunForm3 = ref();
const refTestRunForm4 = ref();
const refTestRunForm5 = ref();
async function run() {
  const [, success2] = await Promise.all([
    refTestRunForm1.value.run(),
    refTestRunForm2.value.run(),
  ]);
  if (success2) {
    await Promise.all([
      refTestRunForm3.value.run(),
      refTestRunForm4.value.run(),
    ]);
    await refTestRunForm5.value.run();
  }
}

const createdId = ref<number | undefined>(undefined);

async function run1() {
  return await getApi("api/v1/notices?page=1&pageSize=10");
}
async function run2() {
  const response = await postApi<Notice>("api/v1/notices", {
    title: "(Test)title",
    content: "(Test)content",
    useFlag: true,
  });
  if (response.success) {
    createdId.value = response.data.id;
  }
  return response;
}
async function run3() {
  return await getApi(`api/v1/notices/${createdId.value}`);
}
async function run4() {
  return await putApi(`api/v1/notices/${createdId.value}`, {
    title: "(Test)title_updated",
    content: "(Test)content2_updated",
    useFlag: true,
  });
}
async function run5() {
  const response = await deleteApi(`api/v1/notices/${createdId.value}`);
  if (response.success) {
    createdId.value = undefined;
  }
  return response;
}
</script>
