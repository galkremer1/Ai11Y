import { ESLint } from "eslint";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tsParser from "@typescript-eslint/parser";
import { createTool } from "@mastra/core/tools";
import {
  EslintRunRequestSchema,
  EslintRunResponseSchema,
  type EslintError,
} from "../../../shared/schemas/eslint.schemas";

const LINTABLE_EXTENSIONS = /\.(jsx?|tsx?)$/i;

export async function runEslintAudit(directory: string): Promise<EslintError[]> {
  const eslint = new ESLint({
    cwd: directory,
    ignore: true,
    overrideConfigFile: true,
    overrideConfig: [
      {
        ignores: [
          "node_modules/**",
          "out/**",
          "dist/**",
          "dist-electron/**",
          "build/**",
          "release/**",
          "**/node_modules/**",
        ],
      },
      jsxA11y.flatConfigs.recommended,
      {
        files: ["**/*.{js,jsx,ts,tsx}"],
        languageOptions: {
          parser: tsParser,
          parserOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            ecmaFeatures: { jsx: true },
          },
        },
      },
    ],
  });

  const results = await eslint.lintFiles(["**/*.{js,jsx,ts,tsx}"]);
  const errors: EslintError[] = [];

  for (const result of results) {
    if (!LINTABLE_EXTENSIONS.test(result.filePath)) continue;

    for (const message of result.messages) {
      if (!message.ruleId) continue;
      errors.push({
        file: result.filePath,
        line: message.line,
        column: message.column,
        ruleId: message.ruleId,
        severity: message.severity === 2 ? "error" : "warning",
        message: message.message,
      });
    }
  }

  return errors;
}

export const eslintTool = createTool({
  id: "eslint-a11y-lint",
  description: "Run eslint-plugin-jsx-a11y against a directory of source files",
  inputSchema: EslintRunRequestSchema,
  outputSchema: EslintRunResponseSchema,
  execute: async ({ context }) => {
    const errors = await runEslintAudit(context.directory);
    return { errors };
  },
});
