import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: [
        ...nextCoreWebVitals,
        ...compat.extends("eslint:recommended"),
        ...compat.extends("plugin:@typescript-eslint/recommended"),
        ...compat.extends("prettier")
    ],

    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        parser: tsParser,
    },

    rules: {
        "@typescript-eslint/consistent-type-definitions": "off",
        "@next/next/no-img-element": "off",
        "@typescript-eslint/prefer-nullish-coalescing": "off",
        "@typescript-eslint/consistent-type-imports": "warn",
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "react/react-in-jsx-scope": "off",
        "react/no-children-prop": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "react/prop-types": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "react/no-unescaped-entities": "off",
        "react/no-unknown-property": "off",
    },
}]);