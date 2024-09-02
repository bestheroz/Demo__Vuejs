<template>
  <v-menu>
    <template #activator="{ props }">
      <div class="mr-4">Developer</div>
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
<script setup lang="ts">
import { signOut } from "@/utils/commands";
</script>
