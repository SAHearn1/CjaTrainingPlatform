import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  {
    // supabase/functions uses Deno runtime — requires separate deno-lint tooling
    ignores: ["dist", "node_modules", "supabase/functions"],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    plugins: {
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,

      // Relax rules that conflict with existing Figma-generated patterns
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-unused-vars": "off", // handled by @typescript-eslint/no-unused-vars
    },
  },

  // Disable formatting rules that conflict with Prettier
  prettier,
);
