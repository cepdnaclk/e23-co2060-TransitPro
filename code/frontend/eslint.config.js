import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint/config";

// Extract rules for cleaner array below
const customRules = {
  "no-unused-vars": [
    "error",
    {
      varsIgnorePattern: "^[A-Z_]", 
      argsIgnorePattern: "^_",      
    },
  ],
  "no-console": "warn", 
};

// Extract environment settings
const customLanguageOptions = {
  ecmaVersion: "latest", 
  sourceType: "module",
  globals: {
    ...globals.browser,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
};

export default defineConfig([
  {
    ignores: ["dist"], 
  },
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: customLanguageOptions,
    rules: customRules,
  },
]);
