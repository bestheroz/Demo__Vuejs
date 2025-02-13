import type { Plugin, PluginOption } from "vite";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import eslint from "vite-plugin-eslint2";
import checker from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

const projectRootDir = resolve(__dirname);
export default defineConfig(({ command }) => {
  const isServe = command === "serve";
  const isBuild = command === "build";

  const plugins: (Plugin[] | PluginOption)[] = [
    vue({
      template: { transformAssetUrls },
      isProduction: isBuild,
    }),
    vuetify({ autoImport: false }),
    tsconfigPaths(),
    {
      ...eslint({ fix: true, lintInWorker: true }),
      apply: "serve",
    },
    {
      ...checker({
        vueTsc: true,
        typescript: true,
      }),
      apply: "serve",
    },
  ];
  return {
    plugins: plugins,
    server: {
      port: 3000,
      // Hot Module Replacement
      hmr: {
        overlay: isServe,
      },
    },
    resolve: {
      alias: {
        "@": resolve(projectRootDir, "./src"),
      },
    },
    css: {
      devSourcemap: isServe,
    },
    build: {
      target: "esnext",
      sourcemap: isBuild,
    },
  };
});
