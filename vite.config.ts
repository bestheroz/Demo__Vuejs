import type { Plugin, PluginOption } from "vite";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import eslint from "vite-plugin-eslint2";
import checker from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";
import { transformAssetUrls } from "vite-plugin-vuetify";

const projectRootDir = resolve(__dirname);
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_ENVIRONMENT");
  const productionFlag = env.VITE_ENVIRONMENT !== "local";
  const plugins: (Plugin | Plugin[] | PluginOption)[] = [
    vue({
      template: { transformAssetUrls },
    }),
    tsconfigPaths(),
    {
      ...eslint({ useEslintrc: true, fix: true, lintInWorker: true }),
      apply: "serve",
    },
    {
      ...checker({
        vueTsc: true,
      }),
      apply: "serve",
    },
  ];
  return {
    plugins: plugins,
    server: {
      port: 8081,
    },
    resolve: {
      alias: {
        "@": resolve(projectRootDir, "./src"),
      },
    },
    css: {
      devSourcemap: productionFlag,
    },
    build: {
      target: "esnext",
      sourcemap: productionFlag,
    },
  };
});
