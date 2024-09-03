<template>
  <div class="w-100">
    <PageBreadcrumbs :items="['테스트', '통합']" />
    <TestNoticeForm />
  </div>
</template>

<script setup lang="ts">
import PageBreadcrumbs from "@/views/components/breadcrumbs/PageBreadcrumbs.vue";
import TestNoticeForm from "@/views/test/TestNoticeForm.vue";
</script>
