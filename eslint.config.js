import eslint from "@eslint/js";
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
  eslint.configs.recommended,
  {
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
      globals: { process: "readonly" },
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
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/strict-boolean-expressions": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", disallowTypeAnnotations: false },
      ],
      "@typescript-eslint/consistent-type-exports": [
        "error",
        { fixMixedExportsWithInlineTypeSpecifier: true },
      ],
      "@typescript-eslint/consistent-generic-constructors": [
        "error",
        "type-annotation",
      ],
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/prefer-readonly": "error",
      "@typescript-eslint/promise-function-async": "error",
      "@typescript-eslint/no-floating-promises": "error",

      /* Vue 3 관련 최신 규칙 (flat/recommended 하나로 충분) */
      ...vueeslint.configs["flat/recommended"],

      /* Import/Export 관련 규칙 */
      "import/no-cycle": ["error", { maxDepth: 1 }],
      "import/no-useless-path-segments": ["error", { noUselessIndex: true }],
      "import/no-deprecated": "error",
      "import/no-mutable-exports": "error",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["sibling", "parent"],
            "index",
          ],
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-relative-parent-imports": "error",
      "import/no-relative-packages": "error",
      "import/no-internal-modules": [
        "error",
        { allow: ["@/components/*", "@/composables/*"] },
      ],
      "import/unresolved": "error", // alias 사용 시 참고

      /* 보안 관련 규칙 */
      "no-eval": "error",
      "no-implied-eval": "error",
      "security/detect-object-injection": "error",
      "security/detect-non-literal-regexp": "warn",
      "security/detect-possible-timing-attacks": "error",
      "security/detect-unsafe-regex": "error",
      "security/detect-buffer-noassert": "error",
      "security/detect-disable-mustache-escape": "error",
      "security/detect-non-literal-fs-filename": "error",
      "security/detect-child-process": "error",
      "security/detect-new-buffer": "error",

      /* 성능 최적화 및 Vue 관련 추가 규칙 */
      "vue/no-async-in-computed-properties": "error",
      "vue/no-side-effects-in-computed-properties": "error",
      "vue/no-unused-components": isDevelopment ? "warn" : "error",
      "vue/no-duplicate-attributes": [
        "error",
        { allowCoexistClass: false, allowCoexistStyle: false },
      ],
      "vue/require-toggle-inside-transition": "error",
      "vue/valid-v-memo": "error",
      "vue/no-static-inline-styles": "error",
      "vue/prefer-separate-static-class": "error",
      "vue/no-extra-parens": "error",
      "vue/no-mutating-props": ["error", { shallowOnly: true }],

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
