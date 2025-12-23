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
    vuetify({ autoImport: false }),
    isServe && eslint({ fix: true, lintInWorker: true }),
    isServe &&
      checker({
        vueTsc: true,
        typescript: true,
      }),
  ];
  return {
    plugins,
    define: {
      // Vue 3.5+ - 프로덕션에서 devtools 비활성화
      __VUE_PROD_DEVTOOLS__: false,
      // Vue 3.5+ - hydration mismatch 상세 정보 비활성화 (SSR 사용 시)
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    },
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
      // 자주 사용되는 의존성 미리 번들링
      include: ["vue", "vue-router", "pinia", "axios", "vuetify"],
    },
    css: {
      devSourcemap: isServe,
    },
    build: {
      target: "esnext",
      sourcemap: isBuild,
      cssCodeSplit: true,
      cssMinify: "lightningcss",
      minify: "esbuild",
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1000,
      modulePreload: { polyfill: false },
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              if (id.includes("vue") || id.includes("pinia")) return "vue";
              if (id.includes("vuetify")) return "vuetify";
              if (id.includes("axios") || id.includes("qs")) return "http";
              return "vendor";
            }
          },
        },
      },
    },
    esbuild: {
      legalComments: "none",
      drop: isBuild ? ["debugger"] : [],
    },
  };
});
