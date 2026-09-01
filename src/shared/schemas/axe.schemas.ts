import { z } from "zod";

export const AxeNodeSchema = z.object({
  html: z.string(),
  target: z.array(z.string()),
  failureSummary: z.string(),
});

export const AxeViolationSchema = z.object({
  id: z.string(),
  impact: z.enum(["minor", "moderate", "serious", "critical"]),
  description: z.string(),
  helpUrl: z.string(),
  nodes: z.array(AxeNodeSchema),
});
export type AxeViolation = z.infer<typeof AxeViolationSchema>;

export const AxeAuditRequestSchema = z.object({
  url: z
    .string()
    .url()
    .describe("The URL to audit for accessibility violations"),
});
export type AxeAuditRequest = z.infer<typeof AxeAuditRequestSchema>;

export const AxeAuditResponseSchema = z.object({
  violations: z.array(AxeViolationSchema),
});
export type AxeAuditResponse = z.infer<typeof AxeAuditResponseSchema>;
