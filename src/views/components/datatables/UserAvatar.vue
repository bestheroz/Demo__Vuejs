<template>
  <v-menu>
    <template #activator="{ props }">
      <v-btn v-bind="props" variant="plain">
        <v-avatar color="primary" size="x-small" class="mr-1">
          {{ value.id }}
        </v-avatar>
        {{ value.name }}
      </v-btn>
    </template>
    <v-card>
      <v-card-text>
        <div class="mx-auto text-center">
          <v-avatar color="primary" class="mb-2">
            {{ value.id }}
          </v-avatar>
          <h4>{{ value.loginId }}</h4>
          <p class="text-caption mt-1">
            {{ value.name }}
          </p>
        </div>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import type { UserSimple } from "@/definitions/types";

defineProps<{
  value: UserSimple;
}>();
</script>
