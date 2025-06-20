<template>
  <v-fab
    absolute
    :color="open ? '' : color"
    :location="location"
    size="small"
    icon
    :style="{ margin: margin + 'px' }"
  >
    <v-icon>{{ open ? "mdi-close" : "mdi-function" }}</v-icon>
    <v-speed-dial
      v-model="open"
      location="bottom center"
      transition="scale-transition"
      activator="parent"
      close-on-back
      open-on-hover
    >
      <v-btn
        v-for="(item, index) in modelValue"
        :key="index"
        :color="item.color"
        size="large"
        @click="item.onClick"
      >
        {{ item.title }}
      </v-btn>
    </v-speed-dial>
  </v-fab>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { FabButtonProp } from "@/definitions/types";

const modelValue = defineModel<FabButtonProp[]>("modelValue", {
  required: true,
});

withDefaults(
  defineProps<{
    color?: string;
    location?:
      | "top left"
      | "top center"
      | "top right"
      | "left center"
      | "center center"
      | "right center"
      | "left bottom"
      | "bottom center"
      | "right bottom";
    margin?: number;
  }>(),
  { color: "primary", location: "top right", margin: 10 },
);

const open = ref(false);
</script>
