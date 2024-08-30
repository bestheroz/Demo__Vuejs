require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
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
      interpolationAsNonHTML: false,
      styleCSSVariableInjection: true,
    },
  },
  env: {
    node: true,
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-recommended",
    "@vue/prettier",
    "@vue/typescript",
    "@vue/eslint-config-prettier",
  ],
  plugins: ["vue", "@typescript-eslint"],
  rules: {
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
