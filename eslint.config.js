import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import vueeslint from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
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
      perfectionist,
      security: eslintPluginSecurity,
    },
    rules: {
      /* TypeScript 관련 규칙 - strict 기반 */
      ...Object.assign({}, ...tseslint.configs.strictTypeChecked.map(c => c.rules).filter(Boolean)),
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
      "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: false }],
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "@typescript-eslint/no-unnecessary-type-parameters": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/await-thenable": "off",
      "@typescript-eslint/restrict-plus-operands": "off",
      "@typescript-eslint/prefer-promise-reject-errors": "off",
      "@typescript-eslint/unbound-method": "off",

      /* Import/Export 관련 규칙 */
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
      /* Vue 3.5+ 새 규칙 */
      "vue/prefer-use-template-ref": "error",
      "vue/require-macro-variable-name": [
        "error",
        {
          defineProps: "props",
          defineEmits: "emit",
          defineSlots: "slots",
          useSlots: "slots",
          useAttrs: "attrs",
        },
      ],
      "vue/no-use-v-else-with-v-for": "error",
      "vue/require-explicit-slots": "warn",
      "vue/slot-name-casing": ["error", "camelCase"],
      "vue/enforce-style-attribute": ["warn", { allow: ["scoped", "plain"] }],
      "vue/no-deprecated-model-definition": "error",

      /* 환경별 규칙 */
      "no-console": isProduction
        ? ["error", { allow: ["info", "warn", "error"] }]
        : "off",
      "no-debugger": isProduction ? "error" : "off",

      /* 기타 코드 품질 규칙 */
      "no-unsafe-optional-chaining": "off",
      "no-cond-assign": ["error", "always"],
    },
  },
  eslintConfigPrettier,
);
