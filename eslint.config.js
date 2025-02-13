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
      parser: vueParser, // Vue 파서를 기본으로 설정
      parserOptions: {
        parser: tsparser, // TypeScript 파서를 보조 파서로 설정
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
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
      security: eslintPluginSecurity,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      // TypeScript 관련 엄격한 규칙 추가
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/strict-boolean-expressions": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      // Vue 3 관련 최신 규칙 추가
      "vue/script-setup-uses-vars": "error",
      "vue/component-api-style": ["error", ["script-setup", "composition"]], // Options API 사용 제한
      "vue/define-macros-order": [
        "error",
        {
          order: ["defineProps", "defineEmits", "defineExpose"],
        },
      ],
      "vue/define-props-declaration": ["error", "type-based"], // 타입 기반 props 선언 강제
      // 보안 관련 규칙 추가
      "no-eval": "error",
      "no-implied-eval": "error",
      "security/detect-object-injection": "error",
      "security/detect-non-literal-regexp": "warn",
      // 성능 최적화 설정
      "vue/no-async-in-computed-properties": "error",
      "vue/no-side-effects-in-computed-properties": "error",
      "vue/no-unused-components": isDevelopment ? "warn" : "error",
      // Import/Export 관련 규칙 개선
      "import/no-unresolved": "error",
      "import/named": "error",
      "import/default": "error",
      "import/namespace": "error",
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src/components",
              from: "./src/views",
              message: "컴포넌트는 뷰에 의존성을 가질 수 없습니다.",
            },
          ],
        },
      ],
      // 환경변수 설정 개선
      "no-console": isProduction
        ? ["error", { allow: ["info", "warn", "error"] }]
        : "off",
      "no-debugger": isProduction ? "error" : "off",
      // 기타 커스텀 설정
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
      quotes: "off",
      semi: ["error", "always"],
      "comma-dangle": "off",
      "no-cond-assign": ["error", "always"],
      "space-before-function-paren": "off",
      indent: "off",
      "lines-between-class-members": "off",
      "vue/no-v-text-v-html-on-component": "off",
      "vue/max-attributes-per-line": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/no-mutating-props": [
        "error",
        {
          shallowOnly: true,
        },
      ],
    },
  },
  eslintConfigPrettier,
];
