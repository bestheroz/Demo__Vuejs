<template>
  <v-breadcrumbs :items="items" class="pa-0 mb-2">
  </v-breadcrumbs>
</template>

<script lang="ts" setup>
  defineProps<{
    items: string[];
  }>();
</script>
