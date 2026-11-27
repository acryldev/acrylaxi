// @ts-check
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig(
  {
    // Generated build output, runtime state, and the vendored/upstream trees this
    // repository does not own (the `upstream/` submodule and the marketing project).
    ignores: ["dist/", "node_modules/", ".acrylaxi/", "acrylaxi-code-review.html", "upstream/", "marketing/"],
  },
  js.configs.recommended,
  eslintConfigPrettier,
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
);
