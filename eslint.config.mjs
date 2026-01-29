import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import onlyWarn from 'eslint-plugin-only-warn';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export default defineConfig([
  js.configs.recommended,
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  ...tseslint.configs.recommended,
  { plugins: { onlyWarn } },
  globalIgnores(['dist/**']),
]);
