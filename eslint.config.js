import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import vueeslint from "eslint-plugin-vue";
import vuetifyeslint from "eslint-plugin-vuetify";
import importPlugin from "eslint-plugin-import";

export default [
  eslint.configs.recommended,
  {
    ignores: ["node_modules/**/*", "dist/**/*"],
    languageOptions: {
      parser: vueeslint.parser, // Vue 파서를 기본으로 설정
      parserOptions: {
        parser: tsparser, // TypeScript 파서를 보조 파서로 설정
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: false,
        },
        extraFileExtensions: [".vue"], // Vue 파일 확장자 추가
        vueFeatures: {
          // Vue 특정 기능 설정 추가
          filter: false,
          interpolationAsNonHTML: true,
          styleCSSVariableInjection: true,
        },
      },
      globals: {
        process: "readonly",
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    plugins: {
      "@typescript-eslint": tseslint,
      vue: vueeslint,
      vuetify: vuetifyeslint,
      import: importPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      // 기존 rules 유지
    },
  },
  eslintConfigPrettier,
];
