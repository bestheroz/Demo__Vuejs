<template>
  <div class="d-flex flex-grow-1">
    <!-- Navigation -->
    <v-navigation-drawer v-model="drawer" class="elevation-1" floating>
      <!-- Navigation menu info -->
      <template #prepend>
        <div class="py-2 px-6">
          <div class="text-h6 text-primary font-weight-bold">
            {{ PRODUCT_TITLE }}
          </div>
          <div
            class="text-overline text-blue-grey"
            style="color: #777777; text-transform: none !important"
          >
            {{ PRODUCT_VERSION }}
          </div>
        </div>
      </template>

      <!-- Navigation menu -->
      <v-list class="py-0" density="compact" nav>
        <NavMenu :drawers="filteredDrawer" />
      </v-list>
    </v-navigation-drawer>

    <!-- Toolbar -->
    <v-app-bar :flat="false">
      <v-card :flat="true" class="flex-grow-1 d-flex pa-0 ma-0">
        <div class="d-flex flex-grow-1 align-center">
          <div class="d-flex flex-grow-1 align-center">
            <v-app-bar-nav-icon
              size="48"
              style="margin-right: 12px"
              @click.stop="drawer = !drawer"
            />
            <v-spacer />
            <LoginToolbar />
            <v-spacer />
            <ToolbarAdmin />
          </div>
        </div>
      </v-card>
    </v-app-bar>

    <v-main>
      <v-container
        :fluid="true"
        class="fill-height"
        style="align-items: normal"
      >
        <v-layout>
          <slot />
        </v-layout>
      </v-container>
    </v-main>
  </div>
</template>

<script lang="ts" setup>
import ToolbarAdmin from "@/views/components/toolbar/ToolbarAdmin.vue";
import { computed, ref } from "vue";
import { PRODUCT_TITLE, PRODUCT_VERSION } from "@/constants/envs";
import { DRAWERS } from "@/definitions/drawers";
import NavMenu from "@/views/components/navigation/NavMenu.vue";
import LoginToolbar from "@/views/components/toolbar/LoginToolbar.vue";
import { useAdminStore } from "@/stores/admin";
import { storeToRefs } from "pinia";

const drawer = ref(true);

const { authorities } = storeToRefs(useAdminStore());

const hasRequiredAuthority = (val) =>
  !val.authority || authorities.value.includes(val.authority);

const filteredDrawer = computed(() =>
  DRAWERS.filter(hasRequiredAuthority)
    .map((drawer) => ({
      ...drawer,
      children: drawer.children?.filter(hasRequiredAuthority) || [],
    }))
    .filter((drawer) => drawer.children.length > 0),
);
</script>
