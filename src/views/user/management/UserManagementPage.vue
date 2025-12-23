<script setup lang="ts">
import PageBreadcrumbs from "@/views/components/breadcrumbs/PageBreadcrumbs.vue";
import UserManagementList from "@/views/user/management/UserManagementList.vue";
</script>

<template>
  <div class="w-100">
    <PageBreadcrumbs :items="['USER', '관리']" />
    <UserManagementList />
  </div>
</template>
