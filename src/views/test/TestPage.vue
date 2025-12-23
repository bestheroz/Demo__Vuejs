<script setup lang="ts">
import { useTemplateRef } from "vue";
import PageBreadcrumbs from "@/views/components/breadcrumbs/PageBreadcrumbs.vue";
import TestAdminForm from "@/views/test/TestAdminForm.vue";
import TestNoticeForm from "@/views/test/TestNoticeForm.vue";
import TestUserForm from "@/views/test/TestUserForm.vue";

type TestFormRef = { runAll: () => Promise<void> };
const refTestNoticeForm = useTemplateRef<TestFormRef>("refTestNoticeForm");
const refTestUserForm = useTemplateRef<TestFormRef>("refTestUserForm");
const refTestAdminForm = useTemplateRef<TestFormRef>("refTestAdminForm");

async function runAll() {
  await Promise.allSettled([
    refTestNoticeForm.value?.runAll(),
    refTestAdminForm.value?.runAll(),
    refTestUserForm.value?.runAll(),
  ]);
}
</script>

<template>
  <div class="w-100">
    <PageBreadcrumbs :items="['테스트', '통합']" />
    <v-btn variant="elevated" color="primary" class="mb-4" @click="runAll"
      >통합 테스트 시작</v-btn
    >
    <TestNoticeForm ref="refTestNoticeForm" />
    <TestUserForm ref="refTestUserForm" />
    <TestAdminForm ref="refTestAdminForm" />
  </div>
</template>
