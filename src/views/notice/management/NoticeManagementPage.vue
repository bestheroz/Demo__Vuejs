<template>
  <div class="w-100">
    <PageBreadcrumbs :items="['공지', '관리']" />
    <NoticeManagementList />
  </div>
</template>

<script setup lang="ts">
import PageBreadcrumbs from "@/views/components/breadcrumbs/PageBreadcrumbs.vue";
import NoticeManagementList from "@/views/notice/management/NoticeManagementList.vue";
</script>
