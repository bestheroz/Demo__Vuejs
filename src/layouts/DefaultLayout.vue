<template>
  <div class="d-flex flex-grow-1">
    <!-- Navigation -->
    <v-navigation-drawer
      v-model="drawer"
      app
      class="elevation-1"
      floating
      light
    >
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
        <NavMenu :drawers="DRAWERS" />
      </v-list>
    </v-navigation-drawer>

    <!-- Toolbar -->
    <v-app-bar :flat="false" app light>
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
            <SelectApiHeaderOfDevice />
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
import { ref } from "vue";
import { PRODUCT_TITLE, PRODUCT_VERSION } from "@/constants/envs";
import { DRAWERS } from "@/definitions/drawers";
import NavMenu from "@/views/components/navigation/NavMenu.vue";
import SelectApiHeaderOfDevice from "@/views/components/toolbar/SelectApiHeaderOfDevice.vue";
import LoginToolbar from "@/views/components/toolbar/LoginToolbar.vue";

const drawer = ref(true);
</script>
