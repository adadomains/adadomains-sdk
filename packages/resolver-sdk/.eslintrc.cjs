const prettierConfig = require("./prettier.config.cjs");

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["prettier", "eslint:recommended", "standard", "plugin:prettier/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "no-unused-vars": "warn",
    "no-redeclare": "off",
    "react/react-in-jsx-scope": "off",
    "react/no-children-prop": "off",
    "react/prop-types": "off",
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-namespace": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/no-empty-function": 0,
    "prettier/prettier": ["error", prettierConfig],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  globals: {
    JSX: true,
  },
};
