<template>
  <v-list-group
    v-if="drawer.type === MenuType.GROUP"
    collapse-icon="mdi-chevron-down"
    expand-icon="mdi-chevron-right"
    color="primary"
  >
    <template #activator="{ props }">
      <v-list-item
        v-bind="props"
        :prepend-icon="drawer.icon ?? ''"
        :title="drawer.name"
      ></v-list-item>
    </template>
    <slot />
  </v-list-group>
  <v-list-item
    v-else
    :value="drawer.url"
    :link="drawer.type === MenuType.PAGE"
    :target="drawer.type === MenuType.NEW_TAB ? '_blank' : undefined"
    :prepend-icon="drawer.icon ?? ''"
    :title="drawer.name"
    color="rgb(var(--v-theme-primary))"
    @click="movePage(drawer)"
  />
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { MenuType } from "@/definitions/selections";
import type { Drawer } from "@/definitions/types";
import { routerPush } from "@/utils/commands";

defineProps<{
  drawer: Drawer;
}>();

const route = useRoute();
function movePage(item: Drawer): void {
  if (!item.url || item.url === route.fullPath) {
    return;
  }
  routerPush(item.url);
}
</script>
