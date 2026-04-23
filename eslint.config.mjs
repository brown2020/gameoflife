import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

const config = [
  ...tseslint.configs.recommended,
  nextPlugin.configs["core-web-vitals"],
];

export default config;
