import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import vueeslint from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import vuetifyeslint from "eslint-plugin-vuetify";
import * as importX from "eslint-plugin-import-x";
import perfectionist from "eslint-plugin-perfectionist";
import eslintPluginSecurity from "eslint-plugin-security";

const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

export default tseslint.config(
  {
    files: ["src/**/*.{ts,vue}"],
    ignores: ["node_modules/**/*", "dist/**/*"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: "latest",
        sourceType: "module",
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
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
      reportUnusedDisableDirectives: "error",
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      vue: vueeslint,
      vuetify: vuetifyeslint,
      "import-x": importX,
      perfectionist,
      security: eslintPluginSecurity,
    },
    rules: {
      /* TypeScript 관련 규칙 - strict 기반 */
      ...tseslint.configs.strict.at(-1).rules,
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-dynamic-delete": "off",
      "@typescript-eslint/unified-signatures": "off",
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
      "import-x/no-duplicates": "error",
      "perfectionist/sort-imports": [
        "error",
        {
          type: "natural",
          order: "asc",
          groups: [
            "type",
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "side-effect",
            "style",
          ],
          newlinesBetween: "ignore",
          internalPattern: ["^@/.+"],
        },
      ],
      "perfectionist/sort-named-imports": ["error", { type: "natural" }],
      "perfectionist/sort-named-exports": ["error", { type: "natural" }],

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
      "vue/no-v-html": "off",
      "vue/block-order": ["error", { order: ["script", "template", "style"] }],
      "vue/define-macros-order": [
        "error",
        {
          order: ["defineOptions", "defineProps", "defineEmits", "defineSlots"],
          defineExposeLast: true,
        },
      ],
      "vue/prefer-define-options": "error",
      "vue/prefer-true-attribute-shorthand": "error",
      "vue/require-typed-ref": "warn",
      "vue/no-required-prop-with-default": "error",
      "vue/no-ref-object-reactivity-loss": "error",

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
  eslintConfigPrettier,
);
