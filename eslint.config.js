import tseslint from "typescript-eslint";
import eslintConfigPrettier from "@vue/eslint-config-prettier";
import vueeslint from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import vuetifyeslint from "eslint-plugin-vuetify";
import importPlugin from "eslint-plugin-import";
import eslintPluginSecurity from "eslint-plugin-security";

const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

export default [
  {
    files: ["src/**/*.{ts,vue}"],
    ignores: ["node_modules/**/*", "dist/**/*"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
        tsconfigRootDir: new URL(".", import.meta.url).pathname,
        ecmaFeatures: { jsx: false },
        extraFileExtensions: [".vue"],
        vueFeatures: {
          filter: false,
          interpolationAsNonHTML: true,
          styleCSSVariableInjection: true,
        },
      },
      globals: {
        process: "readonly",
        window: "readonly",
        console: "readonly",
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      vue: vueeslint,
      vuetify: vuetifyeslint,
      import: importPlugin,
      security: eslintPluginSecurity,
    },
    rules: {
      /* TypeScript 관련 규칙 */
      ...tseslint.configs.recommended.at(-1).rules,
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
          prefer: "type-imports",
          disallowTypeAnnotations: false,
          fixStyle: "separate-type-imports",
        },
      ],

      /* Import/Export 관련 규칙 */
      "import/no-duplicates": "error",

      /* 보안 관련 규칙 */
      ...eslintPluginSecurity.configs.recommended.rules,
      "security/detect-object-injection": "off",

      /* Vuetify 관련 규칙 */
      "vuetify/no-deprecated-classes": "error",

      /* Vue 3 관련 규칙 */
      ...vueeslint.configs["flat/recommended"].rules,
      "vue/no-unused-components": isDevelopment ? "warn" : "error",
      "vue/component-name-in-template-casing": ["error", "PascalCase"],
      "vue/component-definition-name-casing": ["error", "PascalCase"],
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "off", // 필요에 따라 조정

      /* 환경별 규칙 */
      "no-console": isProduction
        ? ["error", { allow: ["info", "warn", "error"] }]
        : "off",
      "no-debugger": isProduction ? "error" : "off",

      /* 기타 코드 품질 규칙 */
      "no-unsafe-optional-chaining": "off",
      semi: ["error", "always"],
      "no-cond-assign": ["error", "always"],

      /* Prettier와 충돌 방지 */
      quotes: "off",
      "comma-dangle": "off",
      "space-before-function-paren": "off",
      indent: "off",
      "lines-between-class-members": "off",
    },
  },
  // Prettier 설정은 마지막에 적용
  eslintConfigPrettier,
];
