import eslint from "typescript-eslint";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import eslintConfigPrettier from "@vue/eslint-config-prettier";
import vueeslint from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import vuetifyeslint from "eslint-plugin-vuetify";
import importPlugin from "eslint-plugin-import";
import eslintPluginSecurity from "eslint-plugin-security";

const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

export default [
  eslint.configs.recommended[0],
  {
    files: ["src/**/*.{ts,vue}"],
    ignores: ["node_modules/**/*", "dist/**/*"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsparser,
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
        tsconfigRootDir: new URL(".", import.meta.url).pathname,
        ecmaFeatures: { jsx: false },
        extraFileExtensions: [".vue"],
        vueFeatures: {
          // Vue 3에서는 filter 문법은 제거되었으므로 false로 설정
          filter: false,
          interpolationAsNonHTML: true,
          styleCSSVariableInjection: true,
        },
      },
      globals: { process: "readonly", window: "readonly", console: "readonly" },
    },
    linterOptions: { reportUnusedDisableDirectives: true },
    plugins: {
      "@typescript-eslint": tseslint,
      vue: vueeslint,
      vuetify: vuetifyeslint,
      import: importPlugin,
      security: eslintPluginSecurity,
    },
    settings: {
      "import/resolver": {
        typescript: { project: "./tsconfig.json" },
      },
    },
    rules: {
      /* TypeScript 관련 엄격한 규칙 */
      ...tseslint.configs["recommended"].rules,
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          vars: "all",
          varsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports", // 타입 전용은 항상 import type
          disallowTypeAnnotations: false, // 타입 애노테이션 내에서만 쓰면 안 된다고 하려면 true
          fixStyle: "separate-type-imports",
        },
      ],

      /* Import/Export 관련 규칙 */
      ...importPlugin.configs["typescript"].rules,

      /* 보안 관련 규칙 */
      ...eslintPluginSecurity.configs["recommended"].rules,
      "security/detect-object-injection": "off",

      /* vuetify 관련 규칙 */
      ...vuetifyeslint.configs["flat/recommended"].rules,

      /* Vue 3 관련 최신 규칙 (flat/recommended 하나로 충분) */
      ...vueeslint.configs["flat/recommended"].rules,
      "vue/no-unused-components": isDevelopment ? "warn" : "error",
      "no-unsafe-optional-chaining": "off",

      /* 환경 변수 관련 설정 */
      "no-console": isProduction
        ? ["error", { allow: ["info", "warn", "error"] }]
        : "off",
      "no-debugger": isProduction ? "error" : "off",

      /* 기타 (Prettier가 포매팅 관련 부분을 처리하도록 함) */
      quotes: "off",
      semi: ["error", "always"],
      "comma-dangle": "off",
      "no-cond-assign": ["error", "always"],
      "space-before-function-paren": "off",
      indent: "off",
      "lines-between-class-members": "off",
    },
  },
  // Prettier 설정은 마지막에 적용
  eslintConfigPrettier,
];
