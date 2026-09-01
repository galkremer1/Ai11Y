import { z } from "zod";

export const LLMModeSchema = z.enum(["cloud", "local"]);
export type LLMMode = z.infer<typeof LLMModeSchema>;

export const CloudProviderSchema = z.enum([
  "openai",
  "anthropic",
  "groq",
  "custom",
]);
export type CloudProvider = z.infer<typeof CloudProviderSchema>;

export const LLMSettingsSchema = z.object({
  mode: LLMModeSchema,
  cloud: z.object({
    provider: CloudProviderSchema,
    apiKey: z.string(),
    baseURL: z.string().optional(),
    modelName: z.string(),
  }),
  local: z.object({
    baseURL: z.string(),
    modelName: z.string(),
  }),
});
export type LLMSettings = z.infer<typeof LLMSettingsSchema>;

export const ConnectionTestResultSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
});
export type ConnectionTestResult = z.infer<typeof ConnectionTestResultSchema>;
