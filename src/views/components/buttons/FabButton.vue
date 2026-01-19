<script setup lang="ts">
import type { FabButtonProp } from "@/definitions/types";
import { ref } from "vue";

const {
  color = "blue-darken-2",
  location = "top right",
  margin = 16,
} = defineProps<{
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
}>();

const modelValue = defineModel<FabButtonProp[]>("modelValue", {
  required: true,
});

const open = ref(false);
</script>

<template>
  <v-fab
    absolute
    :color="open ? '' : color"
    :location="location"
    size="large"
    icon
    :style="{
      margin: margin + 'px',
    }"
    :elevation="open ? 12 : 6"
  >
    <v-icon>
      {{ open ? "mdi-close" : "mdi-function" }}
    </v-icon>
    <v-speed-dial
      v-model="open"
      location="bottom center"
      transition="slide-y-reverse-transition"
      activator="parent"
      close-on-back
      open-on-hover
    >
      <v-btn
        v-for="(item, index) in modelValue.filter((v) => !v.hide)"
        :key="index"
        :color="item.color || 'grey-darken-1'"
        size="large"
        variant="elevated"
        rounded="pill"
        :elevation="8"
        class="fab-menu-item"
        @click="item.onClick"
      >
        <v-icon v-if="item.icon" start>{{ item.icon }}</v-icon>
        <span
          style="font-weight: 600; font-size: 0.95rem; letter-spacing: 0.5px"
          >{{ item.title }}</span
        >
      </v-btn>
    </v-speed-dial>
  </v-fab>
</template>

<style scoped>
.fab-menu-item {
  animation: slideInFromBottom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  opacity: 0;
  position: relative;
  overflow: hidden;
  margin-bottom: 0 !important;
}

.fab-menu-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s ease;
}

.fab-menu-item:hover::before {
  left: 100%;
}

.fab-menu-item:hover {
  transform: translateX(-12px) scale(1.08);
  box-shadow:
    0 12px 28px rgba(0, 0, 0, 0.45),
    0 6px 16px rgba(0, 0, 0, 0.35),
    inset 0 1px 1px rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.25) !important;
}

@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.75) rotateX(15deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1) rotateX(0);
  }
}

:deep(.v-speed-dial__list) {
  gap: 8px;
  padding: 12px;
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.5),
    0 10px 25px rgba(0, 0, 0, 0.4);
}

:deep(.v-btn--variant-elevated) {
  text-transform: none;
  position: relative;
  z-index: 1;
  margin-bottom: 0;
}

:deep(.v-btn--variant-elevated .v-btn__content) {
  z-index: 2;
  position: relative;
}
</style>
