import { eslint } from "@betterer/eslint";

export default {
  "Better Code Quality !": () =>
    eslint({
      "no-console": "error",
      "no-await-in-loop": "error",
      "no-debugger": "error",
      "no-duplicate-imports": "error",
      "no-unused-vars": "error",
      complexity: ["error", 18],
      "max-lines-per-function": ["error", 50],
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/array-type": "error"
    }).include("./src/**/*.vue", "./src/**/*.ts", "./src/**/*.js")
};
