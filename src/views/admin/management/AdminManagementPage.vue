<template>
  <div class="w-100">
    <PageBreadcrumbs :items="['ADMIN', '관리']" />
    <AdminManagementList />
  </div>
</template>

<script setup lang="ts">
import PageBreadcrumbs from "@/views/components/breadcrumbs/PageBreadcrumbs.vue";
import AdminManagementList from "@/views/admin/management/AdminManagementList.vue";
</script>
