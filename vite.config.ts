import type { PluginOption } from "vite";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import eslint from "vite-plugin-eslint2";
import checker from "vite-plugin-checker";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineConfig(({ command }) => {
  const isServe = command === "serve";
  const isBuild = command === "build";

  const plugins: PluginOption[] = [
    vue({
      template: { transformAssetUrls },
      isProduction: isBuild,
    }),
    vuetify({ autoImport: true }),
    isServe && eslint({ fix: true, lintInWorker: true }),
    // vueTsc가 .vue + .ts 모두 체크하므로 typescript 별도 설정 불필요
    isServe && checker({ vueTsc: true }),
  ];
  return {
    plugins,
    server: {
      port: 3000,
      warmup: {
        clientFiles: ["./src/main.ts", "./src/App.vue"],
      },
    },
    preview: {
      port: 3001,
    },
    resolve: {
      alias: {
        "@": resolve(import.meta.dirname, "./src"),
      },
    },
    optimizeDeps: {
      include: [
        // Core frameworks
        "vue",
        "vue-router",
        "pinia",
        "pinia-plugin-persistedstate",
        // HTTP & utilities
        "axios",
        "qs",
        "dayjs",
        "dayjs/plugin/customParseFormat",
        "jwt-decode",
        "consola",
        "vue-sonner",
        // Vuetify core
        "vuetify",
        "vuetify/locale",
        // Vuetify components (auto-import 시에도 pre-bundle하여 full-reload 방지)
        "vuetify/components/VApp",
        "vuetify/components/VAppBar",
        "vuetify/components/VAutocomplete",
        "vuetify/components/VAvatar",
        "vuetify/components/VBottomSheet",
        "vuetify/components/VBreadcrumbs",
        "vuetify/components/VBtn",
        "vuetify/components/VCard",
        "vuetify/components/VCheckbox",
        "vuetify/components/VChip",
        "vuetify/components/VCombobox",
        "vuetify/components/VDataTable",
        "vuetify/components/VDialog",
        "vuetify/components/VDivider",
        "vuetify/components/VFab",
        "vuetify/components/VFileInput",
        "vuetify/components/VForm",
        "vuetify/components/VGrid",
        "vuetify/components/VIcon",
        "vuetify/components/VImg",
        "vuetify/components/VLayout",
        "vuetify/components/VList",
        "vuetify/components/VMain",
        "vuetify/components/VMenu",
        "vuetify/components/VNavigationDrawer",
        "vuetify/components/VRadio",
        "vuetify/components/VRadioGroup",
        "vuetify/components/VSelect",
        "vuetify/components/VSkeletonLoader",
        "vuetify/components/VSpeedDial",
        "vuetify/components/VSwitch",
        "vuetify/components/VTextField",
        "vuetify/components/VTextarea",
        "vuetify/components/VTooltip",
      ],
    },
    css: {
      // Vite 8: lightningcss가 기본 transformer로 설정됨
      devSourcemap: isServe,
    },
    build: {
      target: "esnext",
      sourcemap: isBuild,
      // Vite 8: cssCodeSplit 기본값 true, cssMinify 기본값 lightningcss
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1000,
      modulePreload: { polyfill: false },
      rolldownOptions: {
        output: {
          comments: { legal: false },
          codeSplitting: {
            groups: [
              {
                name: (id) => {
                  if (id.includes("vuetify")) return "vuetify";
                  if (id.includes("vue") || id.includes("pinia")) return "vue";
                  if (id.includes("axios") || id.includes("qs")) return "http";
                  return "vendor";
                },
                test: /node_modules/,
              },
            ],
          },
        },
      },
    },
  };
});
