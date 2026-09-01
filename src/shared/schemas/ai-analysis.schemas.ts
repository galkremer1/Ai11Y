import { z } from "zod";

export const CodeFixSchema = z.object({
  file: z.string(),
  line: z.number(),
  original: z.string(),
  fixed: z.string(),
  explanation: z.string(),
});
export type CodeFix = z.infer<typeof CodeFixSchema>;

export const AnalyzeCodeRequestSchema = z.object({
  code: z.string(),
  language: z.string(),
  filePath: z.string().optional(),
});
export type AnalyzeCodeRequest = z.infer<typeof AnalyzeCodeRequestSchema>;

export const AnalyzeCodeResponseSchema = z.object({
  fixes: z.array(CodeFixSchema),
  summary: z.string(),
});
export type AnalyzeCodeResponse = z.infer<typeof AnalyzeCodeResponseSchema>;

export const HtmlFixSchema = z.object({
  selector: z.string(),
  original: z.string(),
  fixed: z.string(),
  explanation: z.string(),
});
export type HtmlFix = z.infer<typeof HtmlFixSchema>;

export const AnalyzeHtmlRequestSchema = z.object({
  html: z.string(),
  url: z.string().optional(),
});
export type AnalyzeHtmlRequest = z.infer<typeof AnalyzeHtmlRequestSchema>;

export const AnalyzeHtmlResponseSchema = z.object({
  fixes: z.array(HtmlFixSchema),
  summary: z.string(),
});
export type AnalyzeHtmlResponse = z.infer<typeof AnalyzeHtmlResponseSchema>;
