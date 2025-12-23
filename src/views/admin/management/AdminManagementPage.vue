<script setup lang="ts">
import AdminManagementList from "@/views/admin/management/AdminManagementList.vue";
import PageBreadcrumbs from "@/views/components/breadcrumbs/PageBreadcrumbs.vue";
</script>

<template>
  <div class="w-100">
    <PageBreadcrumbs :items="['ADMIN', '관리']" />
    <AdminManagementList />
  </div>
</template>
