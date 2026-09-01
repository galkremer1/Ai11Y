import { createTool } from "@mastra/core/tools";
import {
  EslintRunRequestSchema,
  EslintRunResponseSchema,
} from "../../../shared/schemas/eslint.schemas";

export const eslintTool = createTool({
  id: "eslint-a11y-lint",
  description: "Run eslint-plugin-jsx-a11y against a directory of source files",
  inputSchema: EslintRunRequestSchema,
  outputSchema: EslintRunResponseSchema,
  execute: async ({ context }) => {
    // Placeholder: will integrate ESLint programmatic API in a future phase
    console.log(`[eslint-tool] Would lint: ${context.directory}`);
    return { errors: [] };
  },
});
