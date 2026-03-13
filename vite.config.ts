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
    isServe &&
      checker({
        vueTsc: true,
        typescript: true,
      }),
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
      include: ["vue", "vue-router", "pinia", "axios", "vuetify"],
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
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              if (id.includes("vuetify")) return "vuetify";
              if (id.includes("vue") || id.includes("pinia")) return "vue";
              if (id.includes("axios") || id.includes("qs")) return "http";
              return "vendor";
            }
          },
        },
      },
    },
  };
});
