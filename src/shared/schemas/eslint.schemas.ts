import { z } from "zod";

export const EslintErrorSchema = z.object({
  file: z.string(),
  line: z.number(),
  column: z.number(),
  ruleId: z.string(),
  severity: z.enum(["error", "warning"]),
  message: z.string(),
});
export type EslintError = z.infer<typeof EslintErrorSchema>;

export const EslintRunRequestSchema = z.object({
  directory: z.string().describe("Absolute path to the directory to lint"),
});
export type EslintRunRequest = z.infer<typeof EslintRunRequestSchema>;

export const EslintRunResponseSchema = z.object({
  errors: z.array(EslintErrorSchema),
});
export type EslintRunResponse = z.infer<typeof EslintRunResponseSchema>;
