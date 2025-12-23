<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAdminStore } from "@/stores/admin";
import { signOut } from "@/utils/commands";

const { info } = storeToRefs(useAdminStore());
</script>
<template>
  <v-menu>
    <template #activator="{ props }">
      <div class="mr-4">{{ info.name }}</div>
      <v-btn icon size="36" v-bind="props" class="mr-6">
        <v-avatar size="36" color="rgb(var(--v-theme-secondary))">
          <v-icon size="24" color="white">mdi-account</v-icon>
        </v-avatar>
      </v-btn>
    </template>

    <v-list class="py-0" style="right: -12px">
      <v-list-item
        prepend-icon="mdi-logout-variant"
        title="로그아웃"
        @click="signOut"
      />
    </v-list>
  </v-menu>
</template>
