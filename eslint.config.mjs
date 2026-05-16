import { defineConfig } from "eslint/config";
import eslintJs from "@eslint/js";
import tsEslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: [".idea", "dist", "node_modules"],
  },
  eslintJs.configs.recommended,
  tsEslint.configs.strict,
  tsEslint.configs.stylistic,
);
