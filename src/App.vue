<template>
  <v-app>
    <input type="text" style="width: 0; height: 0" />
    <component :is="currentLayout" v-if="isRouterLoaded">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </component>
    <GlobalDialogConfirm />
    <input type="text" style="width: 0; height: 0" />
    <Toaster
      richColors
      theme="dark"
      position="top-right"
      :expand="true"
      :visibleToasts="99"
      :toastOptions="{
        duration: 2_000,
      }"
    />
  </v-app>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { PRODUCT_TITLE } from "@/constants/envs";
import AuthLayout from "@/layouts/AuthLayout.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import ErrorLayout from "@/layouts/ErrorLayout.vue";
import SimpleLayout from "@/layouts/SimpleLayout.vue";
import { useAdminStore } from "@/stores/admin";
import { goLoginPage, isExpiredToken } from "@/utils/commands";
import GlobalDialogConfirm from "@/views/components/dialog/GlobalDialogConfirm.vue";
import { Toaster } from "vue-sonner";

const route = useRoute();
const isRouterLoaded = computed((): boolean => route.name !== null);
const currentLayout = computed(() => {
  if (route?.meta?.["layout"] === "default") {
    return DefaultLayout;
  } else if (route?.meta?.["layout"] === "auth") {
    return AuthLayout;
  } else if (route?.meta?.["layout"] === "error") {
    return ErrorLayout;
  }
  return SimpleLayout;
});

onMounted(async () => {
  window.document.title = PRODUCT_TITLE;
  const { loggedIn, tokens, clearAdmin } = useAdminStore();
  if (loggedIn && isExpiredToken(tokens.accessToken)) {
    clearAdmin();
    await goLoginPage();
  } else if (!loggedIn && route.path !== "/login") {
    await goLoginPage();
  }
});
</script>

<style scoped>
/**
 * Transition animation between pages
 */
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.2s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
<style>
:root {
  --nv-z: 9999;
}
</style>
