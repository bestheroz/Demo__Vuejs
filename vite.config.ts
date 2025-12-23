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
    server: {
      port: 3000,
    },
    resolve: {
      alias: {
        "@": resolve(import.meta.dirname, "./src"),
      },
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
