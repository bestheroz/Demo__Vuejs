<script setup lang="ts">
import type { UserSimple } from "@/definitions/types";

defineProps<{
  value: UserSimple;
}>();
</script>

<template>
  <v-menu>
    <template #activator="{ props }">
      <v-btn v-bind="props" variant="plain">
        <v-avatar color="primary" size="1rem" class="mr-1">
          {{ value.id }}
        </v-avatar>
        <span style="vertical-align: middle">{{ value.name }}</span>
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
<style lang="scss" scoped>
:deep(.v-btn__content) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}
</style>
