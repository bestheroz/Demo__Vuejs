<script setup lang="ts">
import type { Drawer } from "@/definitions/types";
import NavMenu from "@/views/components/navigation/NavMenu.vue";
import NavMenuItem from "@/views/components/navigation/NavMenuItem.vue";

const {
  drawers = () => [],
  depth = 0,
} = defineProps<{
  drawers?: Drawer[] | null;
  depth?: number;
}>();
</script>

<template>
  <NavMenuItem v-for="drawer in drawers" :key="drawer.name" :drawer="drawer">
    <NavMenu :drawers="drawer.children" :depth="depth + 1" />
  </NavMenuItem>
</template>
