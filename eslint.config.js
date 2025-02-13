// eslint.config.js
module.exports = {
  // 무시할 파일이나 폴더를 배열로 지정 (예: node_modules와 dist 폴더)
  ignores: ["node_modules/**/*", "dist/**/*"],

  root: true,
  parser: "vue-eslint-parser",
  parserOptions: {
    sourceType: "module",
    ecmaVersion: "latest",
    parser: "@typescript-eslint/parser",
    ecmaFeatures: {
      globalReturn: false,
      impliedStrict: false,
      jsx: false,
    },
    vueFeatures: {
      filter: false,
      interpolationAsNonHTML: true,
      styleCSSVariableInjection: true,
    },
  },
  env: {
    node: true,
    browser: true,
    es2024: true,
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-recommended",
    "plugin:vuetify/recommended",
    "plugin:prettier/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
  ],
  plugins: ["vue", "@typescript-eslint", "import"],
  settings: {
    "import/resolver": {
      typescript: {
        // tsconfig.json 파일의 경로를 지정
        project: "./tsconfig.json",
      },
    },
  },
  rules: {
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
    "no-console":
      process.env.NODE_ENV === "production"
        ? ["error", { allow: ["info", "warn", "error"] }]
        : ["warn", { allow: ["info", "warn", "error"] }],
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    quotes: "off",
    semi: ["error", "always"],
    "comma-dangle": "off",
    "no-cond-assign": ["error", "always"],
    "space-before-function-paren": "off",
    indent: "off",
    "prettier/prettier": "off",
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
};
